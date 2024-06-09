import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={clsx(
                className,
                'py-3 px-5 w-full text-zinc-200 select-none rounded-full font-semibold bg-zinc-800'
            )}
        />
    );
}
