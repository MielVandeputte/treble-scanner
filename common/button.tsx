import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export function Button({
    loading = false,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
    return (
        <button
            {...props}
            className={clsx(
                className,
                loading && 'pointer-events-none animate-pulse',
                !loading && 'disabled:bg-transparent disabled:border-zinc-800 disabled:text-zinc-400',
                'bg-emerald-800 border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-12 px-12 text-center font-semibold'
            )}
        >
            Start
        </button>
    );
}
