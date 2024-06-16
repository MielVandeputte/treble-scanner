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
                    : 'disabled:bg-transparent disabled:border-zinc-800 disabled:text-zinc-400',
                color === 'brand' && 'bg-emerald-800',
                color === 'danger' && 'bg-rose-800',
                'border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-12 px-12 text-center font-semibold'
            )}
        >
            {children}
        </button>
    );
}
