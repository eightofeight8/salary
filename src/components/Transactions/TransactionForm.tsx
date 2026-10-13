import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import type { Category, TransactionInput, TransactionItem, TransactionType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/CategoryIcon';
import { cn, toISODate } from '@/lib/utils';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  transaction?: TransactionItem | null;
  onSubmit: (data: TransactionInput) => Promise<void>;
}

export function TransactionForm({ open, onClose, categories, transaction, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense');
  const [amount, setAmount] = useState<string>(transaction ? String(transaction.amount) : '');
  const [categoryId, setCategoryId] = useState<string>(transaction?.categoryId ?? '');
  const [date, setDate] = useState<string>(transaction?.date ?? toISODate(new Date()));
  const [comment, setComment] = useState<string>(transaction?.comment ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = categories.filter((category) => category.type === type);

  useEffect(() => {
    if (!open) return;
    setType(transaction?.type ?? 'expense');
    setAmount(transaction ? String(transaction.amount) : '');
    setCategoryId(transaction?.categoryId ?? '');
    setDate(transaction?.date ?? toISODate(new Date()));
    setComment(transaction?.comment ?? '');
    setError(null);
  }, [open, transaction]);

  const selectType = (nextType: TransactionType) => {
    setType(nextType);
    setCategoryId('');
    setError(null);
  };

  const reset = () => {
    setType('expense');
    setAmount('');
    setCategoryId('');
    setDate(toISODate(new Date()));
    setComment('');
    setError(null);
  };

  const handleSubmit = async () => {
    const parsedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Введите сумму больше нуля');
      return;
    }
    if (!categoryId) {
      setError('Выберите категорию');
      return;
    }
    if (!date) {
      setError('Укажите дату');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: parsedAmount,
        type,
        categoryId,
        date,
        comment: comment.trim() || undefined,
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить запись');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={transaction ? 'Изменить запись' : 'Новая запись'}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-800 p-1">
          {(['expense', 'income'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => selectType(tab)}
              className={cn(
                'rounded-lg py-2 text-sm font-semibold transition',
                type === tab
                  ? tab === 'expense'
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-slate-200',
              )}
            >
              {tab === 'expense' ? 'Расход' : 'Доход'}
            </button>
          ))}
        </div>

        <Input
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder="0.00 ₽"
          value={amount}
          autoFocus
          onChange={(e) => setAmount(e.target.value)}
          className="py-3 text-center text-2xl font-bold focus:text-left"
        />

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Категория</p>
          {filteredCategories.length === 0 ? (
            <p className="text-sm text-slate-500">Нет категорий этого типа</p>
          ) : (
            <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition',
                    categoryId === category.id
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-500',
                  )}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <CategoryIcon name={category.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium leading-tight text-slate-200">{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Дата
            </label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Комментарий
            </label>
            <Input
              type="text"
              maxLength={255}
              placeholder="Заметка…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          {transaction ? 'Сохранить изменения' : 'Добавить запись'}
        </Button>
      </div>
    </Modal>
  );
}