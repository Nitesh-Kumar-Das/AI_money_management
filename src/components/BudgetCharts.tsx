'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

interface Budget {
  _id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  performanceMetrics?: {
    averageSpending: number;
    spendingTrend: 'increasing' | 'decreasing' | 'stable';
    predictedOverrun: number;
    daysToOverrun: number;
  };
  aiSuggestions?: Array<{
    type: string;
    message: string;
    confidence: number;
    suggestedAmount?: number;
  }>;
}

interface BudgetChartsProps {
  budgets: Budget[];
  className?: string;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];

const CATEGORY_COLORS: Record<string, string> = {
  food: '#ff6b6b',
  transport: '#4ecdc4',
  shopping: '#45b7d1',
  entertainment: '#f9ca24',
  utilities: '#f0932b',
  healthcare: '#eb4d4b',
  education: '#6c5ce7',
  other: '#a55eea'
};

export default function BudgetCharts({ budgets, className = '' }: BudgetChartsProps) {
  // Prepare data for different charts
  const budgetUtilizationData = budgets.map(budget => ({
    name: budget.name,
    category: budget.category,
    budgeted: budget.amount,
    spent: budget.spent,
    remaining: Math.max(0, budget.amount - budget.spent),
    utilization: ((budget.spent / budget.amount) * 100).toFixed(1),
    overBudget: budget.spent > budget.amount
  }));

  const categorySpendingData = budgets.reduce((acc, budget) => {
    const existing = acc.find(item => item.category === budget.category);
    if (existing) {
      existing.spent += budget.spent;
      existing.budgeted += budget.amount;
    } else {
      acc.push({
        category: budget.category,
        spent: budget.spent,
        budgeted: budget.amount,
        color: CATEGORY_COLORS[budget.category] || '#8884d8'
      });
    }
    return acc;
  }, [] as Array<{category: string; spent: number; budgeted: number; color: string}>);

  const spendingTrendData = budgets
    .filter(budget => budget.performanceMetrics)
    .map(budget => ({
      name: budget.name,
      category: budget.category,
      averageSpending: budget.performanceMetrics!.averageSpending,
      predictedOverrun: budget.performanceMetrics!.predictedOverrun,
      daysToOverrun: budget.performanceMetrics!.daysToOverrun,
      trend: budget.performanceMetrics!.spendingTrend
    }));

  const aiConfidenceData = budgets
    .filter(budget => budget.aiSuggestions && budget.aiSuggestions.length > 0)
    .map(budget => ({
      name: budget.name,
      avgConfidence: budget.aiSuggestions!.reduce((sum, suggestion) => sum + suggestion.confidence, 0) / budget.aiSuggestions!.length,
      suggestions: budget.aiSuggestions!.length
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ₹${entry.value?.toLocaleString() || 0}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PercentageTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p style={{ color: payload[0].color }}>
            {`Utilization: ${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Budget Utilization Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          📊 Budget Utilization Overview
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={budgetUtilizationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="budgeted" fill="#e3f2fd" name="Budgeted Amount" />
            <Bar dataKey="spent" fill="#2196f3" name="Spent Amount" />
            <Bar dataKey="remaining" fill="#4caf50" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🥧 Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySpendingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, spent }) => `${category}: ₹${spent.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="spent"
              >
                {categorySpendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📈 Budget vs Actual Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySpendingData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budgeted" fill="#e0e0e0" name="Budgeted" />
              <Bar dataKey="spent" fill="#ff6b6b" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Utilization Percentages */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          📊 Budget Utilization Percentages
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetUtilizationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis label={{ value: 'Utilization %', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<PercentageTooltip />} />
            <Bar 
              dataKey="utilization" 
              name="Utilization %"
            >
              {budgetUtilizationData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.overBudget ? '#ff6b6b' : '#4caf50'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Performance Metrics */}
      {spendingTrendData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            🤖 AI Spending Predictions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="averageSpending" 
                stroke="#8884d8" 
                strokeWidth={3}
                name="Average Spending"
              />
              <Line 
                type="monotone" 
                dataKey="predictedOverrun" 
                stroke="#ff6b6b" 
                strokeWidth={3}
                name="Predicted Overrun"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI Confidence Levels */}
      {aiConfidenceData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            🎯 AI Suggestion Confidence
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={aiConfidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Confidence']}
              />
              <Bar dataKey="avgConfidence" fill="#9c88ff" name="AI Confidence" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Total Budgeted</h4>
          <p className="text-3xl font-bold text-blue-900">
            ${budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
          <h4 className="text-lg font-semibold text-red-800 mb-2">Total Spent</h4>
          <p className="text-3xl font-bold text-red-900">
            ${budgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-2">Overall Utilization</h4>
          <p className="text-3xl font-bold text-green-900">
            {((budgets.reduce((sum, b) => sum + b.spent, 0) / budgets.reduce((sum, b) => sum + b.amount, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
