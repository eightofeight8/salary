import type { Category, TransactionType } from '@/types';
import { Select } from '@/components/ui/Select';

interface FiltersProps {
  type: TransactionType | '';
  categoryId: string;
  categories: Category[];
  onTypeChange: (type: TransactionType | '') => void;
  onCategoryChange: (categoryId: string) => void;
}

export function Filters({ type, categoryId, categories, onTypeChange, onCategoryChange }: FiltersProps) {
  const visibleCategories = categories.filter((category) => !type || category.type === type);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select value={type} onChange={(e) => onTypeChange(e.target.value as TransactionType | '')}>
        <option value="">Все типы</option>
        <option value="expense">Расходы</option>
        <option value="income">Доходы</option>
      </Select>

      <Select value={categoryId} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">Все категории</option>
        {visibleCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </div>
  );
}