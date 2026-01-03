import { clsx } from 'clsx';
import { InputHTMLAttributes, Ref, JSX } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'aria-invalid'> & {
  label: string;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
};

export function Input({ label, invalid = false, ref, ...props }: Readonly<InputProps>): JSX.Element {
  return (
    <div className="w-full">
      <label htmlFor={props.id} className="block px-2 pb-1 font-semibold select-none">
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        className={clsx(
          invalid ? 'outline-rose-950 focus:outline-rose-800' : 'outline-transparent focus:outline-zinc-400',
          'w-full rounded-full bg-zinc-800 px-5 py-2 font-semibold text-zinc-200 outline-2 transition',
        )}
        aria-invalid={invalid}
      />
    </div>
  );
}
