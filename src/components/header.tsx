import { forwardRef } from 'react';

export const Header = forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => (
  <header ref={ref} className="py-8 select-none">
    <h1 className="text-center text-2xl font-bold text-white">{title}</h1>
  </header>
));
Header.displayName = 'Header';
