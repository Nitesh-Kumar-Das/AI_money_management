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


const CATEGORY_COLORS: Record<string, string> = {
  food: '#1a1a1a',
  transport: '#404040',
  shopping: '#666666',
  entertainment: '#8c8c8c',
  utilities: '#b3b3b3',
  healthcare: '#4b5563',
  education: '#1f2937',
  other: '#9ca3af'
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
        color: CATEGORY_COLORS[budget.category] || '#666666'
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

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs font-sans">
          <p className="font-semibold mb-1 text-gray-900">{`${label}`}</p>
          {payload.map((entry: { name: string; value: number; color?: string }, index: number) => (
            <p key={index} style={{ color: entry.color === '#e3f2fd' ? '#6b7280' : entry.color }} className="text-gray-700">
              {`${entry.name}: ₹${entry.value?.toLocaleString() || 0}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PercentageTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color?: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs font-sans">
          <p className="font-semibold mb-1 text-gray-900">{`${label}`}</p>
          <p className="text-gray-700">
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
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-5">
          Budget Utilization Overview
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={budgetUtilizationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={10}
              stroke="#9ca3af"
            />
            <YAxis stroke="#9ca3af" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="budgeted" fill="#e5e7eb" name="Budgeted Amount" />
            <Bar dataKey="spent" fill="#4b5563" name="Spent Amount" />
            <Bar dataKey="remaining" fill="#9ca3af" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={260}>
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

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">
            Budget vs Actual Spending
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categorySpendingData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" fontSize={10} />
              <YAxis dataKey="category" type="category" width={80} stroke="#9ca3af" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="budgeted" fill="#e5e7eb" name="Budgeted" />
              <Bar dataKey="spent" fill="#4b5563" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Utilization Percentages */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-5">
          Budget Utilization Percentages
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={budgetUtilizationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={10}
              stroke="#9ca3af"
            />
            <YAxis stroke="#9ca3af" fontSize={10} label={{ value: 'Utilization %', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: '10px' } }} />
            <Tooltip content={<PercentageTooltip />} />
            <Bar 
              dataKey="utilization" 
              name="Utilization %"
            >
              {budgetUtilizationData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.overBudget ? '#111827' : '#9ca3af'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Performance Metrics */}
      {spendingTrendData.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">
            AI Spending Predictions
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={spendingTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
              <YAxis stroke="#9ca3af" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="averageSpending" 
                stroke="#4b5563" 
                strokeWidth={2}
                name="Average Spending"
              />
              <Line 
                type="monotone" 
                dataKey="predictedOverrun" 
                stroke="#111827" 
                strokeWidth={2}
                name="Predicted Overrun"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI Confidence Levels */}
      {aiConfidenceData.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">
            AI Suggestion Confidence
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={aiConfidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
              <YAxis stroke="#9ca3af" fontSize={10} label={{ value: 'Confidence %', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: '10px' } }} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Confidence']}
              />
              <Bar dataKey="avgConfidence" fill="#4b5563" name="AI Confidence" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Budgeted</h4>
          <p className="text-2xl font-bold text-gray-900">
            ₹{budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h4>
          <p className="text-2xl font-bold text-gray-900">
            ₹{budgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Overall Utilization</h4>
          <p className="text-2xl font-bold text-gray-900">
            {((budgets.reduce((sum, b) => sum + b.spent, 0) / budgets.reduce((sum, b) => sum + b.amount, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
