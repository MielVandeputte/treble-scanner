import { clsx } from 'clsx';
import { ButtonHTMLAttributes, JSX, Ref } from 'react';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'className' | 'aria-busy'> & {
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

export function Button({ loading = false, children, ref, ...props }: Readonly<ButtonProps>): JSX.Element {
  return (
    <button
      {...props}
      ref={ref}
      disabled={loading}
      className={clsx(
        {
          'animate-pulse': loading,
        },
        'flex h-11 items-center justify-center rounded-full bg-emerald-900 px-12 text-center font-semibold whitespace-nowrap text-zinc-200 outline-0 outline-transparent transition select-none active:scale-95 active:bg-emerald-800 active:text-white',
      )}
      aria-busy={loading}
    >
      {children}
    </button>
  );
}
