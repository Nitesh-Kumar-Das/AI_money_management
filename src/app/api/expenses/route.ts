import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';
import mongoose from 'mongoose';

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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const decoded = verifyToken(request);
    const userId = decoded.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const query: Record<string, unknown> = { userId: userObjectId };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {} as Record<string, Date>;
      if (startDate) (query.date as Record<string, Date>).$gte = new Date(startDate);
      if (endDate) (query.date as Record<string, Date>).$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await Expense.countDocuments(query);

    const stats = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalExpenses: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    const categoryStats = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return NextResponse.json({
      expenses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      stats: stats[0] || { totalAmount: 0, totalExpenses: 0, avgAmount: 0 },
      categoryStats
    });

  } catch (error: unknown) {
    console.error('Get expenses error:', error);
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const decoded = verifyToken(request);
    const userId = decoded.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const { title, amount, category, date, description } = await request.json();

    if (!title || !amount || !category || !date) {
      return NextResponse.json(
        { error: 'Please provide all required fields (title, amount, category, date)' },
        { status: 400 }
      );
    }

    const expense = await Expense.create({
      userId: userObjectId,
      title,
      amount: parseFloat(amount),
      category,
      date: new Date(date),
      description
    });

    return NextResponse.json({
      message: 'Expense created successfully',
      expense
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create expense error:', error);
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
