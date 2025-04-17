import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(className, 'w-full rounded-full bg-zinc-800 px-5 py-3 font-semibold text-zinc-200 select-none')}
    />
  );
}
