// AI Budget ML Service Integration for Next.js
// This service connects the Next.js frontend with the Python ML API

interface MLAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

interface UserData {
  user_income: number;
  user_age: number;
  user_risk_tolerance?: 'low' | 'medium' | 'high';
  month?: number;
}

interface ExpenseData {
  date: string;
  category: string;
  amount: number;
  user_id?: string;
}

interface SpendingPrediction {
  predicted_amount: number;
  confidence: number;
  category: string;
}

interface BudgetRecommendation {
  category: string;
  type: 'reduce' | 'increase' | 'maintain';
  message: string;
  predicted_amount: number;
  historical_average: number;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
}

interface SmartInsights {
  predictions: Record<string, SpendingPrediction>;
  anomalies: Array<{
    expense: ExpenseData;
    anomaly_score: number;
    reason: string;
  }>;
  recommendations: BudgetRecommendation[];
  trends: any;
  alerts: Array<{
    type: string;
    category: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  optimization_tips: Array<{
    category: string;
    tip: string;
    potential_savings: number;
  }>;
}

class AIBudgetMLService {
  private baseURL: string;
  private isConnected: boolean = false;

  constructor() {
    // Use API route for client-side requests, direct connection for server-side
    if (typeof window !== 'undefined') {
      // Client-side: use API route
      this.baseURL = '/api/ai-ml';
    } else {
      // Server-side: use environment variable or default
      this.baseURL = process.env.PYTHON_ML_API_URL || process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';
    }
    this.checkConnection();
  }

  private async checkConnection(): Promise<void> {
    try {
      let url: string;
      if (this.baseURL === '/api/ai-ml') {
        // Client-side: use API route with health endpoint
        url = `${this.baseURL}?endpoint=${encodeURIComponent('/health')}`;
      } else {
        // Server-side: direct connection
        url = `${this.baseURL}/health`;
      }
      
      const response = await fetch(url);
      this.isConnected = response.ok;
      if (this.isConnected) {
        console.log('✅ Connected to AI Budget ML API');
      }
    } catch (error) {
      console.warn('⚠️ AI Budget ML API not available:', error);
      this.isConnected = false;
    }
  }

  private async makeRequest<T>(endpoint: string, data?: any): Promise<MLAPIResponse<T>> {
    try {
      console.log(`🚀 Making request to ML API: ${endpoint}`, data);
      
      if (!this.isConnected) {
        console.log('🤖 ML API not connected, using mock data');
        return this.getMockResponse<T>(endpoint, data);
      }

      let url: string;
      let requestOptions: RequestInit;

      if (this.baseURL === '/api/ai-ml') {
        // Client-side: use API route with endpoint as query parameter
        url = `${this.baseURL}?endpoint=${encodeURIComponent(endpoint)}`;
        requestOptions = {
          method: data ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
        };
      } else {
        // Server-side: direct connection
        url = `${this.baseURL}${endpoint}`;
        requestOptions = {
          method: data ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
        };
      }

      const response = await fetch(url, requestOptions);

      console.log(`📡 ML API Response status: ${response.status}`);

      if (!response.ok) {
        console.error(`❌ ML API Error: ${response.status} ${response.statusText}`);
        // Fall back to mock response
        return this.getMockResponse<T>(endpoint, data);
      }

      const result = await response.json();
      console.log(`✅ ML API Success:`, result);
      
      return {
        success: result.success || true,
        data: result,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.error(`💥 Error calling ML API ${endpoint}:`, error);
      console.log('🤖 Falling back to mock responses');
      // Fall back to mock response when API is not available
      return this.getMockResponse<T>(endpoint, data);
    }
  }

  private getMockResponse<T>(endpoint: string, data?: any): MLAPIResponse<T> {
    // Provide mock responses when ML API is not available
    console.log('🤖 Using mock AI responses (ML API not available)');
    
    switch (endpoint) {
      case '/api/predict-spending':
        return {
          success: true,
          data: {
            prediction: {
              predicted_amount: Math.random() * 500 + 100,
              confidence: Math.random() * 30 + 70,
              category: data?.category || 'food'
            }
          } as T
        };

      case '/api/smart-insights':
        return {
          success: true,
          data: {
            insights: {
              predictions: {
                food: { predicted_amount: 450, confidence: 85, category: 'food' },
                transport: { predicted_amount: 200, confidence: 78, category: 'transport' },
                shopping: { predicted_amount: 300, confidence: 82, category: 'shopping' }
              },
              recommendations: [
                {
                  category: 'food',
                  type: 'maintain',
                  message: 'Your food budget looks balanced',
                  predicted_amount: 450,
                  historical_average: 420,
                  confidence: 85,
                  priority: 'medium'
                }
              ],
              alerts: [],
              anomalies: [],
              trends: { overall: { direction: 'stable' } },
              optimization_tips: [
                {
                  category: 'entertainment',
                  tip: 'Consider setting a monthly limit for entertainment expenses',
                  potential_savings: 50
                }
              ]
            }
          } as T
        };

      default:
        return {
          success: true,
          data: { message: 'Mock response' } as T
        };
    }
  }

  async predictSpending(userData: UserData, category: string): Promise<SpendingPrediction | null> {
    const response = await this.makeRequest<{ prediction: SpendingPrediction }>('/api/predict-spending', {
      ...userData,
      category
    });

    return response.success && response.data ? response.data.prediction : null;
  }

  async detectAnomalies(expenses: ExpenseData[]): Promise<Array<{ expense: ExpenseData; anomaly_score: number; reason: string }>> {
    const response = await this.makeRequest<{ anomalies: any[] }>('/api/detect-anomalies', {
      expenses
    });

    return response.success && response.data ? response.data.anomalies : [];
  }

  async getBudgetRecommendations(userData: UserData, historicalExpenses: ExpenseData[]): Promise<BudgetRecommendation[]> {
    const response = await this.makeRequest<{ recommendations: BudgetRecommendation[] }>('/api/budget-recommendations', {
      user_data: userData,
      historical_expenses: historicalExpenses
    });

    return response.success && response.data ? response.data.recommendations : [];
  }

  async getSpendingTrends(expenses: ExpenseData[]): Promise<any> {
    const response = await this.makeRequest<{ trends: any }>('/api/spending-trends', {
      expenses
    });

    return response.success && response.data ? response.data.trends : null;
  }

  async getSmartInsights(userData: UserData, expenses: ExpenseData[], budgetGoals?: Record<string, number>): Promise<SmartInsights | null> {
    const response = await this.makeRequest<{ insights: SmartInsights }>('/api/smart-insights', {
      user_data: userData,
      expenses,
      budget_goals: budgetGoals
    });

    return response.success && response.data ? response.data.insights : null;
  }

  async getCategoryPredictions(userData: UserData): Promise<Record<string, SpendingPrediction> | null> {
    const response = await this.makeRequest<{ predictions: Record<string, SpendingPrediction> }>('/api/category-predictions', userData);

    return response.success && response.data ? response.data.predictions : null;
  }

  async optimizeBudget(userData: UserData, currentBudget: Record<string, number>, totalBudget: number): Promise<any> {
    const response = await this.makeRequest<any>('/api/budget-optimization', {
      user_data: userData,
      current_budget: currentBudget,
      total_budget: totalBudget
    });

    return response.success && response.data ? response.data : null;
  }

  async getSeasonalAnalysis(expenses: ExpenseData[]): Promise<any> {
    const response = await this.makeRequest<any>('/api/seasonal-analysis', {
      expenses
    });

    return response.success && response.data ? response.data : null;
  }

  async retrainModel(trainingData?: any[]): Promise<boolean> {
    const response = await this.makeRequest<any>('/api/retrain-model', 
      trainingData ? { training_data: trainingData } : {}
    );

    return response.success;
  }

  async getModelStats(): Promise<any> {
    const response = await this.makeRequest<any>('/api/model-stats');
    return response.success && response.data ? response.data : null;
  }

  // Utility methods for easier integration

  async generateBudgetInsightsForUser(userId: string, expenses: ExpenseData[]): Promise<{
    predictions: Record<string, number>;
    recommendations: string[];
    alerts: string[];
    optimizationTips: string[];
  }> {
    try {
      console.log('🔍 AI Service - generateBudgetInsightsForUser called:', {
        userId,
        expenseCount: expenses.length,
        totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        sampleExpenses: expenses.slice(0, 3)
      });

      // Mock user data - in real app, fetch from user profile
      const userData: UserData = {
        user_income: 5000, // Default values - should come from user profile
        user_age: 30,
        user_risk_tolerance: 'medium'
      };

      console.log('📤 Calling getSmartInsights with userData:', userData);
      const insights = await this.getSmartInsights(userData, expenses);
      console.log('📥 getSmartInsights returned:', insights);
      
      if (!insights) {
        console.warn('⚠️ No insights returned from getSmartInsights');
        return {
          predictions: {},
          recommendations: [],
          alerts: [],
          optimizationTips: []
        };
      }

      const result = {
        predictions: Object.fromEntries(
          Object.entries(insights.predictions).map(([category, pred]) => [category, pred.predicted_amount])
        ),
        recommendations: insights.recommendations.map(rec => rec.message),
        alerts: insights.alerts.map(alert => alert.message),
        optimizationTips: insights.optimization_tips.map(tip => tip.tip)
      };

      console.log('✅ Final budget insights result:', result);
      return result;
    } catch (error) {
      console.error('💥 Error generating budget insights:', error);
      return {
        predictions: {},
        recommendations: [],
        alerts: [],
        optimizationTips: []
      };
    }
  }

  async getQuickBudgetAdvice(totalBudget: number, expenses: ExpenseData[]): Promise<{
    status: 'on_track' | 'warning' | 'over_budget';
    message: string;
    suggestions: string[];
  }> {
    try {
      console.log('🎯 AI Service - getQuickBudgetAdvice called:', {
        totalBudget,
        expenseCount: expenses.length,
        expenses: expenses.slice(0, 5), // Show first 5 expenses for debugging
        allExpenseAmounts: expenses.map(exp => exp.amount),
        expenseSum: expenses.reduce((sum, exp) => sum + exp.amount, 0)
      });

      // Log each expense individually to check for issues
      expenses.forEach((expense, index) => {
        console.log(`💰 Expense ${index + 1}:`, {
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          typeof_amount: typeof expense.amount,
          is_number: typeof expense.amount === 'number',
          is_valid: !isNaN(expense.amount)
        });
      });

      const totalSpent = expenses.reduce((sum, expense) => {
        const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(String(expense.amount) || '0');
        console.log(`🧮 Adding expense: ${amount} (from ${expense.amount})`);
        return sum + amount;
      }, 0);
      
      console.log('💰 Calculated totals:', { totalBudget, totalSpent, budgetType: typeof totalBudget, spentType: typeof totalSpent });
      
      const spentPercentage = (totalSpent / totalBudget) * 100;
      console.log('📊 Spending percentage:', spentPercentage);

      let status: 'on_track' | 'warning' | 'over_budget';
      let message: string;
      let suggestions: string[] = [];

      if (spentPercentage > 100) {
        status = 'over_budget';
        message = `You've exceeded your budget by $${(totalSpent - totalBudget).toFixed(2)}`;
        suggestions = [
          'Review your recent expenses',
          'Identify areas to cut back',
          'Consider increasing your budget for next month'
        ];
      } else if (spentPercentage > 80) {
        status = 'warning';
        message = `You've used ${spentPercentage.toFixed(1)}% of your budget`;
        suggestions = [
          'Monitor your spending closely',
          'Prioritize essential expenses only',
          'Look for opportunities to save'
        ];
      } else {
        status = 'on_track';
        message = `You're doing well! ${spentPercentage.toFixed(1)}% of budget used`;
        suggestions = [
          'Keep up the good spending habits',
          'Consider saving the remaining budget',
          'Review your spending categories for optimization'
        ];
      }

      return { status, message, suggestions };
    } catch (error) {
      console.error('Error getting quick budget advice:', error);
      return {
        status: 'on_track',
        message: 'Unable to analyze budget at this time',
        suggestions: []
      };
    }
  }

  isMLAPIAvailable(): boolean {
    return this.isConnected;
  }

  async testConnection(): Promise<boolean> {
    try {
      let url: string;
      if (this.baseURL === '/api/ai-ml') {
        // Client-side: use API route with health endpoint
        url = `${this.baseURL}?endpoint=${encodeURIComponent('/health')}`;
      } else {
        // Server-side: direct connection
        url = `${this.baseURL}/health`;
      }
      
      const response = await fetch(url);
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      console.warn('⚠️ AI Budget ML API not available:', error);
      this.isConnected = false;
      return false;
    }
  }
}

// Export singleton instance
export const aiMLService = new AIBudgetMLService();
export default aiMLService;
