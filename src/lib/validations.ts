// Basic validation functions for expense tracker

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 100) {
    errors.push('Password cannot exceed 100 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Name validation
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || !name.trim()) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Amount validation
export function validateAmount(amount: number): ValidationResult {
  const errors: string[] = [];
  
  if (amount === undefined || amount === null) {
    errors.push('Amount is required');
  } else if (isNaN(amount)) {
    errors.push('Amount must be a valid number');
  } else if (amount <= 0) {
    errors.push('Amount must be greater than 0');
  } else if (amount > 999999.99) {
    errors.push('Amount cannot exceed 999,999.99');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Date validation
export function validateDate(date: string): ValidationResult {
  const errors: string[] = [];
  
  if (!date) {
    errors.push('Date is required');
  } else if (isNaN(Date.parse(date))) {
    errors.push('Invalid date format');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Expense category validation
export const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'shopping',
  'entertainment',
  'utilities',
  'healthcare',
  'education',
  'travel',
  'business',
  'other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export function validateExpenseCategory(category: string): ValidationResult {
  const errors: string[] = [];
  
  if (!category) {
    errors.push('Category is required');
  } else if (!EXPENSE_CATEGORIES.includes(category as ExpenseCategory)) {
    errors.push('Please select a valid category');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Payment method validation
export const PAYMENT_METHODS = [
  'cash',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'digital_wallet',
  'other'
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number];

export function validatePaymentMethod(method: string): ValidationResult {
  const errors: string[] = [];
  
  if (method && !PAYMENT_METHODS.includes(method as PaymentMethod)) {
    errors.push('Please select a valid payment method');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Expense validation
export interface CreateExpenseData {
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
}

export function validateCreateExpense(data: CreateExpenseData): ValidationResult {
  const errors: string[] = [];
  
  // Validate title
  if (!data.title || !data.title.trim()) {
    errors.push('Title is required');
  } else if (data.title.trim().length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  // Validate amount
  const amountValidation = validateAmount(data.amount);
  errors.push(...amountValidation.errors);
  
  // Validate category
  const categoryValidation = validateExpenseCategory(data.category);
  errors.push(...categoryValidation.errors);
  
  // Validate date
  const dateValidation = validateDate(data.date);
  errors.push(...dateValidation.errors);
  
  // Validate description (optional)
  if (data.description && data.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  // Validate payment method (optional)
  if (data.paymentMethod) {
    const paymentValidation = validatePaymentMethod(data.paymentMethod);
    errors.push(...paymentValidation.errors);
  }
  
  // Validate tags (optional)
  if (data.tags) {
    if (data.tags.length > 10) {
      errors.push('Cannot have more than 10 tags');
    }
    data.tags.forEach((tag, index) => {
      if (tag.length > 30) {
        errors.push(`Tag ${index + 1} cannot exceed 30 characters`);
      }
    });
  }
  
  return { isValid: errors.length === 0, errors };
}

// Auth validation
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export function validateSignup(data: SignupData): ValidationResult {
  const errors: string[] = [];
  
  const nameValidation = validateName(data.name);
  errors.push(...nameValidation.errors);
  
  const emailValidation = validateEmail(data.email);
  errors.push(...emailValidation.errors);
  
  const passwordValidation = validatePassword(data.password);
  errors.push(...passwordValidation.errors);
  
  return { isValid: errors.length === 0, errors };
}

export interface LoginData {
  email: string;
  password: string;
}

export function validateLogin(data: LoginData): ValidationResult {
  const errors: string[] = [];
  
  const emailValidation = validateEmail(data.email);
  errors.push(...emailValidation.errors);
  
  if (!data.password) {
    errors.push('Password is required');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Budget validation
export interface CreateBudgetData {
  name: string;
  category?: string;
  amount: number;
  period: {
    type: 'weekly' | 'monthly' | 'yearly' | 'custom';
    startDate: string;
    endDate: string;
  };
}

export function validateCreateBudget(data: CreateBudgetData): ValidationResult {
  const errors: string[] = [];
  
  // Validate name
  if (!data.name || !data.name.trim()) {
    errors.push('Budget name is required');
  } else if (data.name.trim().length > 100) {
    errors.push('Budget name cannot exceed 100 characters');
  }
  
  // Validate amount
  const amountValidation = validateAmount(data.amount);
  errors.push(...amountValidation.errors);
  
  // Validate category (optional)
  if (data.category) {
    const categoryValidation = validateExpenseCategory(data.category);
    errors.push(...categoryValidation.errors);
  }
  
  // Validate period
  if (!data.period) {
    errors.push('Budget period is required');
  } else {
    // Validate period type
    const validPeriodTypes = ['weekly', 'monthly', 'yearly', 'custom'];
    if (!validPeriodTypes.includes(data.period.type)) {
      errors.push('Please select a valid period type');
    }
    
    // Validate dates
    const startDateValidation = validateDate(data.period.startDate);
    errors.push(...startDateValidation.errors);
    
    const endDateValidation = validateDate(data.period.endDate);
    errors.push(...endDateValidation.errors);
    
    // Validate date range
    if (startDateValidation.isValid && endDateValidation.isValid) {
      const startDate = new Date(data.period.startDate);
      const endDate = new Date(data.period.endDate);
      
      if (endDate <= startDate) {
        errors.push('End date must be after start date');
      }
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Utility function to combine validation results
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(result => result.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

// Helper function to format validation errors
export function formatValidationErrors(errors: string[]): string {
  return errors.join('; ');
}
