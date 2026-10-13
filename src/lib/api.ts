import type {
  Category,
  Summary,
  TransactionInput,
  TransactionItem,
  TransactionsFilters,
  TransactionsResponse,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let body: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' && body && 'error' in body
        ? String((body as { error: unknown }).error ?? 'Ошибка запроса')
        : `Ошибка запроса (${response.status})`;
    throw new ApiError(message, response.status, body);
  }

  return body as T;
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export function getCategories(type?: 'income' | 'expense') {
  return request<Category[]>(`/categories${toQuery({ type })}`);
}

export function createCategory(data: { name: string; type: 'income' | 'expense'; color: string; icon: string }) {
  return request<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getTransactions(filters: TransactionsFilters = {}) {
  return request<TransactionsResponse>(
    `/transactions${toQuery({
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
      type: filters.type,
      categoryId: filters.categoryId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    })}`,
  );
}

export function createTransaction(data: TransactionInput) {
  return request<TransactionItem>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTransaction(id: string, data: TransactionInput) {
  return request<TransactionItem>(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id: string) {
  return request<{ success: boolean; id: string }>(`/transactions/${id}`, {
    method: 'DELETE',
  });
}

export function getSummary(from: string, to: string) {
  return request<Summary>(`/analytics/summary${toQuery({ from, to })}`);
}

export { ApiError };