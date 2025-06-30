'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReceiptScanner from '@/components/ReceiptScanner';
import { ExtractedExpenseData } from '@/lib/ocr-service';

export default function AddExpense() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  useEffect(() => {
    const ocrData = localStorage.getItem('ocrData');
    if (ocrData) {
      try {
        const data: ExtractedExpenseData = JSON.parse(ocrData);
        handleOCRDataExtracted(data);
        localStorage.removeItem('ocrData');
      } catch (error) {
        console.error('Failed to parse OCR data:', error);
      }
    }
  }, []);

  const categories = [
    { value: 'food', label: '🍽️ Food & Dining', color: 'bg-orange-100 text-orange-800' },
    { value: 'transport', label: '🚗 Transportation', color: 'bg-blue-100 text-blue-800' },
    { value: 'shopping', label: '🛍️ Shopping', color: 'bg-purple-100 text-purple-800' },
    { value: 'entertainment', label: '🎬 Entertainment', color: 'bg-pink-100 text-pink-800' },
    { value: 'utilities', label: '⚡ Utilities', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'healthcare', label: '🏥 Healthcare', color: 'bg-red-100 text-red-800' },
    { value: 'education', label: '📚 Education', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: '📦 Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleOCRDataExtracted = (data: ExtractedExpenseData) => {
    setFormData(prev => ({
      ...prev,
      title: data.description || prev.title,
      amount: data.amount ? data.amount.toString() : prev.amount,
      date: data.date || prev.date,
      category: data.category || prev.category
    }));
    
    setOcrSuccess(true);
    setTimeout(() => setOcrSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to add expenses');
      }

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add expense');
      }

      console.log('Expense added successfully:', data);
      
      setFormData({
        title: '',
        amount: '',
        date: '',
        category: ''
      });
      
      router.push('/dashboard');
      
    } catch (error: unknown) {
      console.error('Error adding expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">💰 Add New Expense</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your spending with ease</p>
        </div>

        {/* OCR Success Message */}
        {ocrSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 sm:mb-6 text-sm">
            🎉 Receipt scanned successfully! Data has been auto-filled below.
          </div>
        )}

        {/* OCR Scanner Button */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105 border border-purple-300 inline-flex items-center gap-3"
          >
            <span className="text-2xl">📸</span>
            <div className="text-left">
              <div className="text-base">Scan Receipt</div>
              <div className="text-xs opacity-90">Auto-extract expense data</div>
            </div>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/20">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 sm:mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title Input */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📝 Expense Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Lunch at cafe, Gas for car..."
                className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Amount Input */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                💵 Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg sm:text-xl font-bold">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-300 placeholder-gray-400 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                🏷️ Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                📅 Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                required
              />
            </div>

            {/* Selected Category Preview */}
            {formData.category && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Selected Category:</p>
                <span className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                  categories.find(cat => cat.value === formData.category)?.color
                }`}>
                  {categories.find(cat => cat.value === formData.category)?.label}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2"></div>
                  Adding Expense...
                </div>
              ) : (
                '✨ Add Expense'
              )}
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1">📊</div>
            <div className="text-xs sm:text-sm text-gray-600">Track Progress</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1">🎯</div>
            <div className="text-xs sm:text-sm text-gray-600">Set Goals</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1">💡</div>
            <div className="text-xs sm:text-sm text-gray-600">Smart Insights</div>
          </div>
        </div>

        {/* OCR Scanner Modal */}
        {showScanner && (
          <ReceiptScanner
            onDataExtracted={handleOCRDataExtracted}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
}
