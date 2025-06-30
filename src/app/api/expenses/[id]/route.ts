import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
    return decoded;
  } catch {
    throw new Error('Invalid token');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const decoded = verifyToken(request);
    const userId = decoded.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const resolvedParams = await params;
    const expenseId = resolvedParams.id;

    const expense = await Expense.findOne({ _id: expenseId, userId: userObjectId });
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ expense });

  } catch (error: unknown) {
    console.error('Get expense error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    if (errorMessage === 'No token provided' || errorMessage === 'Invalid token') {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const decoded = verifyToken(request);
    const userId = decoded.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const resolvedParams = await params;
    const expenseId = resolvedParams.id;
    
    const { title, amount, category, date, description } = await request.json();

    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, userId: userObjectId },
      {
        ...(title && { title }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(description !== undefined && { description })
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Expense updated successfully',
      expense
    });

  } catch (error: unknown) {
    console.error('Update expense error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'No token provided' || errorMessage === 'Invalid token') {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: errorMessage || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const decoded = verifyToken(request);
    const userId = decoded.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const resolvedParams = await params;
    const expenseId = resolvedParams.id;

    const expense = await Expense.findOneAndDelete({ _id: expenseId, userId: userObjectId });
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Expense deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Delete expense error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'No token provided' || errorMessage === 'Invalid token') {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json(
      { error: errorMessage || 'Internal server error' },
      { status: 500 }
    );
  }
}
