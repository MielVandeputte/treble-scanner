import { JSX, use } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/button.tsx';
import { Footer } from '../components/footer.tsx';
import { Header } from '../components/header.tsx';
import { ReturnIcon } from '../components/icons.tsx';
import { ScanCredentialsContext } from '../contexts/scan-credentials-context.tsx';
import { ScanHistoryContext } from '../contexts/scan-history-context.tsx';
import { SCANNER_PATH } from '../main.tsx';
import { mapScanAttemptResultToString, ScanAttempt } from '../types/scan-attempt.ts';

export function ScanHistory(): JSX.Element {
  const navigate = useNavigate();
  const setScanCredentials = use(ScanCredentialsContext).setScanCredentials;
  const scanHistory = use(ScanHistoryContext).scanHistory;

  function logout(): void {
    setScanCredentials(null);
  }

  return (
    <div className="grid h-svh grid-rows-[auto_1fr_auto]">
      <Header title="Scangeschiedenis" />

      {scanHistory?.length ? (
        <main className="overflow-x-hidden overflow-y-scroll">
          <ol className="flex flex-col divide-y divide-zinc-900 px-10 text-center font-semibold">
            {scanHistory.map((scanAttempt: ScanAttempt) => (
              <li key={scanAttempt.id} className="flex flex-col gap-2 py-5">
                <time dateTime={scanAttempt.timestamp.toISOString()} className="text-zinc-200">
                  {scanAttempt.timestamp.toLocaleTimeString()}
                </time>

                <p>
                  {mapScanAttemptResultToString(scanAttempt.result)}
                  {scanAttempt.ticketTypeName ? <br /> : null}
                  {scanAttempt.ticketTypeName ?? null}
                </p>

                {scanAttempt.ownerName || scanAttempt.ownerEmail ? (
                  <p>
                    {scanAttempt.ownerName ?? null}
                    {scanAttempt.ownerName && scanAttempt.ownerEmail ? <br /> : null}
                    {scanAttempt.ownerEmail ?? null}
                  </p>
                ) : null}

                <p>{scanAttempt.secretCode}</p>
              </li>
            ))}
          </ol>
        </main>
      ) : (
        <main className="flex items-center justify-center">
          <p className="text-center font-semibold select-none">Nog geen tickets gescand</p>
        </main>
      )}

      <Footer columns={2}>
        <Button type="button" onClick={logout} color="danger" aria-label="Uitloggen en ander event selecteren">
          Ander event
        </Button>
        <Button
          type="button"
          onClick={() => navigate(SCANNER_PATH, { viewTransition: true })}
          aria-label="Terug naar scanner"
        >
          <ReturnIcon aria-hidden />
        </Button>
      </Footer>
    </div>
  );
}
