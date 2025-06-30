import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Expense from '@/models/Expense';
import { verifyJWT } from '@/lib/auth';
import AIBudgetService from '@/lib/ai-budget-service';

// Budget validation function
function validateBudget(data: {
  name?: string;
  amount?: number;
  period?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Budget name is required');
  if (!data.amount || data.amount <= 0) errors.push('Budget amount must be greater than 0');
  if (!data.period?.type) errors.push('Budget period type is required');
  if (!data.period?.startDate) errors.push('Budget start date is required');
  if (!data.period?.endDate) errors.push('Budget end date is required');
  
  if (data.period?.startDate && data.period?.endDate) {
    if (new Date(data.period.endDate) <= new Date(data.period.startDate)) {
      errors.push('End date must be after start date');
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }
    
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const includeAI = searchParams.get('includeAI') === 'true';
    
    // Build query
    const query: Record<string, unknown> = { userId: userObjectId };
    if (category) query.category = category;
    if (active !== null) query.isActive = active === 'true';
    
    const budgets = await Budget.find(query).sort({ createdAt: -1 });
    
    // Calculate actual spending for each budget from expenses
    const expenses = await Expense.find({ userId: userObjectId });
    
    console.log(`📊 Budget API: Found ${budgets.length} budgets and ${expenses.length} expenses for user`);
    
    const budgetsWithCalculatedSpending = budgets.map(budget => {
      // Calculate actual spending for this budget
      const budgetExpenses = expenses.filter(expense => 
        expense.category === budget.category &&
        new Date(expense.date) >= budget.period.startDate &&
        new Date(expense.date) <= budget.period.endDate
      );
      
      const actualSpent = budgetExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      console.log(`💰 Budget "${budget.name}" (${budget.category}): ${budgetExpenses.length} matching expenses, $${actualSpent} spent`);
      
      // Update the budget object with actual spending
      budget.spent = actualSpent;
      
      return budget;
    });
    
    // If AI analysis is requested, generate suggestions for each budget
    if (includeAI) {
      const budgetsWithAI = await Promise.all(
        budgetsWithCalculatedSpending.map(async (budget) => {
          const suggestions = await AIBudgetService.generateBudgetSuggestions(
            budget,
            expenses.map(exp => exp.toObject())
          );
          
          const metrics = AIBudgetService.calculateBudgetMetrics(budget, expenses.map(exp => exp.toObject()));
          
          const unusualSpending = AIBudgetService.detectUnusualSpending(
            expenses.map(exp => exp.toObject()),
            budget.category
          );
          
          return {
            ...budget.toObject(),
            aiSuggestions: suggestions,
            performanceMetrics: metrics,
            unusualSpending
          };
        })
      );
      
      return NextResponse.json({ budgets: budgetsWithAI });
    }
    
    return NextResponse.json({ budgets: budgetsWithCalculatedSpending.map(b => b.toObject()) });
  } catch (error: unknown) {
    console.error('Budget fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch budgets', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }
    
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);
    
    const body = await req.json();
    
    // Validate budget data
    const validation = validateBudget(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Create budget with user ID
    const budgetData = {
      ...body,
      userId: userObjectId,
      spent: 0, // Initialize spent amount
      // Initialize AI features with defaults
      aiSuggestions: [],
      autoAdjust: {
        enabled: body.autoAdjust?.enabled || false,
        maxIncrease: body.autoAdjust?.maxIncrease || 20,
        maxDecrease: body.autoAdjust?.maxDecrease || 10,
        triggers: body.autoAdjust?.triggers || [],
        lastAdjusted: null
      },
      performanceMetrics: {
        averageSpending: 0,
        spendingTrend: 'stable',
        predictedOverrun: 0,
        daysToOverrun: 0,
        seasonalPattern: [],
        comparisonToPrevious: { amount: 0, percentage: 0 }
      },
      smartAlerts: {
        enabled: body.smartAlerts?.enabled ?? true,
        predictiveWarnings: body.smartAlerts?.predictiveWarnings ?? true,
        spendingVelocityAlerts: body.smartAlerts?.spendingVelocityAlerts ?? true,
        unusualSpendingDetection: body.smartAlerts?.unusualSpendingDetection ?? true,
        goalDeviationAlerts: body.smartAlerts?.goalDeviationAlerts ?? true
      },
      budgetGoals: body.budgetGoals || {}
    };
    
    const budget = new Budget(budgetData);
    await budget.save();
    
    // Generate initial AI suggestions if user has expenses
    const expenses = await Expense.find({ userId: userObjectId });
    if (expenses.length > 0) {
      const suggestions = await AIBudgetService.generateBudgetSuggestions(
        budget,
        expenses.map(exp => exp.toObject())
      );
      
      if (suggestions.length > 0) {
        budget.aiSuggestions = suggestions;
        await budget.save();
      }
    }
    
    return NextResponse.json({ 
      budget,
      message: 'Budget created successfully'
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Budget creation error:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create budget', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }
    
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);
    
    const body = await req.json();
    const { budgetId, ...updateData } = body;
    
    if (!budgetId) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 });
    }
    
    // Find budget and verify ownership
    const budget = await Budget.findOne({ _id: budgetId, userId: userObjectId });
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    // Update budget
    Object.assign(budget, updateData);
    await budget.save();
    
    // Regenerate AI suggestions after update
    const expenses = await Expense.find({ userId: userObjectId });
    const suggestions = await AIBudgetService.generateBudgetSuggestions(
      budget,
      expenses.map(exp => exp.toObject())
    );
    
    // Check for auto-adjustment
    if (budget.autoAdjust.enabled) {
      const adjustment = await AIBudgetService.autoAdjustBudget(budget, suggestions);
      if (adjustment.adjusted && adjustment.newAmount) {
        budget.amount = adjustment.newAmount;
        budget.autoAdjust.lastAdjusted = new Date();
        await budget.save();
        
        return NextResponse.json({
          budget,
          autoAdjusted: true,
          adjustmentReason: adjustment.reason,
          message: 'Budget updated and auto-adjusted based on AI suggestions'
        });
      }
    }
    
    // Update AI suggestions
    budget.aiSuggestions = suggestions;
    await budget.save();
    
    return NextResponse.json({ 
      budget,
      message: 'Budget updated successfully'
    });
  } catch (error: unknown) {
    console.error('Budget update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update budget', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }
    
    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);
    
    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get('id');
    
    if (!budgetId) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 });
    }
    
    // Find and delete budget (verify ownership)
    const budget = await Budget.findOneAndDelete({ _id: budgetId, userId: userObjectId });
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error: unknown) {
    console.error('Budget deletion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to delete budget', details: errorMessage },
      { status: 500 }
    );
  }
}
