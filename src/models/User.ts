import mongoose, { Document, Model, Schema } from 'mongoose';

// User Interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  preferences: {
    currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
    budgetLimit?: number;
    notifications: {
      email: boolean;
      budget: boolean;
      weekly: boolean;
    };
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
      default: 'USD'
    },
    budgetLimit: {
      type: Number,
      min: [0, 'Budget limit cannot be negative'],
      default: null
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      budget: {
        type: Boolean,
        default: true
      },
      weekly: {
        type: Boolean,
        default: false
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Export User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
