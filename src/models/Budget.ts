import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAISuggestion {
  type: 'increase' | 'decrease' | 'optimize' | 'alert' | 'recommendation';
  message: string;
  confidence: number;
  reasoning: string[];
  suggestedAmount?: number;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  generatedAt: Date;
}

export interface IBudgetMetrics {
  averageSpending: number;
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
  predictedOverrun: number;
  daysToOverrun: number;
  seasonalPattern: {
    month: number;
    averageSpending: number;
  }[];
  comparisonToPrevious: {
    amount: number;
    percentage: number;
  };
}

export interface IBudget extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  category?: string;
  amount: number;
  spent: number;
  period: {
    type: 'weekly' | 'monthly' | 'yearly' | 'custom';
    startDate: Date;
    endDate: Date;
  };
  notifications: {
    enabled: boolean;
    thresholds: number[];
    notifiedAt: number[];
  };
  aiSuggestions: IAISuggestion[];
  autoAdjust: {
    enabled: boolean;
    maxIncrease: number;
    maxDecrease: number;
    triggers: ('spending_pattern' | 'income_change' | 'seasonal' | 'goal_change')[];
    lastAdjusted: Date;
  };
  performanceMetrics: IBudgetMetrics;
  smartAlerts: {
    enabled: boolean;
    predictiveWarnings: boolean;
    spendingVelocityAlerts: boolean;
    unusualSpendingDetection: boolean;
    goalDeviationAlerts: boolean;
  };
  budgetGoals: {
    targetSavings?: number;
    maxOverrun?: number;
    improvementTarget?: number;
    deadline?: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    minlength: [1, 'Budget name cannot be empty'],
    maxlength: [100, 'Budget name cannot be more than 100 characters']
  },
  category: {
    type: String,
    enum: ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'healthcare', 'education', 'travel', 'business', 'other'],
    default: null
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Budget amount must be greater than 0'],
    max: [999999.99, 'Budget amount cannot exceed 999,999.99']
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  period: {
    type: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly', 'custom'],
      required: [true, 'Budget period type is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Budget start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Budget end date is required'],
      validate: {
        validator: function(this: IBudget, value: Date) {
          return value > this.period.startDate;
        },
        message: 'End date must be after start date'
      }
    }
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    thresholds: [{
      type: Number,
      min: [0, 'Threshold cannot be negative'],
      max: [100, 'Threshold cannot exceed 100%']
    }],
    notifiedAt: [{
      type: Number,
      min: [0, 'Notification threshold cannot be negative'],
      max: [100, 'Notification threshold cannot exceed 100%']
    }]
  },
  aiSuggestions: [{
    type: {
      type: String,
      enum: ['increase', 'decrease', 'optimize', 'alert', 'recommendation'],
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Suggestion message cannot exceed 500 characters']
    },
    confidence: {
      type: Number,
      required: true,
      min: [0, 'Confidence cannot be negative'],
      max: [100, 'Confidence cannot exceed 100']
    },
    reasoning: [{
      type: String,
      maxlength: [200, 'Reasoning item cannot exceed 200 characters']
    }],
    suggestedAmount: {
      type: Number,
      min: [0, 'Suggested amount cannot be negative']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      default: 'medium'
    },
    actionable: {
      type: Boolean,
      required: true,
      default: true
    },
    generatedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  }],
  autoAdjust: {
    enabled: {
      type: Boolean,
      default: false
    },
    maxIncrease: {
      type: Number,
      default: 20,
      min: [0, 'Max increase cannot be negative'],
      max: [100, 'Max increase cannot exceed 100%']
    },
    maxDecrease: {
      type: Number,
      default: 10,
      min: [0, 'Max decrease cannot be negative'],
      max: [100, 'Max decrease cannot exceed 100%']
    },
    triggers: [{
      type: String,
      enum: ['spending_pattern', 'income_change', 'seasonal', 'goal_change']
    }],
    lastAdjusted: {
      type: Date,
      default: null
    }
  },
  performanceMetrics: {
    averageSpending: {
      type: Number,
      default: 0,
      min: [0, 'Average spending cannot be negative']
    },
    spendingTrend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable'],
      default: 'stable'
    },
    predictedOverrun: {
      type: Number,
      default: 0
    },
    daysToOverrun: {
      type: Number,
      default: 0
    },
    seasonalPattern: [{
      month: {
        type: Number,
        min: [1, 'Month must be between 1 and 12'],
        max: [12, 'Month must be between 1 and 12']
      },
      averageSpending: {
        type: Number,
        min: [0, 'Average spending cannot be negative']
      }
    }],
    comparisonToPrevious: {
      amount: {
        type: Number,
        default: 0
      },
      percentage: {
        type: Number,
        default: 0
      }
    }
  },
  smartAlerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    predictiveWarnings: {
      type: Boolean,
      default: true
    },
    spendingVelocityAlerts: {
      type: Boolean,
      default: true
    },
    unusualSpendingDetection: {
      type: Boolean,
      default: true
    },
    goalDeviationAlerts: {
      type: Boolean,
      default: true
    }
  },
  budgetGoals: {
    targetSavings: {
      type: Number,
      min: [0, 'Target savings cannot be negative']
    },
    maxOverrun: {
      type: Number,
      min: [0, 'Max overrun cannot be negative']
    },
    improvementTarget: {
      type: Number,
      min: [0, 'Improvement target cannot be negative'],
      max: [100, 'Improvement target cannot exceed 100%']
    },
    deadline: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

BudgetSchema.index({ userId: 1, isActive: 1 });
BudgetSchema.index({ userId: 1, category: 1 });
BudgetSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });

BudgetSchema.virtual('utilizationPercentage').get(function(this: IBudget) {
  return Math.round((this.spent / this.amount) * 100);
});

BudgetSchema.virtual('remaining').get(function(this: IBudget) {
  return Math.max(0, this.amount - this.spent);
});

BudgetSchema.virtual('overBudget').get(function(this: IBudget) {
  return Math.max(0, this.spent - this.amount);
});

const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
export default Budget;
