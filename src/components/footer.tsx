import { forwardRef, ReactNode } from 'react';

export const Footer = forwardRef<HTMLDivElement, { columns: number; children: ReactNode }>(
  ({ columns, children }, ref) => (
    <footer
      ref={ref}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      className="grid gap-2 px-5 pt-3 pb-5 select-none"
    >
      {children}
    </footer>
  ),
);
Footer.displayName = 'Footer';
