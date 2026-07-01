'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Modern3DAIInsights from '@/components/Modern3DAIInsights';
import ReceiptScanner from '@/components/ReceiptScanner';
import { ExtractedExpenseData } from '@/lib/ocr-service';
import {
  BanknotesIcon,
  ArrowsRightLeftIcon,
  CalculatorIcon,
  DocumentTextIcon,
  CameraIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

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

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Food & Dining',
  transport: 'Transportation',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  utilities: 'Utilities',
  healthcare: 'Healthcare',
  education: 'Education',
  other: 'Other',
};

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats>({ totalAmount: 0, totalExpenses: 0, avgAmount: 0 });
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);

  const fetchExpenses = useCallback(async () => {
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
  }, [router]);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    fetchExpenses();
  }, [fetchExpenses]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {userName ? `Welcome back, ${userName}` : 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-500">Here&apos;s an overview of your spending</p>
        </div>

        {error && (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <BanknotesIcon className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Transactions</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalExpenses}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ArrowsRightLeftIcon className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Average Expense</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(stats.avgAmount)}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CalculatorIcon className="w-5 h-5 text-gray-600" />
              </div>
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
          className="mb-8"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReceiptScanner(true)}
                  className="flex items-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Scan Receipt</span>
                </button>
                <button
                  onClick={() => router.push('/add-expense')}
                  className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add New
                </button>
              </div>
            </div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-10">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4 text-sm">No expenses yet</p>
                <button
                  onClick={() => router.push('/add-expense')}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Add Your First Expense
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expenses.slice(0, 10).map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{expense.title}</h3>
                        <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-semibold text-gray-900 text-sm">{formatCurrency(expense.amount)}</p>
                      <span className="text-xs text-gray-500 capitalize">
                        {CATEGORY_LABELS[expense.category] || expense.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Category Breakdown</h2>
            
            {categoryStats.length === 0 ? (
              <div className="text-center py-10">
                <ChartBarIconOutline className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No category data yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categoryStats.map((category) => (
                  <div key={category._id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 capitalize text-sm">{category._id}</h3>
                        <p className="text-xs text-gray-400">{category.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-semibold text-gray-900 text-sm">{formatCurrency(category.total)}</p>
                      <p className="text-xs text-gray-400">
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

// Inline icon for empty category state (avoids naming conflict)
function ChartBarIconOutline({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}
