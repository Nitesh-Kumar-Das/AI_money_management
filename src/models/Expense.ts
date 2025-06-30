import mongoose, { Document, Model, Schema } from 'mongoose';

// Expense Categories Enum
export type ExpenseCategory = 
  | 'food' 
  | 'transport' 
  | 'shopping' 
  | 'entertainment' 
  | 'utilities' 
  | 'healthcare' 
  | 'education' 
  | 'travel'
  | 'business'
  | 'other';

// Payment Methods Enum
export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'bank_transfer' 
  | 'digital_wallet' 
  | 'other';

// Expense Interface
export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  date: Date;
  description?: string;
  tags?: string[];
  receipt?: {
    url: string;
    filename: string;
    uploadedAt: Date;
  };
  location?: {
    name: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  recurring?: {
    isRecurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDue?: Date;
    endDate?: Date;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Expense Schema
const ExpenseSchema = new Schema<IExpense>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    max: [999999.99, 'Amount cannot exceed 999,999.99']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'healthcare', 'education', 'travel', 'business', 'other'],
      message: 'Please select a valid category'
    },
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'other'],
    default: 'cash'
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  receipt: {
    url: {
      type: String,
      trim: true
    },
    filename: {
      type: String,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  location: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Location name cannot be more than 100 characters']
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot be more than 200 characters']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function(this: IExpense) {
        return this.recurring?.isRecurring;
      }
    },
    nextDue: {
      type: Date,
      required: function(this: IExpense) {
        return this.recurring?.isRecurring;
      }
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(this: IExpense, value: Date) {
          return !value || value > new Date();
        },
        message: 'End date must be in the future'
      }
    }
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Format amount to 2 decimal places
      if (ret.amount) {
        ret.amount = Math.round(ret.amount * 100) / 100;
      }
      return ret;
    }
  }
});

// Compound indexes for better query performance
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
ExpenseSchema.index({ userId: 1, isDeleted: 1, date: -1 });
ExpenseSchema.index({ userId: 1, 'recurring.isRecurring': 1, 'recurring.nextDue': 1 });

// Text index for search functionality
ExpenseSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Virtual for formatted amount
ExpenseSchema.virtual('formattedAmount').get(function(this: IExpense) {
  return `$${this.amount.toFixed(2)}`;
});

// Export Expense model
const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
export default Expense;
