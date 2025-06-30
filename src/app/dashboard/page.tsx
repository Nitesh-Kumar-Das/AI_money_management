'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modern3DAIInsights, ReceiptScanner } from '@/components';
import { ExtractedExpenseData } from '@/lib/ocr-service';

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface ExpenseStats {
  totalAmount: number;
  totalExpenses: number;
  avgAmount: number;
}

interface CategoryStat {
  _id: string;
  total: number;
  count: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats>({ totalAmount: 0, totalExpenses: 0, avgAmount: 0 });
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const categories = {
    food: { label: '🍽️ Food & Dining', color: 'bg-orange-100 text-orange-800' },
    transport: { label: '🚗 Transportation', color: 'bg-blue-100 text-blue-800' },
    shopping: { label: '🛍️ Shopping', color: 'bg-purple-100 text-purple-800' },
    entertainment: { label: '🎬 Entertainment', color: 'bg-pink-100 text-pink-800' },
    utilities: { label: '⚡ Utilities', color: 'bg-yellow-100 text-yellow-800' },
    healthcare: { label: '🏥 Healthcare', color: 'bg-red-100 text-red-800' },
    education: { label: '📚 Education', color: 'bg-indigo-100 text-indigo-800' },
    other: { label: '📦 Other', color: 'bg-gray-100 text-gray-800' }
  } as const;

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const response = await fetch('/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth');
          return;
        }
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      setExpenses(data.expenses || []);
      setStats(data.stats || { totalAmount: 0, totalExpenses: 0, avgAmount: 0 });
      setCategoryStats(data.categoryStats || []);
    } catch (error: unknown) {
      console.error('Error fetching expenses:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleScanComplete = (extractedData: ExtractedExpenseData) => {
    localStorage.setItem('ocrData', JSON.stringify(extractedData));
    setShowReceiptScanner(false);
    router.push('/add-expense');
  };

  const handleQuickScan = (data: ExtractedExpenseData) => {
    localStorage.setItem('ocrData', JSON.stringify(data));
    router.push('/add-expense');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            {userName ? `Welcome back, ${userName}!` : 'Dashboard'} 💰
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Here's an overview of your spending</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 sm:mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-blue-700 mb-1 sm:mb-2">Total Expenses</h3>
                <p className="text-xl sm:text-3xl font-bold text-blue-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="text-2xl sm:text-4xl">💸</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-green-700 mb-1 sm:mb-2">Total Transactions</h3>
                <p className="text-xl sm:text-3xl font-bold text-green-900">{stats.totalExpenses}</p>
              </div>
              <div className="text-2xl sm:text-4xl">📊</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-purple-700 mb-1 sm:mb-2">Average Expense</h3>
                <p className="text-xl sm:text-3xl font-bold text-purple-900">{formatCurrency(stats.avgAmount)}</p>
              </div>
              <div className="text-2xl sm:text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Modern 3D AI Insights */}
        <Modern3DAIInsights
          userId="current-user"
          expenses={expenses.map(exp => ({
            date: exp.date,
            category: exp.category,
            amount: exp.amount
          }))}
          totalBudget={375000}
          className="mb-6 sm:mb-8"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Expenses */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Expenses</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReceiptScanner(true)}
                  className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl hover:bg-purple-700 transition-colors text-sm sm:text-base flex items-center gap-2"
                >
                  <span>📸</span>
                  <span className="hidden sm:inline">Scan Receipt</span>
                </button>
                <button
                  onClick={() => router.push('/add-expense')}
                  className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  + Add New
                </button>
              </div>
            </div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">No expenses yet</p>
                <button
                  onClick={() => router.push('/add-expense')}
                  className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Add Your First Expense
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {expenses.slice(0, 10).map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="text-lg sm:text-2xl flex-shrink-0">
                        {expense.category === 'food' ? '🍽️' :
                         expense.category === 'transport' ? '🚗' :
                         expense.category === 'shopping' ? '🛍️' :
                         expense.category === 'entertainment' ? '🎬' :
                         expense.category === 'utilities' ? '⚡' :
                         expense.category === 'healthcare' ? '🏥' :
                         expense.category === 'education' ? '📚' : '📦'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{expense.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-red-600 text-sm sm:text-base">{formatCurrency(expense.amount)}</p>
                      <span className={`inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs ${
                        categories[expense.category as keyof typeof categories]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {categories[expense.category as keyof typeof categories]?.label.split(' ').slice(1).join(' ') || expense.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Category Breakdown</h2>
            
            {categoryStats.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
                <p className="text-gray-500 text-sm sm:text-base">No category data yet</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {categoryStats.map((category) => (
                  <div key={category._id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="text-lg sm:text-2xl flex-shrink-0">
                        {category._id === 'food' ? '🍽️' :
                         category._id === 'transport' ? '🚗' :
                         category._id === 'shopping' ? '🛍️' :
                         category._id === 'entertainment' ? '🎬' :
                         category._id === 'utilities' ? '⚡' :
                         category._id === 'healthcare' ? '🏥' :
                         category._id === 'education' ? '📚' : '📦'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 capitalize text-sm sm:text-base">{category._id}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{category.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-gray-800 text-sm sm:text-base">{formatCurrency(category.total)}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {((category.total / stats.totalAmount) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OCR Scanner Modal */}
        {showReceiptScanner && (
          <ReceiptScanner
            onDataExtracted={handleScanComplete}
            onClose={() => setShowReceiptScanner(false)}
          />
        )}
      </div>
    </div>
  );
}
