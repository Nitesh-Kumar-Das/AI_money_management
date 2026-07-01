'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BudgetCharts from '@/components/BudgetCharts';
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
      case 'alert': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'increase': return <ArrowTrendingUpIcon className="w-4 h-4" />;
      case 'decrease': return <ArrowTrendingDownIcon className="w-4 h-4" />;
      case 'optimize': return <AdjustmentsHorizontalIcon className="w-4 h-4" />;
      default: return <LightBulbIcon className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (priority: string) => {
    if (priority === 'high') return 'text-gray-900 bg-gray-100 border-gray-300';
    if (priority === 'medium') return 'text-gray-700 bg-gray-50 border-gray-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getUtilizationPercentage = (budget: Budget) => {
    return Math.round((budget.spent / budget.amount) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-gray-900';
    if (percentage >= 75) return 'bg-gray-700';
    if (percentage >= 50) return 'bg-gray-500';
    return 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading your budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Smart Budgets</h1>
            <p className="text-sm text-gray-500">AI-powered budget management and insights</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIncludeAI(!includeAI)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                includeAI 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <SparklesIcon className="w-4 h-4" />
              AI Insights {includeAI ? 'On' : 'Off'}
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Create Budget
            </button>
          </div>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {budgets.map((budget) => {
            const utilizationPercentage = getUtilizationPercentage(budget);
            const remaining = budget.amount - budget.spent;
            
            return (
              <div
                key={budget._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                {/* Budget Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{budget.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{budget.category}</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-lg font-bold text-gray-900">₹{budget.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{budget.period.type}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Spent: ₹{budget.spent.toLocaleString()}</span>
                    <span>Remaining: ₹{remaining.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${getUtilizationColor(utilizationPercentage)}`}
                      style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{utilizationPercentage}% utilized</p>
                </div>

                {/* AI Features */}
                {includeAI && (
                  <div className="space-y-2.5">
                    {/* Performance Metrics */}
                    {budget.performanceMetrics && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <ChartBarIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs font-medium text-gray-600">Performance</span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Trend:</span>
                            <span className="font-medium text-gray-700">
                              {budget.performanceMetrics.spendingTrend}
                            </span>
                          </div>
                          {budget.performanceMetrics.predictedOverrun > 0 && (
                            <div className="flex justify-between">
                              <span>Predicted overrun:</span>
                              <span className="font-medium text-gray-900">
                                ₹{budget.performanceMetrics.predictedOverrun.toFixed(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Suggestions */}
                    {budget.aiSuggestions && budget.aiSuggestions.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <SparklesIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs font-medium text-gray-600">AI Suggestions</span>
                        </div>
                        {budget.aiSuggestions.slice(0, 2).map((suggestion, index) => (
                          <div
                            key={index}
                            className={`p-2.5 rounded-lg border text-xs ${getSuggestionColor(suggestion.priority)}`}
                          >
                            <div className="flex items-start gap-1.5">
                              {getSuggestionIcon(suggestion.type)}
                              <div className="flex-1">
                                <p className="font-medium mb-0.5">{suggestion.message}</p>
                                <p className="text-xs opacity-60">
                                  Confidence: {suggestion.confidence}%
                                </p>
                                {suggestion.actionable && suggestion.suggestedAmount && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      applyAISuggestion(budget._id, suggestion);
                                    }}
                                    className="mt-1.5 px-2.5 py-1 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                                  >
                                    Apply (₹{suggestion.suggestedAmount})
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
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Unusual Activity Detected</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {budget.unusualSpending.alerts[0]}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Auto-adjust indicator */}
                {budget.autoAdjust.enabled && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                    <span>Auto-adjust enabled</span>
                    {budget.autoAdjust.lastAdjusted && (
                      <span className="text-gray-400">
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Budget Analytics</h2>
                  <p className="text-sm text-gray-500">Visual insights and performance metrics</p>
                </div>
              </div>
              <BudgetCharts budgets={budgets} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {budgets.length === 0 && (
          <div className="text-center py-16">
            <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No budgets yet</h3>
            <p className="text-gray-500 text-sm mb-6">Create your first smart budget to get AI-powered insights</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              Create Your First Budget
            </button>
          </div>
        )}

        {/* Create Budget Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Create Budget</h2>
              
              <form onSubmit={createBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Name
                  </label>
                  <input
                    type="text"
                    value={newBudget.name}
                    onChange={(e) => setNewBudget({...newBudget, name: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50 text-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Amount (INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50 text-sm"
                    required
                  />
                </div>

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
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50 text-sm"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="space-y-2.5 pt-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBudget.autoAdjust.enabled}
                      onChange={(e) => setNewBudget({
                        ...newBudget,
                        autoAdjust: {...newBudget.autoAdjust, enabled: e.target.checked}
                      })}
                      className="mr-2.5 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Enable auto-adjustment</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBudget.smartAlerts.enabled}
                      onChange={(e) => setNewBudget({
                        ...newBudget,
                        smartAlerts: {...newBudget.smartAlerts, enabled: e.target.checked}
                      })}
                      className="mr-2.5 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Enable smart alerts</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
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
