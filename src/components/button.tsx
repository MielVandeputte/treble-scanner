import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, Readonly<ButtonProps>>(
  ({ loading = false, disabled = false, children, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      disabled={loading || disabled}
      className={clsx(
        loading && !disabled ? 'animate-pulse' : '',
        disabled
          ? 'border-zinc-900 bg-transparent'
          : 'border-transparent bg-emerald-900 text-zinc-200 active:scale-95 active:bg-emerald-800 active:text-white',
        'flex h-12 items-center justify-center rounded-full border-2 px-12 text-center font-semibold whitespace-nowrap transition select-none',
      )}
      aria-busy={loading}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
