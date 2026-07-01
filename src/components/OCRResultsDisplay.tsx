'use client';

import { ExtractedExpenseData } from '@/lib/ocr-service';


interface OCRResultsDisplayProps {
  data: ExtractedExpenseData;
  onAccept: () => void;
  onReject: () => void;
}

export default function OCRResultsDisplay({ data, onAccept, onReject }: OCRResultsDisplayProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-gray-900 bg-gray-100';
    if (confidence >= 60) return 'text-gray-700 bg-gray-100';
    return 'text-gray-500 bg-gray-50';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
        <div className="text-center mb-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">OCR Results</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${getConfidenceColor(data.confidence)}`}>
            {getConfidenceText(data.confidence)} ({Math.round(data.confidence)}%)
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {/* Amount */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</label>
              <span className={`text-xs px-2 py-0.5 rounded ${data.amount ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                {data.amount ? 'Found' : 'Not found'}
              </span>
            </div>
            <div className="text-base font-semibold text-gray-900">
              {data.amount ? `₹${data.amount.toLocaleString()}` : 'N/A'}
            </div>
          </div>

          {/* Category */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
              <span className={`text-xs px-2 py-0.5 rounded ${data.category ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                {data.category ? 'Detected' : 'Not detected'}
              </span>
            </div>
            <div className="text-base capitalize text-gray-900">
              {data.category || 'N/A'}
            </div>
          </div>

          {/* Date */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
              <span className={`text-xs px-2 py-0.5 rounded ${data.date ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                {data.date ? 'Found' : 'Not found'}
              </span>
            </div>
            <div className="text-base text-gray-900">
              {data.date ? new Date(data.date).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
              <span className={`text-xs px-2 py-0.5 rounded ${data.description ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                {data.description ? 'Generated' : 'Not generated'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {data.description || 'N/A'}
            </div>
          </div>
        </div>

        {/* Raw Text Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Raw OCR Text</h4>
          <div className="text-xs text-gray-400 max-h-20 overflow-y-auto font-mono leading-relaxed">
            {data.rawText.substring(0, 200)}
            {data.rawText.length > 200 && '...'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            Use This Data
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
