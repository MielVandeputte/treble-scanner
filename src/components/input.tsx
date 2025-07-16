import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { invalid?: boolean; srLabel?: string };

export const Input = forwardRef<HTMLInputElement, Readonly<InputProps>>(
  ({ invalid = false, srLabel, ...props }, ref) => (
    <div className="w-full">
      {props.id && srLabel ? (
        <label htmlFor={props.id} className="sr-only">
          {srLabel}
        </label>
      ) : null}
      <input
        {...props}
        ref={ref}
        className={clsx(
          invalid ? 'border-rose-900' : 'border-transparent',
          'h-12 w-full rounded-full border-2 bg-zinc-800 px-5 font-semibold text-zinc-200',
        )}
        aria-invalid={invalid}
      />
    </div>
  ),
);
Input.displayName = 'Input';
