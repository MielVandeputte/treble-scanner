import clsx from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(({ invalid = false, ...props }, ref) => (
  <div className="w-full">
    <input
      {...props}
      ref={ref}
      aria-invalid={invalid}
      className={clsx(
        invalid ? 'border-rose-900' : 'border-transparent',
        'h-12 w-full rounded-full border-2 bg-zinc-800 px-5 font-semibold text-zinc-200',
      )}
    />
  </div>
));
Input.displayName = 'Input';
