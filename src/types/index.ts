import { IUser } from '@/models/User';
import { IExpense, ExpenseCategory, PaymentMethod } from '@/models/Expense';
import { IBudget } from '@/models/Budget';
import { ICategory } from '@/models/Category';

export type { IUser, IExpense, IBudget, ICategory, ExpenseCategory, PaymentMethod };

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Pick<IUser, '_id' | 'name' | 'email' | 'preferences'>;
  token: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description?: string;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  location?: {
    name: string;
    address?: string;
  };
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'all';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  search?: string;
}

export interface ExpenseStats {
  totalAmount: number;
  totalExpenses: number;
  avgAmount: number;
  maxAmount: number;
  minAmount: number;
}

export interface CategoryStats {
  _id: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
}

export interface ExpenseAnalytics {
  stats: ExpenseStats;
  categoryStats: CategoryStats[];
  monthlyTrend: {
    month: string;
    total: number;
    count: number;
  }[];
  dailyAverage: number;
}

export interface CreateBudgetRequest {
  name: string;
  category?: ExpenseCategory;
  amount: number;
  period: {
    type: 'weekly' | 'monthly' | 'yearly' | 'custom';
    startDate: string;
    endDate: string;
  };
  notifications?: {
    enabled: boolean;
    thresholds: number[];
  };
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {
  id: string;
}

export interface BudgetWithStats extends IBudget {
  utilizationPercentage: number;
  remaining: number;
  overBudget: number;
  isOverBudget: boolean;
  daysRemaining: number;
}

export interface CreateCategoryRequest {
  name: string;
  icon: string;
  color: string;
  description?: string;
  parentCategory?: string;
  monthlyBudget?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export interface DashboardData {
  user: Pick<IUser, '_id' | 'name' | 'email' | 'preferences'>;
  recentExpenses: IExpense[];
  monthlyStats: ExpenseStats;
  budgets: BudgetWithStats[];
  categoryBreakdown: CategoryStats[];
  trends: {
    thisMonth: number;
    lastMonth: number;
    changePercentage: number;
  };
  upcomingBudgetAlerts: {
    budget: IBudget;
    currentUtilization: number;
    daysRemaining: number;
  }[];
}

export interface ExpenseQueryParams extends ExpenseFilters {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface BudgetQueryParams {
  category?: ExpenseCategory;
  isActive?: boolean;
  period?: 'current' | 'upcoming' | 'past';
  page?: number;
  limit?: number;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithId<T> = T & { _id: string };
export type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: ValidationError[];
  stack?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}
