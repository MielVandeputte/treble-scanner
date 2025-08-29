import { forwardRef, use } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeftIcon, PowerIcon } from './icons.tsx';
import { ScanCredentialsContext } from '../contexts/scan-credentials-context.tsx';
import { SCANNER_PATH } from '../main.tsx';

export const Header = forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => {
  const navigate = useNavigate();
  const setScanCredentials = use(ScanCredentialsContext).setScanCredentials;

  function logout(): void {
    setScanCredentials(null);
  }

  return (
    <header
      ref={ref}
      className="flex items-center justify-between gap-5 px-5 pt-5 pb-4 shadow-md shadow-zinc-900 select-none"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(SCANNER_PATH, { viewTransition: true })}
          className="text-zinc-200 transition active:scale-90 active:text-white"
          aria-label="Terug naar scanner"
        >
          <ArrowLeftIcon aria-hidden />
        </button>
        <h1 className="text-center text-xl font-semibold text-zinc-200">{title}</h1>
      </div>

      <button
        type="button"
        onClick={logout}
        className="transition active:scale-90 active:text-rose-900"
        aria-label="Uitloggen en ander event selecteren"
      >
        <PowerIcon aria-hidden />
      </button>
    </header>
  );
});
Header.displayName = 'Header';
