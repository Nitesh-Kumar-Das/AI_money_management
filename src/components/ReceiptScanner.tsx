'use client';

import { useState, useRef } from 'react';
import { ocrService, ExtractedExpenseData } from '@/lib/ocr-service';
import OCRResultsDisplay from './OCRResultsDisplay';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    await processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
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
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Scan Receipt</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isProcessing}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {!previewUrl && !isProcessing && (
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <CameraIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-700 mb-1">Upload Receipt Image</h3>
                <p className="text-gray-400 text-xs mb-2">
                  Click to select or drag & drop your receipt image
                </p>
                <p className="text-xs text-gray-300">
                  Supported: JPG, PNG, WEBP (Max 10MB)
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
                  className="max-w-full max-h-64 object-contain mx-auto rounded-lg border border-gray-200 mb-4"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Choose Different Image
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-8">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-gray-900 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-700 mb-1">Scanning Receipt...</h3>
                <p className="text-gray-400 text-xs mb-4">
                  {progress < 30 ? 'Analyzing image...' :
                   progress < 60 ? 'Extracting text...' :
                   progress < 90 ? 'Processing data...' :
                   'Almost done!'}
                </p>

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Receipt being processed"
                    className="max-w-full max-h-32 object-contain mx-auto rounded-lg border border-gray-200 opacity-40"
                  />
                )}
              </div>
            )}

            <div className="mt-5">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-2.5">AI Will Extract</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    Amount
                  </div>
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    Category
                  </div>
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    Date
                  </div>
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    Description
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
