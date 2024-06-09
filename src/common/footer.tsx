import { ReactNode } from 'react';

export function Footer({ children }: { children?: ReactNode }) {
    return <footer className="w-full p-5 flex gap-2 justify-center items-center select-none">{children}</footer>;
}
