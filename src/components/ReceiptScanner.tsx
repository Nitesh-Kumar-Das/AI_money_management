'use client';

import { useState, useRef } from 'react';
import { ocrService, ExtractedExpenseData } from '@/lib/ocr-service';
import OCRResultsDisplay from './OCRResultsDisplay';

interface ReceiptScannerProps {
  onDataExtracted: (data: ExtractedExpenseData) => void;
  onClose: () => void;
}

export default function ReceiptScanner({ onDataExtracted, onClose }: ReceiptScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedExpenseData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file too large. Please select an image under 10MB');
      return;
    }

    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process the image
    await processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const extractedData = await ocrService.processReceiptImage(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Show results for review
      setExtractedData(extractedData);

    } catch (error) {
      console.error('OCR processing failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptResults = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
    }
  };

  const handleRejectResults = () => {
    setExtractedData(null);
    setPreviewUrl(null);
    setProgress(0);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Create a FileList-like object and process directly
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        
        // Process the file directly
        handleFileSelect({
          target: { files: dt.files }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <>
      {extractedData ? (
        <OCRResultsDisplay 
          data={extractedData}
          onAccept={handleAcceptResults}
          onReject={handleRejectResults}
        />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📸 Scan Receipt</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={isProcessing}
              >
                ×
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!previewUrl && !isProcessing && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Receipt Image</h3>
                <p className="text-gray-500 mb-4">
                  Click to select or drag & drop your receipt image
                </p>
                <p className="text-sm text-gray-400">
                  Supported formats: JPG, PNG, WEBP (Max 10MB)
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {previewUrl && !isProcessing && (
              <div className="text-center">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="max-w-full max-h-64 object-contain mx-auto rounded-lg border mb-4"
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Choose Different Image
                  </button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-700 mb-2">🔍 Scanning Receipt...</h3>
                <p className="text-gray-500 mb-4">
                  {progress < 30 ? 'Analyzing image...' :
                   progress < 60 ? 'Extracting text...' :
                   progress < 90 ? 'Processing data...' :
                   'Almost done!'}
                </p>

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Receipt being processed"
                    className="max-w-full max-h-32 object-contain mx-auto rounded-lg border opacity-50"
                  />
                )}
              </div>
            )}

            <div className="mt-6 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🤖 AI Will Extract:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <div className="flex items-center">
                    <span className="mr-2">💸</span>
                    <span>Amount</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🗂️</span>
                    <span>Category</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📆</span>
                    <span>Date</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📝</span>
                    <span>Description</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
