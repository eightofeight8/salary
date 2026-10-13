import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import type { Summary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  summary?: Summary;
  isLoading: boolean;
}

function CardShell({
  label,
  value,
  icon,
  tone,
  isLoading,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: 'income' | 'expense' | 'balance';
  isLoading: boolean;
}) {
  const accent =
    tone === 'income'
      ? 'text-emerald-400'
      : tone === 'expense'
        ? 'text-rose-400'
        : 'text-indigo-400';

  return (
    <div className="card flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        {isLoading ? (
          <div className="mt-2 h-7 w-28 animate-pulse rounded bg-slate-800" />
        ) : (
          <p className={cn('mt-1 text-2xl font-bold tracking-tight', accent)}>{value}</p>
        )}
      </div>
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          tone === 'income' && 'bg-emerald-500/10 text-emerald-400',
          tone === 'expense' && 'bg-rose-500/10 text-rose-400',
          tone === 'balance' && 'bg-indigo-500/10 text-indigo-400',
        )}
      >
        {icon}
      </span>
    </div>
  );
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <CardShell
        label="Доходы"
        value={formatCurrency(summary?.totalIncome ?? 0)}
        icon={<TrendingUp className="h-5 w-5" />}
        tone="income"
        isLoading={isLoading}
      />
      <CardShell
        label="Расходы"
        value={formatCurrency(summary?.totalExpense ?? 0)}
        icon={<TrendingDown className="h-5 w-5" />}
        tone="expense"
        isLoading={isLoading}
      />
      <CardShell
        label="Чистый остаток"
        value={formatCurrency(summary?.netBalance ?? 0)}
        icon={<Scale className="h-5 w-5" />}
        tone="balance"
        isLoading={isLoading}
      />
    </div>
  );
}