import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = 'Select';