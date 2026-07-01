'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReceiptScanner from '@/components/ReceiptScanner';
import { ExtractedExpenseData } from '@/lib/ocr-service';
import { CameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Add New Expense</h1>
          <p className="text-sm text-gray-500">Track your spending with ease</p>
        </div>

        {/* OCR Success Message */}
        {ocrSuccess && (
          <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <CheckCircleIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
            Receipt scanned successfully. Data has been auto-filled below.
          </div>
        )}

        {/* OCR Scanner Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowScanner(true)}
            className="inline-flex items-center gap-3 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <CameraIcon className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-medium">Scan Receipt</div>
              <div className="text-xs text-gray-400">Auto-extract expense data</div>
            </div>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          {error && (
            <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expense Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Lunch at cafe, Gas for car..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm"
                required
              />
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">INR</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm"
                required
              />
            </div>

            {/* Selected Category Preview */}
            {formData.category && (
              <div className="bg-gray-50 rounded-lg p-3 border-l-2 border-gray-400">
                <p className="text-xs text-gray-400 mb-1">Selected Category</p>
                <span className="text-sm font-medium text-gray-700">
                  {categories.find(cat => cat.value === formData.category)?.label}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white mr-2"></div>
                  Adding Expense...
                </div>
              ) : (
                'Add Expense'
              )}
            </button>
          </form>
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
