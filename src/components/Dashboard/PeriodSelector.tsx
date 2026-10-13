import { CalendarRange } from 'lucide-react';
import type { Period, PeriodPreset } from '@/types';
import { cn } from '@/lib/utils';

interface PeriodSelectorProps {
  preset: PeriodPreset;
  period: Period;
  onPresetChange: (preset: PeriodPreset) => void;
  onPeriodChange: (period: Period) => void;
}

const PRESETS: { value: PeriodPreset; label: string }[] = [
  { value: 'current', label: 'Текущий месяц' },
  { value: 'last', label: 'Прошлый месяц' },
  { value: 'custom', label: 'Кастомный' },
];

export function PeriodSelector({ preset, period, onPresetChange, onPeriodChange }: PeriodSelectorProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1">
        {PRESETS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onPresetChange(option.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition',
              preset === option.value
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="date"
            value={period.from}
            onChange={(e) => onPeriodChange({ ...period, from: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
          <span className="text-slate-500">—</span>
          <input
            type="date"
            value={period.to}
            onChange={(e) => onPeriodChange({ ...period, to: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}