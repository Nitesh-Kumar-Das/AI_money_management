'use client';

import { useEffect, useState } from 'react';
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

const CHART_COLORS = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1'  // Indigo
];

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍽️',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎬',
  utilities: '⚡',
  healthcare: '🏥',
  education: '📚',
  other: '📦'
};

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

  useEffect(() => {
    loadAIInsights();
  }, [userId, expenses, totalBudget]);

  const loadAIInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      if (!expenses || expenses.length === 0) {
        setError('No expense data available for AI analysis');
        return;
      }
      
      const budgetInsights = await aiMLService.generateBudgetInsightsForUser(userId, expenses);
      setInsights(budgetInsights);
      
      const advice = await aiMLService.getQuickBudgetAdvice(totalBudget, expenses);
      setQuickAdvice(advice);
      
    } catch (error) {
      console.error('💥 Error loading AI insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const predictionChartData = insights ? Object.entries(insights.predictions).map(([category, amount], index) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount,
    color: CHART_COLORS[index % CHART_COLORS.length],
    icon: CATEGORY_ICONS[category] || '📦'
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
        icon: CATEGORY_ICONS[expense.category] || '📦'
      });
    }
    return acc;
  }, [] as Array<{category: string; amount: number; count: number; color: string; icon: string}>);

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
    { name: 'Spent', value: expenses.reduce((sum, exp) => sum + exp.amount, 0), color: '#EF4444' },
    { name: 'Remaining', value: Math.max(0, totalBudget - expenses.reduce((sum, exp) => sum + exp.amount, 0)), color: '#10B981' }
  ];

  const radarData = predictionChartData.map(item => ({
    category: item.category,
    predicted: item.amount,
    actual: categorySpendingData.find(c => c.category === item.category)?.amount || 0,
    fullMark: Math.max(item.amount, categorySpendingData.find(c => c.category === item.category)?.amount || 0) * 1.2
  }));

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-2xl p-8 border border-blue-200 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-blue-100/30"></div>
          </div>
          <span className="ml-4 text-gray-700 font-medium text-lg">Loading AI insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-50 via-white to-rose-50 rounded-3xl shadow-2xl p-8 border border-red-200 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Service Issue</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={loadAIInsights}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* AI Status Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-blue-200 shadow-2xl">
        <div className="flex items-center">
          <div className="text-3xl sm:text-4xl mr-3 sm:mr-4 animate-pulse">🤖</div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">AI Budget Intelligence</h2>
            <p className="text-sm sm:text-base text-gray-600">Advanced machine learning insights for your financial future</p>
          </div>
        </div>
      </div>

      {/* Quick Status Card */}
      {quickAdvice && (
        <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border backdrop-blur-xl transform transition-all hover:scale-[1.02] ${
          quickAdvice.status === 'on_track' 
            ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-300' 
            : quickAdvice.status === 'warning'
            ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 border-yellow-300'
            : 'bg-gradient-to-br from-red-50 via-rose-50 to-red-50 border-red-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-0 sm:mr-6 text-center sm:text-left">
              {quickAdvice.status === 'on_track' ? '🎯' : quickAdvice.status === 'warning' ? '⚠️' : '🚨'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center sm:text-left">Budget Status</h3>
              <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6 text-center sm:text-left">{quickAdvice.message}</p>
              
              {quickAdvice.suggestions.length > 0 && (
                <div className="bg-white/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm border border-gray-200">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">💡 AI Suggestions:</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {quickAdvice.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start text-gray-700 text-sm sm:text-base">
                        <span className="text-purple-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0">▶</span>
                        <span className="leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Budget Utilization - 3D Pie Chart */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-blue-200 backdrop-blur-xl">
          <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
            <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🎯</span>
            Budget Utilization
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <defs>
                <linearGradient id="pieGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="pieGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Pie
                data={budgetUtilizationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => `${name}: ₹${Math.round(value || 0).toLocaleString()}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth={2}
              >
                {budgetUtilizationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? "url(#pieGradient1)" : "url(#pieGradient2)"} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#1f2937',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [`₹${Math.round(value).toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI Predictions - 3D Bar Chart */}
        {predictionChartData.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-purple-200 backdrop-blur-xl">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🔮</span>
              AI Spending Predictions
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={predictionChartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="category" 
                  stroke="#374151"
                  fontSize={9}
                  fontWeight="500"
                />
                <YAxis 
                  stroke="#374151"
                  fontSize={9}
                  fontWeight="500"
                  tickFormatter={(value) => `₹${Math.round(value)}`}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#1f2937',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`₹${Math.round(value)}`, 'Predicted']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Advanced Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Spending Trend - Area Chart */}
        {spendingTrendData.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-emerald-200 backdrop-blur-xl">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">📈</span>
              Spending Trend Analysis
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={spendingTrendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#374151"
                  fontSize={10}
                  fontWeight="500"
                />
                <YAxis 
                  stroke="#374151"
                  fontSize={9}
                  fontWeight="500"
                  tickFormatter={(value) => `₹${Math.round(value)}`}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    color: '#1f2937',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`₹${Math.round(value)}`, 'Amount']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Prediction vs Actual - Radar Chart */}
        {radarData.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-indigo-200 backdrop-blur-xl">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🎯</span>
              Prediction Accuracy
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" stroke="rgba(0,0,0,0.2)" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#374151', fontSize: 10, fontWeight: 500 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 'dataMax']}
                  tick={{ fill: '#374151', fontSize: 8 }}
                  tickFormatter={(value) => `₹${Math.round(value)}`}
                />
                <Radar
                  name="Predicted"
                  dataKey="predicted"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Actual"
                  dataKey="actual"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '12px',
                    color: '#1f2937',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`₹${Math.round(value)}`, '']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* AI Insights Cards */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Recommendations */}
          {insights.recommendations.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-green-200">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">💡</span>
                Smart Recommendations
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {insights.recommendations.slice(0, 4).map((recommendation, index) => (
                  <div key={index} className="bg-white/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm border border-green-200 transform transition-all hover:scale-[1.02]">
                    <div className="flex items-start">
                      <span className="text-green-600 text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0">▶</span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts & Optimization */}
          <div className="space-y-4 sm:space-y-6">
            {insights.alerts.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-red-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🚨</span>
                  Budget Alerts
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {insights.alerts.slice(0, 2).map((alert, index) => (
                    <div key={index} className="bg-white/80 rounded-lg sm:rounded-xl p-2.5 sm:p-3 backdrop-blur-sm border border-red-200">
                      <p className="text-gray-700 text-xs sm:text-sm">{alert}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights.optimizationTips.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-purple-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🎯</span>
                  Optimization Tips
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {insights.optimizationTips.slice(0, 2).map((tip, index) => (
                    <div key={index} className="bg-white/80 rounded-lg sm:rounded-xl p-2.5 sm:p-3 backdrop-blur-sm border border-purple-200">
                      <p className="text-gray-700 text-xs sm:text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={loadAIInsights}
          className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-purple-300"
        >
          <span className="mr-2 sm:mr-3">🔄</span>
          Refresh AI Analysis
        </button>
      </div>
    </div>
  );
}
