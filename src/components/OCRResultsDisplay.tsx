'use client';

import { ExtractedExpenseData } from '@/lib/ocr-service';

interface OCRResultsDisplayProps {
  data: ExtractedExpenseData;
  onAccept: () => void;
  onReject: () => void;
}

export default function OCRResultsDisplay({ data, onAccept, onReject }: OCRResultsDisplayProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 OCR Results</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(data.confidence)}`}>
            {getConfidenceText(data.confidence)} ({Math.round(data.confidence)}%)
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Amount */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">💸 Amount</label>
              <span className={`text-xs px-2 py-1 rounded ${data.amount ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {data.amount ? 'Found' : 'Not found'}
              </span>
            </div>
            <div className="text-lg font-bold">
              {data.amount ? `₹${data.amount.toLocaleString()}` : 'N/A'}
            </div>
          </div>

          {/* Category */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">🗂️ Category</label>
              <span className={`text-xs px-2 py-1 rounded ${data.category ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {data.category ? 'Detected' : 'Not detected'}
              </span>
            </div>
            <div className="text-lg capitalize">
              {data.category || 'N/A'}
            </div>
          </div>

          {/* Date */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">📆 Date</label>
              <span className={`text-xs px-2 py-1 rounded ${data.date ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {data.date ? 'Found' : 'Not found'}
              </span>
            </div>
            <div className="text-lg">
              {data.date ? new Date(data.date).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">📝 Description</label>
              <span className={`text-xs px-2 py-1 rounded ${data.description ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {data.description ? 'Generated' : 'Not generated'}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              {data.description || 'N/A'}
            </div>
          </div>
        </div>

        {/* Raw Text Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">🔍 Raw OCR Text (Preview)</h4>
          <div className="text-xs text-gray-600 max-h-24 overflow-y-auto font-mono">
            {data.rawText.substring(0, 200)}
            {data.rawText.length > 200 && '...'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            ✅ Use This Data
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
          >
            ❌ Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
