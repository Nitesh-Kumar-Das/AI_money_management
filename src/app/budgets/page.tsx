'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BudgetCharts } from '@/components';
import { 
  PlusIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Budget {
  _id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: {
    type: string;
    startDate: string;
    endDate: string;
  };
  aiSuggestions?: AISuggestion[];
  performanceMetrics?: {
    averageSpending: number;
    spendingTrend: 'increasing' | 'decreasing' | 'stable';
    predictedOverrun: number;
    daysToOverrun: number;
  };
  unusualSpending?: {
    hasUnusualActivity: boolean;
    alerts: string[];
    confidence: number;
  };
  smartAlerts: {
    enabled: boolean;
    predictiveWarnings: boolean;
    spendingVelocityAlerts: boolean;
    unusualSpendingDetection: boolean;
    goalDeviationAlerts: boolean;
  };
  autoAdjust: {
    enabled: boolean;
    maxIncrease: number;
    maxDecrease: number;
    triggers: string[];
    lastAdjusted?: string;
  };
}

interface AISuggestion {
  type: 'increase' | 'decrease' | 'optimize' | 'alert' | 'recommendation';
  message: string;
  confidence: number;
  reasoning: string[];
  suggestedAmount?: number;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  generatedAt: string;
}

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [includeAI, setIncludeAI] = useState(true);
  
  const [newBudget, setNewBudget] = useState({
    name: '',
    category: 'other',
    amount: '',
    period: {
      type: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    autoAdjust: {
      enabled: false,
      maxIncrease: 20,
      maxDecrease: 10,
      triggers: []
    },
    smartAlerts: {
      enabled: true,
      predictiveWarnings: true,
      spendingVelocityAlerts: true,
      unusualSpendingDetection: true,
      goalDeviationAlerts: true
    }
  });

  const fetchBudgets = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const response = await fetch(`/api/budgets?includeAI=${includeAI}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBudgets(data.budgets);
      } else {
        console.error('Failed to fetch budgets');
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  }, [includeAI, router]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newBudget,
          amount: parseFloat(newBudget.amount)
        })
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewBudget({
          name: '',
          category: 'other',
          amount: '',
          period: {
            type: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          autoAdjust: {
            enabled: false,
            maxIncrease: 20,
            maxDecrease: 10,
            triggers: []
          },
          smartAlerts: {
            enabled: true,
            predictiveWarnings: true,
            spendingVelocityAlerts: true,
            unusualSpendingDetection: true,
            goalDeviationAlerts: true
          }
        });
        fetchBudgets();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Failed to create budget');
    }
  };

  const applyAISuggestion = async (budgetId: string, suggestion: AISuggestion) => {
    if (!suggestion.suggestedAmount) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/budgets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          budgetId,
          amount: suggestion.suggestedAmount
        })
      });

      if (response.ok) {
        fetchBudgets();
        alert('Budget updated based on AI suggestion!');
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'alert': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'increase': return <ArrowTrendingUpIcon className="w-5 h-5" />;
      case 'decrease': return <ArrowTrendingDownIcon className="w-5 h-5" />;
      case 'optimize': return <AdjustmentsHorizontalIcon className="w-5 h-5" />;
      default: return <LightBulbIcon className="w-5 h-5" />;
    }
  };

  const getSuggestionColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (priority === 'medium') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getUtilizationPercentage = (budget: Budget) => {
    return Math.round((budget.spent / budget.amount) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Smart Budgets</h1>
            <p className="text-sm sm:text-base text-gray-600">AI-powered budget management and insights</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIncludeAI(!includeAI)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                includeAI 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white text-purple-600 border border-purple-600'
              }`}
            >
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
              AI Insights {includeAI ? 'On' : 'Off'}
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Create Budget
            </button>
          </div>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {budgets.map((budget) => {
            const utilizationPercentage = getUtilizationPercentage(budget);
            const remaining = budget.amount - budget.spent;
            
            return (
              <div
                key={budget._id}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all"
              >
                {/* Budget Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{budget.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 capitalize">{budget.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{budget.amount}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{budget.period.type}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                    <span>Spent: ₹{budget.spent}</span>
                    <span>Remaining: ₹{remaining}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getUtilizationColor(utilizationPercentage)}`}
                      style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{utilizationPercentage}% utilized</p>
                </div>

                {/* AI Features */}
                {includeAI && (
                  <div className="space-y-3">
                    {/* Performance Metrics */}
                    {budget.performanceMetrics && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <ChartBarIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Performance</span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Trend:</span>
                            <span className={`font-medium ${
                              budget.performanceMetrics.spendingTrend === 'increasing' ? 'text-red-600' :
                              budget.performanceMetrics.spendingTrend === 'decreasing' ? 'text-green-600' :
                              'text-gray-600'
                            }`}>
                              {budget.performanceMetrics.spendingTrend}
                            </span>
                          </div>
                          {budget.performanceMetrics.predictedOverrun > 0 && (
                            <div className="flex justify-between">
                              <span>Predicted overrun:</span>
                              <span className="font-medium text-red-600">
                                ${budget.performanceMetrics.predictedOverrun.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Suggestions */}
                    {budget.aiSuggestions && budget.aiSuggestions.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <SparklesIcon className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
                        </div>
                        {budget.aiSuggestions.slice(0, 2).map((suggestion, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border text-xs ${getSuggestionColor(suggestion.type, suggestion.priority)}`}
                          >
                            <div className="flex items-start gap-2">
                              {getSuggestionIcon(suggestion.type)}
                              <div className="flex-1">
                                <p className="font-medium mb-1">{suggestion.message}</p>
                                <p className="text-xs opacity-75">
                                  Confidence: {suggestion.confidence}%
                                </p>
                                {suggestion.actionable && suggestion.suggestedAmount && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      applyAISuggestion(budget._id, suggestion);
                                    }}
                                    className="mt-2 px-3 py-1 bg-white bg-opacity-50 rounded text-xs font-medium hover:bg-opacity-75 transition-all"
                                  >
                                    Apply (${suggestion.suggestedAmount})
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Unusual Spending Alert */}
                    {budget.unusualSpending?.hasUnusualActivity && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-orange-600">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">Unusual Activity Detected</span>
                        </div>
                        <p className="text-xs text-orange-600 mt-1">
                          {budget.unusualSpending.alerts[0]}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Auto-adjust indicator */}
                {budget.autoAdjust.enabled && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                    <AdjustmentsHorizontalIcon className="w-4 h-4" />
                    <span>Auto-adjust enabled</span>
                    {budget.autoAdjust.lastAdjusted && (
                      <span className="text-gray-500">
                        (Last: {new Date(budget.autoAdjust.lastAdjusted).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Budget Analytics Charts */}
        {budgets.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AI Budget Analytics</h2>
                  <p className="text-gray-600">Visual insights and performance metrics for your budgets</p>
                </div>
              </div>
              <BudgetCharts budgets={budgets} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {budgets.length === 0 && (
          <div className="text-center py-12">
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets yet</h3>
            <p className="text-gray-600 mb-6">Create your first smart budget to get AI-powered insights</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Create Your First Budget
            </button>
          </div>
        )}

        {/* Create Budget Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Create Smart Budget</h2>
              
              <form onSubmit={createBudget} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Budget Name
                  </label>
                  <input
                    type="text"
                    value={newBudget.name}
                    onChange={(e) => setNewBudget({...newBudget, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="travel">Travel</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Budget Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Period
                    </label>
                    <select
                      value={newBudget.period.type}
                      onChange={(e) => setNewBudget({
                        ...newBudget,
                        period: {...newBudget.period, type: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBudget.autoAdjust.enabled}
                      onChange={(e) => setNewBudget({
                        ...newBudget,
                        autoAdjust: {...newBudget.autoAdjust, enabled: e.target.checked}
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Enable auto-adjustment</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBudget.smartAlerts.enabled}
                      onChange={(e) => setNewBudget({
                        ...newBudget,
                        smartAlerts: {...newBudget.smartAlerts, enabled: e.target.checked}
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Enable smart alerts</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Create Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
