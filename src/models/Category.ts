import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  color: string;
  description?: string;
  isDefault: boolean;
  parentCategory?: mongoose.Types.ObjectId;
  subcategories?: mongoose.Types.ObjectId[];
  monthlyBudget?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [1, 'Category name cannot be empty'],
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  icon: {
    type: String,
    required: [true, 'Category icon is required'],
    default: '📦'
  },
  color: {
    type: String,
    required: [true, 'Category color is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color'],
    default: '#6B7280'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  isDefault: {
    type: Boolean,
    default: false,
    index: true
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subcategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  monthlyBudget: {
    type: Number,
    min: [0, 'Monthly budget cannot be negative'],
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });
CategorySchema.index({ userId: 1, isActive: 1 });
CategorySchema.index({ parentCategory: 1 });

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
