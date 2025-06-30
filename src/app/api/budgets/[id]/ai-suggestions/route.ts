import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Expense from '@/models/Expense';
import { verifyJWT } from '@/lib/auth';
import AIBudgetService from '@/lib/ai-budget-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const resolvedParams = await params;
    const budgetId = resolvedParams.id;
    
    // Find budget and verify ownership
    const budget = await Budget.findOne({ _id: budgetId, userId: userObjectId });
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    // Get user's expenses for AI analysis
    const expenses = await Expense.find({ userId: userObjectId });
    
    // Generate fresh AI suggestions
    const suggestions = await AIBudgetService.generateBudgetSuggestions(
      budget,
      expenses.map(exp => exp.toObject())
    );
    
    // Calculate performance metrics
    const metrics = AIBudgetService.calculateBudgetMetrics(
      budget,
      expenses.map(exp => exp.toObject())
    );
    
    // Detect unusual spending
    const unusualSpending = AIBudgetService.detectUnusualSpending(
      expenses.map(exp => exp.toObject()),
      budget.category
    );
    
    // Check if auto-adjustment is recommended
    let autoAdjustment = null;
    if (budget.autoAdjust.enabled) {
      autoAdjustment = await AIBudgetService.autoAdjustBudget(budget, suggestions);
    }
    
    return NextResponse.json({
      budget: budget.toObject(),
      aiAnalysis: {
        suggestions,
        performanceMetrics: metrics,
        unusualSpending,
        autoAdjustment,
        lastAnalyzed: new Date().toISOString()
      }
    });
  } catch (error: unknown) {
    console.error('AI suggestions error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const resolvedParams = await params;
    const budgetId = resolvedParams.id;
    const body = await req.json();
    const { action, suggestionIndex } = body;
    
    // Find budget and verify ownership
    const budget = await Budget.findOne({ _id: budgetId, userId: decoded.userId });
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    if (action === 'apply_suggestion' && suggestionIndex !== undefined) {
      const suggestion = budget.aiSuggestions[suggestionIndex];
      
      if (!suggestion || !suggestion.actionable || !suggestion.suggestedAmount) {
        return NextResponse.json({ error: 'Invalid suggestion' }, { status: 400 });
      }
      
      // Apply the suggestion
      budget.amount = suggestion.suggestedAmount;
      
      // Mark suggestion as applied by removing it or marking it
      budget.aiSuggestions.splice(suggestionIndex, 1);
      
      await budget.save();
      
      return NextResponse.json({
        budget: budget.toObject(),
        message: 'AI suggestion applied successfully'
      });
    }
    
    if (action === 'regenerate_suggestions') {
      // Get fresh expenses data
      const expenses = await Expense.find({ userId: decoded.userId });
      
      // Generate new suggestions
      const suggestions = await AIBudgetService.generateBudgetSuggestions(
        budget,
        expenses.map(exp => exp.toObject())
      );
      
      // Update budget with new suggestions
      budget.aiSuggestions = suggestions;
      await budget.save();
      
      return NextResponse.json({
        budget: budget.toObject(),
        suggestions,
        message: 'AI suggestions regenerated successfully'
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('AI action error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to perform AI action', details: errorMessage },
      { status: 500 }
    );
  }
}
