import { forwardRef, use } from 'react';
import { Link } from 'react-router-dom';

import { ArrowLeftIcon, PowerIcon } from './icons.tsx';
import { ScanCredentialsContext } from '../contexts/scan-credentials-context.tsx';
import { SCANNER_PATH } from '../main.tsx';

type HeaderProps = {
  title: string;
};

export const Header = forwardRef<HTMLDivElement, HeaderProps>(({ title }, ref) => {
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
        <Link
          to={SCANNER_PATH}
          viewTransition
          className="text-zinc-200 transition active:scale-90 active:text-white"
          aria-label="Terug naar scanner"
          data-testid="back-button"
        >
          <ArrowLeftIcon aria-hidden />
        </Link>
        <h1 className="text-center text-xl font-semibold text-zinc-200">{title}</h1>
      </div>

      <button
        type="button"
        onClick={logout}
        className="transition active:scale-90 active:text-rose-900"
        aria-label="Uitloggen en ander event selecteren"
        data-testid="logout-button"
      >
        <PowerIcon aria-hidden />
      </button>
    </header>
  );
});
Header.displayName = 'Header';
