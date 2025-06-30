import { IBudget, IAISuggestion, IBudgetMetrics } from '@/models/Budget';
import { IExpense } from '@/types';

export class AIBudgetService {
  /**
   * Generate AI suggestions for a budget based on spending patterns
   */
  static async generateBudgetSuggestions(
    budget: IBudget,
    expenses: IExpense[],
    userPreferences?: {
      riskTolerance: 'low' | 'medium' | 'high';
      savingsGoal?: number;
      priorityCategories?: string[];
    }
  ): Promise<IAISuggestion[]> {
    const suggestions: IAISuggestion[] = [];
    const metrics = this.calculateBudgetMetrics(budget, expenses);
    
    const remaining = Math.max(0, budget.amount - budget.spent);
    const utilizationPercentage = Math.round((budget.spent / budget.amount) * 100);
    
    const spendingVelocity = this.calculateSpendingVelocity(budget, expenses);
    
    if (spendingVelocity.daysToOverrun > 0 && spendingVelocity.daysToOverrun <= 7) {
      suggestions.push({
        type: 'alert',
        message: `Warning: At current spending rate, you'll exceed your budget in ${spendingVelocity.daysToOverrun} days.`,
        confidence: 85,
        reasoning: [
          `Current daily spending: $${spendingVelocity.dailyAverage.toFixed(2)}`,
          `Remaining budget: $${remaining}`,
          `Days until period ends: ${spendingVelocity.daysRemaining}`
        ],
        priority: 'high',
        actionable: true,
        generatedAt: new Date()
      });
    }
    
    if (utilizationPercentage > 80) {
      const optimizationSuggestion = this.generateOptimizationSuggestion(budget, expenses);
      if (optimizationSuggestion) {
        suggestions.push(optimizationSuggestion);
      }
    }
    
    const seasonalSuggestion = this.generateSeasonalSuggestion(budget, metrics);
    if (seasonalSuggestion) {
      suggestions.push(seasonalSuggestion);
    }
    
    if (userPreferences?.savingsGoal) {
      const goalSuggestion = this.generateGoalBasedSuggestion(budget, userPreferences.savingsGoal);
      if (goalSuggestion) {
        suggestions.push(goalSuggestion);
      }
    }
    
    const trendSuggestion = this.generateTrendBasedSuggestion(budget, metrics);
    if (trendSuggestion) {
      suggestions.push(trendSuggestion);
    }
    
    return suggestions;
  }
  
  /**
   * Calculate comprehensive budget performance metrics
   */
  static calculateBudgetMetrics(budget: IBudget, expenses: IExpense[]): IBudgetMetrics {
    const budgetExpenses = expenses.filter(expense => 
      expense.category === budget.category &&
      new Date(expense.date) >= budget.period.startDate &&
      new Date(expense.date) <= budget.period.endDate
    );
    
    const totalSpent = budgetExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averageSpending = budgetExpenses.length > 0 ? totalSpent / budgetExpenses.length : 0;
    
    const midpoint = new Date((budget.period.startDate.getTime() + budget.period.endDate.getTime()) / 2);
    const firstHalfExpenses = budgetExpenses.filter(exp => new Date(exp.date) <= midpoint);
    const secondHalfExpenses = budgetExpenses.filter(exp => new Date(exp.date) > midpoint);
    
    const firstHalfAvg = firstHalfExpenses.reduce((sum, exp) => sum + exp.amount, 0) / (firstHalfExpenses.length || 1);
    const secondHalfAvg = secondHalfExpenses.reduce((sum, exp) => sum + exp.amount, 0) / (secondHalfExpenses.length || 1);
    
    let spendingTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    const trendThreshold = 0.1;
    
    if (secondHalfAvg > firstHalfAvg * (1 + trendThreshold)) {
      spendingTrend = 'increasing';
    } else if (secondHalfAvg < firstHalfAvg * (1 - trendThreshold)) {
      spendingTrend = 'decreasing';
    }
    
    const daysElapsed = Math.max(1, (Date.now() - budget.period.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailySpendingRate = totalSpent / daysElapsed;
    const totalDays = (budget.period.endDate.getTime() - budget.period.startDate.getTime()) / (1000 * 60 * 60 * 24);
    const projectedTotal = dailySpendingRate * totalDays;
    const predictedOverrun = Math.max(0, projectedTotal - budget.amount);
    
    const remaining = budget.amount - totalSpent;
    const daysToOverrun = remaining > 0 && dailySpendingRate > 0 ? remaining / dailySpendingRate : 0;
    
    const seasonalPattern = this.generateSeasonalPattern(expenses, budget.category);
    
    const comparisonToPrevious = {
      amount: 0,
      percentage: 0
    };
    
    return {
      averageSpending,
      spendingTrend,
      predictedOverrun,
      daysToOverrun,
      seasonalPattern,
      comparisonToPrevious
    };
  }
  
  /**
   * Calculate spending velocity metrics
   */
  private static calculateSpendingVelocity(budget: IBudget, expenses: IExpense[]) {
    const now = new Date();
    const daysElapsed = Math.max(1, (now.getTime() - budget.period.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, (budget.period.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    const relevantExpenses = expenses.filter(expense => 
      expense.category === budget.category &&
      new Date(expense.date) >= budget.period.startDate &&
      new Date(expense.date) <= now
    );
    
    const totalSpent = relevantExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const dailyAverage = totalSpent / daysElapsed;
    const remaining = budget.amount - totalSpent;
    const daysToOverrun = remaining > 0 && dailyAverage > 0 ? remaining / dailyAverage : 0;
    
    return {
      dailyAverage,
      daysElapsed,
      daysRemaining,
      daysToOverrun: Math.floor(daysToOverrun)
    };
  }
  
  /**
   * Generate optimization suggestion based on spending patterns
   */
  private static generateOptimizationSuggestion(
    budget: IBudget,
    expenses: IExpense[]
  ): IAISuggestion | null {
    const categoryExpenses = expenses.filter(exp => exp.category === budget.category);
    
    if (categoryExpenses.length < 3) return null;
    
    const expenseAmounts = categoryExpenses.map(exp => exp.amount).sort((a, b) => b - a);
    const highSpendingThreshold = expenseAmounts[Math.floor(expenseAmounts.length * 0.2)];
    const highSpendingCount = expenseAmounts.filter(amount => amount >= highSpendingThreshold).length;
    
    if (highSpendingCount > expenseAmounts.length * 0.3) {
      return {
        type: 'optimize',
        message: `Consider reviewing your ${budget.category} spending. ${highSpendingCount} high-value transactions account for a significant portion of your budget.`,
        confidence: 75,
        reasoning: [
          `${highSpendingCount} transactions above $${highSpendingThreshold.toFixed(2)}`,
          `These represent ${Math.round((highSpendingCount / expenseAmounts.length) * 100)}% of transactions`,
          'Optimizing large expenses can have the biggest impact'
        ],
        priority: 'medium',
        actionable: true,
        generatedAt: new Date()
      };
    }
    
    return null;
  }
  
  /**
   * Generate seasonal adjustment suggestion
   */
  private static generateSeasonalSuggestion(budget: IBudget, metrics: IBudgetMetrics): IAISuggestion | null {
    const currentMonth = new Date().getMonth() + 1;
    const seasonalData = metrics.seasonalPattern.find(pattern => pattern.month === currentMonth);
    
    if (!seasonalData) return null;
    
    const variance = Math.abs(seasonalData.averageSpending - metrics.averageSpending);
    const variancePercentage = (variance / metrics.averageSpending) * 100;
    
    if (variancePercentage > 20) {
      const isHighSeason = seasonalData.averageSpending > metrics.averageSpending;
      
      return {
        type: 'recommendation',
        message: `${isHighSeason ? 'Higher' : 'Lower'} spending typical for this month. Consider ${isHighSeason ? 'increasing' : 'optimizing'} your ${budget.category} budget.`,
        confidence: 65,
        reasoning: [
          `Historical average for this month: $${seasonalData.averageSpending.toFixed(2)}`,
          `Overall average: $${metrics.averageSpending.toFixed(2)}`,
          `${variancePercentage.toFixed(1)}% variance from normal`
        ],
        suggestedAmount: isHighSeason ? budget.amount * 1.15 : budget.amount * 0.9,
        priority: 'low',
        actionable: true,
        generatedAt: new Date()
      };
    }
    
    return null;
  }
  
  /**
   * Generate goal-based suggestion
   */
  private static generateGoalBasedSuggestion(budget: IBudget, savingsGoal: number): IAISuggestion | null {
    const currentSavings = Math.max(0, budget.amount - budget.spent);
    const savingsShortfall = savingsGoal - currentSavings;
    
    if (savingsShortfall > 0) {
      const recommendedReduction = Math.min(savingsShortfall, budget.amount * 0.1);
      
      return {
        type: 'decrease',
        message: `To meet your savings goal, consider reducing this budget by $${recommendedReduction.toFixed(2)}.`,
        confidence: 70,
        reasoning: [
          `Savings goal: $${savingsGoal.toFixed(2)}`,
          `Current savings potential: $${currentSavings.toFixed(2)}`,
          `Shortfall: $${savingsShortfall.toFixed(2)}`
        ],
        suggestedAmount: budget.amount - recommendedReduction,
        priority: 'medium',
        actionable: true,
        generatedAt: new Date()
      };
    }
    
    return null;
  }
  
  /**
   * Generate trend-based suggestion
   */
  private static generateTrendBasedSuggestion(budget: IBudget, metrics: IBudgetMetrics): IAISuggestion | null {
    const utilizationPercentage = Math.round((budget.spent / budget.amount) * 100);
    
    if (metrics.spendingTrend === 'increasing' && metrics.predictedOverrun > 0) {
      return {
        type: 'increase',
        message: `Your ${budget.category} spending is trending upward. Consider increasing the budget by $${metrics.predictedOverrun.toFixed(2)} to avoid overruns.`,
        confidence: 80,
        reasoning: [
          'Spending trend is increasing',
          `Predicted overrun: $${metrics.predictedOverrun.toFixed(2)}`,
          'Proactive adjustment can prevent budget stress'
        ],
        suggestedAmount: budget.amount + metrics.predictedOverrun,
        priority: 'medium',
        actionable: true,
        generatedAt: new Date()
      };
    }
    
    if (metrics.spendingTrend === 'decreasing' && utilizationPercentage < 70) {
      const suggestedReduction = budget.amount * 0.1;
      
      return {
        type: 'decrease',
        message: `Your ${budget.category} spending is decreasing. You could reduce this budget by $${suggestedReduction.toFixed(2)} and allocate funds elsewhere.`,
        confidence: 75,
        reasoning: [
          'Spending trend is decreasing',
          `Current utilization: ${utilizationPercentage}%`,
          'Funds could be better allocated to other categories'
        ],
        suggestedAmount: budget.amount - suggestedReduction,
        priority: 'low',
        actionable: true,
        generatedAt: new Date()
      };
    }
    
    return null;
  }
  
  /**
   * Generate seasonal spending pattern
   */
  private static generateSeasonalPattern(expenses: IExpense[], category?: string): IBudgetMetrics['seasonalPattern'] {
    const monthlyData: { [month: number]: number[] } = {};
    
    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = [];
    }
    
    expenses
      .filter(exp => !category || exp.category === category)
      .forEach(expense => {
        const month = new Date(expense.date).getMonth() + 1;
        monthlyData[month].push(expense.amount);
      });
    
    return Object.entries(monthlyData).map(([month, amounts]) => ({
      month: parseInt(month),
      averageSpending: amounts.length > 0 ? amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length : 0
    }));
  }
  
  /**
   * Auto-adjust budget based on AI suggestions
   */
  static async autoAdjustBudget(budget: IBudget, suggestions: IAISuggestion[]): Promise<{ adjusted: boolean; newAmount?: number; reason?: string }> {
    if (!budget.autoAdjust.enabled) {
      return { adjusted: false };
    }
    
    // Find the highest confidence actionable suggestion
    const adjustmentSuggestion = suggestions
      .filter(s => s.actionable && s.suggestedAmount && (s.type === 'increase' || s.type === 'decrease'))
      .sort((a, b) => b.confidence - a.confidence)[0];
    
    if (!adjustmentSuggestion?.suggestedAmount) {
      return { adjusted: false };
    }
    
    const currentAmount = budget.amount;
    const suggestedAmount = adjustmentSuggestion.suggestedAmount;
    const changePercentage = Math.abs((suggestedAmount - currentAmount) / currentAmount) * 100;
    
    // Check if adjustment is within allowed limits
    const maxChange = adjustmentSuggestion.type === 'increase' ? budget.autoAdjust.maxIncrease : budget.autoAdjust.maxDecrease;
    
    if (changePercentage <= maxChange && adjustmentSuggestion.confidence >= 75) {
      return {
        adjusted: true,
        newAmount: suggestedAmount,
        reason: adjustmentSuggestion.message
      };
    }
    
    return { adjusted: false };
  }
  
  /**
   * Detect unusual spending patterns
   */
  static detectUnusualSpending(expenses: IExpense[], category?: string): {
    hasUnusualActivity: boolean;
    alerts: string[];
    confidence: number;
  } {
    const relevantExpenses = expenses.filter(exp => !category || exp.category === category);
    
    if (relevantExpenses.length < 5) {
      return { hasUnusualActivity: false, alerts: [], confidence: 0 };
    }
    
    const amounts = relevantExpenses.map(exp => exp.amount);
    const average = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const threshold = average * 2; // 2x average is considered unusual
    
    const unusualExpenses = relevantExpenses.filter(exp => exp.amount > threshold);
    const alerts: string[] = [];
    
    if (unusualExpenses.length > 0) {
      alerts.push(`${unusualExpenses.length} unusually high expenses detected`);
      alerts.push(`Largest expense: $${Math.max(...unusualExpenses.map(exp => exp.amount)).toFixed(2)}`);
      alerts.push(`Average expense: $${average.toFixed(2)}`);
    }
    
    // Check for frequency anomalies
    const last7Days = relevantExpenses.filter(exp => 
      (Date.now() - new Date(exp.date).getTime()) / (1000 * 60 * 60 * 24) <= 7
    );
    
    if (last7Days.length > relevantExpenses.length * 0.5) {
      alerts.push('High spending frequency in the last 7 days');
    }
    
    return {
      hasUnusualActivity: alerts.length > 0,
      alerts,
      confidence: Math.min(90, alerts.length * 30)
    };
  }
}

export default AIBudgetService;
