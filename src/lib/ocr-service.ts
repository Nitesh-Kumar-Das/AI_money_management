import Tesseract from 'tesseract.js';

export interface ExtractedExpenseData {
  amount: number | null;
  category: string | null;
  date: string | null;
  description: string | null;
  confidence: number;
  rawText: string;
}

interface OCRResult {
  text: string;
  confidence: number;
}

class OCRService {
  private categoryKeywords = {
    food: [
      'restaurant', 'cafe', 'food', 'pizza', 'burger', 'coffee', 'tea', 'lunch', 'dinner', 'breakfast',
      'kitchen', 'dining', 'meal', 'snack', 'beverage', 'drink', 'bar', 'pub', 'hotel', 'bakery',
      'swiggy', 'zomato', 'dominos', 'mcdonalds', 'kfc', 'subway', 'starbucks', 'chai', 'dosa', 'biryani'
    ],
    transport: [
      'uber', 'ola', 'taxi', 'auto', 'bus', 'metro', 'train', 'flight', 'fuel', 'petrol', 'diesel',
      'gas', 'station', 'parking', 'toll', 'transport', 'travel', 'cab', 'rickshaw', 'bike', 'car'
    ],
    shopping: [
      'mall', 'store', 'shop', 'market', 'amazon', 'flipkart', 'myntra', 'clothing', 'fashion',
      'electronics', 'mobile', 'laptop', 'grocery', 'supermarket', 'retail', 'purchase', 'buy'
    ],
    entertainment: [
      'movie', 'cinema', 'theatre', 'netflix', 'spotify', 'game', 'gaming', 'concert', 'show',
      'entertainment', 'fun', 'amusement', 'park', 'club', 'party', 'event'
    ],
    utilities: [
      'electricity', 'water', 'gas', 'internet', 'phone', 'mobile', 'recharge', 'bill', 'utility',
      'broadband', 'wifi', 'telephone', 'connection', 'service', 'maintenance'
    ],
    healthcare: [
      'hospital', 'doctor', 'medical', 'pharmacy', 'medicine', 'clinic', 'health', 'treatment',
      'consultation', 'checkup', 'lab', 'test', 'prescription', 'dental', 'eye'
    ],
    education: [
      'school', 'college', 'university', 'course', 'book', 'education', 'tuition', 'training',
      'learning', 'class', 'fee', 'library', 'study', 'exam', 'coaching'
    ]
  };

  async extractTextFromImage(imageFile: File): Promise<OCRResult> {
    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  extractAmount(text: string): number | null {
    // Enhanced regex patterns for Indian currency formats
    const patterns = [
      // ₹1,234.56 or Rs 1,234.56 or INR 1,234.56
      /(?:₹|Rs\.?|INR|rupees?)\s*([0-9,]+\.?[0-9]*)/gi,
      // 1,234.56 ₹ or 1,234.56 Rs
      /([0-9,]+\.?[0-9]*)\s*(?:₹|Rs\.?|INR|rupees?)/gi,
      // Total: 1,234.56 or Amount: 1,234.56
      /(?:total|amount|sum|bill|pay|paid|cost|price)\s*:?\s*(?:₹|Rs\.?|INR)?\s*([0-9,]+\.?[0-9]*)/gi,
      // Look for numbers near common receipt terms
      /(?:grand total|net amount|final amount|payable)\s*:?\s*(?:₹|Rs\.?|INR)?\s*([0-9,]+\.?[0-9]*)/gi,
      // Simple number patterns (as fallback)
      /([0-9,]+\.[0-9]{2})/g
    ];

    const amounts: number[] = [];

    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const amountStr = match[1] || match[0];
        const cleanAmount = amountStr.replace(/[^\d.]/g, '');
        const amount = parseFloat(cleanAmount);
        
        if (!isNaN(amount) && amount > 0 && amount < 1000000) { // Reasonable limits
          amounts.push(amount);
        }
      }
    }

    if (amounts.length === 0) return null;

    // Return the highest amount (likely to be the total)
    return Math.max(...amounts);
  }

  extractDate(text: string): string | null {
    const patterns = [
      // dd/mm/yyyy or dd-mm-yyyy
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
      // mm/dd/yyyy or mm-dd-yyyy
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
      // dd Mon yyyy or dd Month yyyy
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi,
      // yyyy-mm-dd
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g
    ];

    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const dateStr = match[0];
        const date = new Date(dateStr);
        
        // Check if date is valid and reasonable (not too far in future/past)
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        
        if (date >= oneYearAgo && date <= oneMonthFromNow) {
          return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
        }
      }
    }

    return null;
  }

  extractCategory(text: string): string | null {
    const lowerText = text.toLowerCase();
    
    // Score each category based on keyword matches
    const categoryScores: Record<string, number> = {};
    
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          score += matches.length;
        }
      }
      if (score > 0) {
        categoryScores[category] = score;
      }
    }

    // Return category with highest score
    if (Object.keys(categoryScores).length === 0) return null;
    
    return Object.entries(categoryScores)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  extractDescription(text: string, amount: number | null): string | null {
    // Look for merchant names, shop names, or descriptive text
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Skip lines that are just numbers, dates, or very short
    const meaningfulLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 3 && 
             !(/^\d+[\d\.,]*$/.test(trimmed)) && // Not just numbers
             !(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(trimmed)) && // Not just dates
             !(/^₹|^Rs\.?|^INR/.test(trimmed.toLowerCase())); // Not just currency symbols
    });

    if (meaningfulLines.length === 0) return null;

    // Try to find the most likely description (usually first few meaningful lines)
    const description = meaningfulLines.slice(0, 2).join(' - ').substring(0, 100);
    
    return description || null;
  }

  async processReceiptImage(imageFile: File): Promise<ExtractedExpenseData> {
    try {
      const ocrResult = await this.extractTextFromImage(imageFile);
      const text = ocrResult.text;

      const amount = this.extractAmount(text);
      const category = this.extractCategory(text);
      const date = this.extractDate(text);
      const description = this.extractDescription(text, amount);

      // Calculate overall confidence based on what we extracted
      let confidence = ocrResult.confidence;
      if (amount) confidence += 20;
      if (category) confidence += 15;
      if (date) confidence += 15;
      if (description) confidence += 10;
      
      confidence = Math.min(confidence, 100);

      return {
        amount,
        category,
        date,
        description,
        confidence,
        rawText: text
      };
    } catch (error) {
      console.error('Receipt processing error:', error);
      throw error;
    }
  }
}

export const ocrService = new OCRService();
export default ocrService;
