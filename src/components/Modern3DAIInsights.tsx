'use client';

import { useEffect, useState, useCallback } from 'react';
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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import aiMLService from '@/lib/ai-ml-service';
import {
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldExclamationIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

interface BudgetInsight {
  predictions: Record<string, number>;
  recommendations: string[];
  alerts: string[];
  optimizationTips: string[];
}

interface QuickAdvice {
  status: 'on_track' | 'warning' | 'over_budget';
  message: string;
  suggestions: string[];
}

interface AIBudgetInsightsProps {
  userId: string;
  expenses: Array<{
    date: string;
    category: string;
    amount: number;
  }>;
  totalBudget: number;
  className?: string;
}

// Monochrome chart colors
const CHART_COLORS = [
  '#1a1a1a', // Near black
  '#404040', // Dark gray
  '#666666', // Medium gray
  '#8c8c8c', // Gray
  '#b3b3b3', // Light gray
  '#cccccc', // Lighter gray
  '#4a4a4a', // Charcoal
  '#737373', // Warm gray
  '#595959', // Dark warm gray
  '#a6a6a6'  // Muted gray
];

export default function Modern3DAIInsights({ 
  userId, 
  expenses, 
  totalBudget, 
  className = '' 
}: AIBudgetInsightsProps) {
  const [insights, setInsights] = useState<BudgetInsight | null>(null);
  const [quickAdvice, setQuickAdvice] = useState<QuickAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAIInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!expenses || expenses.length === 0) {
        setError('No expense data available for AI analysis');
        return;
      }
      
      const budgetInsights = await aiMLService.generateBudgetInsightsForUser(userId, expenses);
      setInsights(budgetInsights);
      
      const advice = await aiMLService.getQuickBudgetAdvice(totalBudget, expenses);
      setQuickAdvice(advice);
      
    } catch (error) {
      console.error('Error loading AI insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  }, [userId, expenses, totalBudget]);

  useEffect(() => {
    loadAIInsights();
  }, [loadAIInsights]);

  // Prepare chart data
  const predictionChartData = insights ? Object.entries(insights.predictions).map(([category, amount], index) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount,
    color: CHART_COLORS[index % CHART_COLORS.length],
  })) : [];

  const categorySpendingData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
      existing.count += 1;
    } else {
      acc.push({
        category: expense.category.charAt(0).toUpperCase() + expense.category.slice(1),
        amount: expense.amount,
        count: 1,
        color: CHART_COLORS[acc.length % CHART_COLORS.length],
      });
    }
    return acc;
  }, [] as Array<{category: string; amount: number; count: number; color: string}>);

  const spendingTrendData = expenses
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ date, amount: expense.amount });
      }
      return acc;
    }, [] as Array<{date: string; amount: number}>);

  const budgetUtilizationData = [
    { name: 'Spent', value: expenses.reduce((sum, exp) => sum + exp.amount, 0), color: '#404040' },
    { name: 'Remaining', value: Math.max(0, totalBudget - expenses.reduce((sum, exp) => sum + exp.amount, 0)), color: '#d1d5db' }
  ];

  const radarData = predictionChartData.map(item => ({
    category: item.category,
    predicted: item.amount,
    actual: categorySpendingData.find(c => c.category === item.category)?.amount || 0,
    fullMark: Math.max(item.amount, categorySpendingData.find(c => c.category === item.category)?.amount || 0) * 1.2
  }));

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-8 shadow-sm ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-900"></div>
          <span className="ml-4 text-gray-500 text-sm">Loading AI insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-8 shadow-sm ${className}`}>
        <div className="text-center">
          <ExclamationTriangleIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Service Issue</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={loadAIInsights}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  const tooltipStyle = {
    background: 'rgba(255, 255, 255, 0.97)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#1a1a1a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontSize: '12px',
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* AI Status Header */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Budget Intelligence</h2>
            <p className="text-sm text-gray-500">Advanced insights for your financial future</p>
          </div>
        </div>
      </div>

      {/* Quick Status Card */}
      {quickAdvice && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {quickAdvice.status === 'on_track' ? (
                <ChartBarIcon className="w-5 h-5 text-gray-600" />
              ) : quickAdvice.status === 'warning' ? (
                <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <ShieldExclamationIcon className="w-5 h-5 text-gray-900" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Budget Status</h3>
              <p className="text-sm text-gray-600 mb-4">{quickAdvice.message}</p>
              
              {quickAdvice.suggestions.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">AI Suggestions</h4>
                  <ul className="space-y-1.5">
                    {quickAdvice.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2.5 flex-shrink-0"></span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Budget Utilization */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">Budget Utilization</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={budgetUtilizationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: { name?: string; value?: number }) => `${name}: ₹${Math.round(value || 0).toLocaleString()}`}
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {budgetUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`₹${Math.round(value).toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI Predictions */}
        {predictionChartData.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-5">AI Spending Predictions</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={predictionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#9ca3af" fontSize={10} fontWeight={500} />
                <YAxis stroke="#9ca3af" fontSize={10} fontWeight={500} tickFormatter={(value) => `₹${Math.round(value)}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${Math.round(value)}`, 'Predicted']} />
                <Bar dataKey="amount" fill="#404040" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Spending Trend */}
        {spendingTrendData.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Spending Trend Analysis</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={spendingTrendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} fontWeight={500} />
                <YAxis stroke="#9ca3af" fontSize={10} fontWeight={500} tickFormatter={(value) => `₹${Math.round(value)}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${Math.round(value)}`, 'Amount']} />
                <Area type="monotone" dataKey="amount" stroke="#4b5563" strokeWidth={2} fill="url(#trendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Prediction Accuracy</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} tick={{ fill: '#9ca3af', fontSize: 8 }} tickFormatter={(value) => `₹${Math.round(value)}`} />
                <Radar name="Predicted" dataKey="predicted" stroke="#374151" fill="#374151" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Actual" dataKey="actual" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${Math.round(value)}`, '']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* AI Insights Cards */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recommendations */}
          {insights.recommendations.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <LightBulbIcon className="w-5 h-5 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">Recommendations</h3>
              </div>
              <div className="space-y-2.5">
                {insights.recommendations.slice(0, 4).map((recommendation, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts & Optimization */}
          <div className="space-y-5">
            {insights.alerts.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
                  <h3 className="text-base font-semibold text-gray-900">Alerts</h3>
                </div>
                <div className="space-y-2">
                  {insights.alerts.slice(0, 2).map((alert, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">{alert}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights.optimizationTips.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
                  <h3 className="text-base font-semibold text-gray-900">Optimization Tips</h3>
                </div>
                <div className="space-y-2">
                  {insights.optimizationTips.slice(0, 2).map((tip, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadAIInsights}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Refresh AI Analysis
        </button>
      </div>
    </div>
  );
}
