import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Readonly<ButtonProps>>(
  ({ loading = false, children, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      disabled={loading}
      className={clsx(
        loading ? 'animate-pulse' : '',
        'flex h-11 items-center justify-center rounded-full bg-emerald-900 px-12 text-center font-semibold whitespace-nowrap text-zinc-200 outline-0 outline-transparent transition select-none active:scale-95 active:bg-emerald-800 active:text-white',
      )}
      aria-busy={loading}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
