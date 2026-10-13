import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SummaryCards } from '@/components/Dashboard/SummaryCards';
import { PeriodSelector } from '@/components/Dashboard/PeriodSelector';
import { ExpenseChart } from '@/components/Dashboard/ExpenseChart';
import { TransactionForm } from '@/components/Transactions/TransactionForm';
import { TransactionList } from '@/components/Transactions/TransactionList';
import { Filters } from '@/components/Transactions/Filters';
import { Button } from '@/components/ui/Button';
import {
  getCategories,
  getSummary,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/lib/api';
import {
  endOfLastMonth,
  endOfMonth,
  startOfLastMonth,
  startOfMonth,
} from '@/lib/utils';
import type { Period, PeriodPreset, TransactionInput, TransactionItem } from '@/types';

export default function App() {
  const queryClient = useQueryClient();

  const [preset, setPreset] = useState<PeriodPreset>('current');
  const [period, setPeriod] = useState<Period>({
    from: startOfMonth(),
    to: endOfMonth(),
  });
  const [typeFilter, setTypeFilter] = useState<TransactionInput['type'] | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionItem | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
  const categories = categoriesQuery.data ?? [];

  const summaryQuery = useQuery({
    queryKey: ['summary', period.from, period.to],
    queryFn: () => getSummary(period.from, period.to),
    enabled: Boolean(period.from && period.to),
  });

  const transactionsQuery = useQuery({
    queryKey: ['transactions', typeFilter, categoryFilter, page],
    queryFn: () =>
      getTransactions({
        page,
        limit: 20,
        type: typeFilter,
        categoryId: categoryFilter,
      }),
  });

  const invalidateCore = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: invalidateCore,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionInput }) => updateTransaction(id, data),
    onSuccess: invalidateCore,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: invalidateCore,
  });

  const handlePresetChange = (nextPreset: PeriodPreset) => {
    setPreset(nextPreset);
    if (nextPreset === 'current') {
      setPeriod({ from: startOfMonth(), to: endOfMonth() });
    } else if (nextPreset === 'last') {
      setPeriod({ from: startOfLastMonth(), to: endOfLastMonth() });
    }
  };

  const handleFormSubmit = async (data: TransactionInput) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (transaction: TransactionItem) => {
    setEditing(transaction);
    setFormOpen(true);
  };

  const handleDelete = async (transaction: TransactionItem) => {
    if (!window.confirm('Удалить эту операцию?')) return;
    await deleteMutation.mutateAsync(transaction.id);
  };

  const summary = useMemo(() => summaryQuery.data, [summaryQuery.data]);

  return (
    <Layout>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PeriodSelector
          preset={preset}
          period={period}
          onPresetChange={handlePresetChange}
          onPeriodChange={(next) => {
            setPreset('custom');
            setPeriod(next);
          }}
        />
        <Button onClick={openCreate} size="lg" className="sm:w-auto">
          <Plus className="h-5 w-5" />
          Добавить запись
        </Button>
      </div>

      <SummaryCards summary={summary} isLoading={summaryQuery.isLoading} />

      <ExpenseChart
        data={summary?.expenseByCategory ?? []}
        totalExpense={summary?.totalExpense ?? 0}
        isLoading={summaryQuery.isLoading}
      />

      <section className="card flex flex-col gap-4">
        <h2 className="text-base font-semibold text-slate-100">Операции</h2>
        <Filters
          type={typeFilter}
          categoryId={categoryFilter}
          categories={categories}
          onTypeChange={(value) => {
            setTypeFilter(value);
            setCategoryFilter('');
            setPage(1);
          }}
          onCategoryChange={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}
        />
      </section>

      <TransactionList
        items={transactionsQuery.data?.items ?? []}
        isLoading={transactionsQuery.isLoading}
        currentPage={transactionsQuery.data?.currentPage ?? 1}
        totalPages={transactionsQuery.data?.totalPages ?? 1}
        onPageChange={setPage}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <TransactionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        categories={categories}
        transaction={editing}
        onSubmit={handleFormSubmit}
      />
    </Layout>
  );
}