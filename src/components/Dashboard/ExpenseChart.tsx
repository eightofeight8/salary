import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { CategoryTotal } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ExpenseChartProps {
  data: CategoryTotal[];
  totalExpense: number;
  isLoading: boolean;
}

export function ExpenseChart({ data, totalExpense, isLoading }: ExpenseChartProps) {
  return (
    <div className="card">
      <h2 className="mb-4 text-base font-semibold text-slate-100">Расходы по категориям</h2>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-40 w-40 animate-pulse rounded-full bg-slate-800" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-500">
          <PieChartIcon className="h-10 w-10" />
          <p className="text-sm">Нет расходов за выбранный период</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | string, name: string) => [formatCurrency(Number(value)), name]}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 12,
                    color: '#f1f5f9',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400">Итого</span>
              <span className="text-lg font-bold text-slate-100">{formatCurrency(totalExpense)}</span>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {data.slice(0, 8).map((entry) => (
              <li key={entry.categoryId} className="flex items-center gap-3 text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="min-w-0 flex-1 truncate text-slate-300">{entry.categoryName}</span>
                <span className="font-medium text-slate-100">{formatCurrency(entry.total)}</span>
                <span className="w-12 text-right text-xs text-slate-500">{entry.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}