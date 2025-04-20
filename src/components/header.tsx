import { forwardRef } from 'react';

export const Header = forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => (
  <header ref={ref} className="px-5 pt-5 pb-3 select-none">
    <h1 className="text-center text-2xl font-bold text-zinc-200">{title}</h1>
  </header>
));
Header.displayName = 'Header';
