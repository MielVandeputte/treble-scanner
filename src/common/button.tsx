import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export function Button({
  color = 'brand',
  loading = false,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; color?: 'regular' | 'brand' | 'danger' }) {
  return (
    <button
      {...props}
      className={clsx(
        className,
        loading
          ? 'pointer-events-none animate-pulse'
          : 'disabled:border-zinc-800 disabled:bg-transparent disabled:text-zinc-400',
        color === 'brand' && 'bg-emerald-800',
        color === 'danger' && 'bg-rose-800',
        'h-12 rounded-full border-2 border-transparent px-12 text-center font-semibold whitespace-nowrap text-white transition duration-200 select-none',
      )}
    >
      {children}
    </button>
  );
}
