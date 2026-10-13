export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface TransactionItem {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  comment?: string | null;
  createdAt?: string | null;
  categoryName: string;
  categoryColor: string;
  categoryIcon?: string | null;
}

export interface TransactionsResponse {
  items: TransactionItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface TransactionInput {
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  comment?: string;
}

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
  percentage: number;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  expenseByCategory: CategoryTotal[];
  incomeByCategory: CategoryTotal[];
}

export interface TransactionsFilters {
  page?: number;
  limit?: number;
  type?: TransactionType | '';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export type PeriodPreset = 'current' | 'last' | 'custom';

export interface Period {
  from: string;
  to: string;
}