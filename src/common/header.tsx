export function Header({ children }: { children?: React.ReactNode }) {
    return (
        <header className="p-5 border-b-2 border-zinc-900">
            <h1 className="text-center text-white text-2xl font-bold select-none">{children}</h1>
        </header>
    );
}
