import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2, Loader2, Inbox } from 'lucide-react';
import type { TransactionItem } from '@/types';
import { CategoryIcon } from '@/components/CategoryIcon';
import { cn, formatDate, formatSigned } from '@/lib/utils';

interface TransactionListProps {
  items: TransactionItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (transaction: TransactionItem) => void;
  onDelete: (transaction: TransactionItem) => void;
}

interface Group {
  date: string;
  items: TransactionItem[];
}

function groupByDay(items: TransactionItem[]): Group[] {
  const map = new Map<string, TransactionItem[]>();
  for (const item of items) {
    const list = map.get(item.date);
    if (list) list.push(item);
    else map.set(item.date, [item]);
  }
  return Array.from(map.entries()).map(([date, dayItems]) => ({ date, items: dayItems }));
}

export function TransactionList({
  items,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const groups = useMemo(() => groupByDay(items), [items]);

  return (
    <div className="card">
      <h2 className="mb-4 text-base font-semibold text-slate-100">История операций</h2>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-slate-500">
          <Inbox className="h-10 w-10" />
          <p className="text-sm">Операций пока нет</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group.date}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {formatDate(group.date)}
              </p>
              <ul className="flex flex-col gap-2">
                {group.items.map((transaction) => {
                  const isIncome = transaction.type === 'income';
                  return (
                    <li
                      key={transaction.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 transition hover:border-slate-700"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: transaction.categoryColor }}
                      >
                        <CategoryIcon name={transaction.categoryIcon} className="h-4 w-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-200">
                          {transaction.categoryName}
                        </p>
                        {transaction.comment && (
                          <p className="truncate text-xs text-slate-500">{transaction.comment}</p>
                        )}
                      </div>

                      <span
                        className={cn(
                          'shrink-0 text-sm font-bold tabular-nums',
                          isIncome ? 'text-emerald-400' : 'text-rose-400',
                        )}
                      >
                        {formatSigned(transaction.amount, isIncome)}
                      </span>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(transaction)}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
                          aria-label="Редактировать"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(transaction)}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="btn-ghost disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </button>
          <span className="text-sm text-slate-400">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="btn-ghost disabled:opacity-30"
          >
            Далее
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}