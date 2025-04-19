import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  color?: 'regular' | 'brand' | 'danger';
  horizontalPadding?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color = 'regular', horizontalPadding = false, loading = false, disabled = false, children, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        color === 'regular' && !disabled ? 'bg-zinc-900 active:bg-zinc-800' : '',
        color === 'brand' && !disabled ? 'bg-emerald-900 active:bg-emerald-800' : '',
        color === 'danger' && !disabled ? 'bg-rose-900 active:bg-rose-800' : '',
        horizontalPadding ? 'px-12' : 'px-5',
        loading && !disabled ? 'animate-pulse' : '',
        disabled ? 'border-zinc-900 bg-transparent text-zinc-400' : 'border-transparent text-white',
        'flex h-12 items-center justify-center rounded-full border-2 text-center font-semibold whitespace-nowrap transition select-none',
      )}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
