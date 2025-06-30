// MongoDB initialization script
db = db.getSiblingDB('ai_expense_tracker');

// Create collections
db.createCollection('users');
db.createCollection('expenses');
db.createCollection('budgets');
db.createCollection('categories');

// Create default categories
db.categories.insertMany([
  {
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#EF4444',
    isDefault: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Transportation',
    icon: '🚗',
    color: '#3B82F6',
    isDefault: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Shopping',
    icon: '🛍️',
    color: '#10B981',
    isDefault: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Entertainment',
    icon: '🎬',
    color: '#8B5CF6',
    isDefault: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Healthcare',
    icon: '🏥',
    color: '#F59E0B',
    isDefault: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.expenses.createIndex({ userId: 1, date: -1 });
db.budgets.createIndex({ userId: 1, category: 1 });
db.categories.createIndex({ userId: 1, name: 1 }, { unique: true, sparse: true });

print('MongoDB initialization completed successfully!');
