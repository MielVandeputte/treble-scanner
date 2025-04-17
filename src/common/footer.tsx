import { ReactNode } from 'react';

export function Footer({ children }: { children?: ReactNode }) {
  return <footer className="flex w-full items-center justify-center gap-2 p-5 select-none">{children}</footer>;
}
