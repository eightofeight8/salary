import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' &&
          'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500/50',
        variant === 'ghost' &&
          'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 focus:ring-slate-500/50',
        variant === 'danger' &&
          'bg-red-600/10 text-red-400 hover:bg-red-600/20 focus:ring-red-500/50',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';