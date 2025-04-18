export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="border-b-2 border-zinc-900 p-5">
      <h1 className="text-center text-2xl font-bold text-white select-none">{children}</h1>
    </header>
  );
}
