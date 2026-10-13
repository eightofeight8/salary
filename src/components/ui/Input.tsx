import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';