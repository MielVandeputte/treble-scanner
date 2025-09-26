import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label: string;
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, Readonly<InputProps>>(({ label, invalid = false, ...props }, ref) => (
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
));
Input.displayName = 'Input';
