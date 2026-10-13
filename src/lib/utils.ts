import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSigned(value: number, isIncome: boolean): string {
  const sign = isIncome ? '+' : '-';
  return `${sign} ${formatCurrency(Math.abs(value))}`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'short',
  }).format(new Date(`${date}T00:00:00`));
}

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfMonth(date: Date = new Date()): string {
  return toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonth(date: Date = new Date()): string {
  return toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function startOfLastMonth(): string {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
}

export function endOfLastMonth(): string {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth(), 0));
}