import { JSX, use } from 'react';

import { Header } from '../components/header.tsx';
import { ScanHistoryContext } from '../contexts/scan-history-context.tsx';
import { mapScanAttemptResultToString, ScanAttempt } from '../types/scan-attempt.type.ts';

export function ScanHistory(): JSX.Element {
  const scanHistory = use(ScanHistoryContext).scanHistory;

  return (
    <div className="grid h-svh grid-rows-[auto_1fr]">
      <Header title="Scangeschiedenis" />

      {scanHistory?.length ? (
        <main className="overflow-x-hidden overflow-y-scroll">
          <ol
            className="flex flex-col divide-y divide-zinc-800 px-10 text-center font-semibold"
            data-testid="scan-history-list"
          >
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

                {scanAttempt.ownerName || scanAttempt.ownerEmailAddress ? (
                  <p>
                    {scanAttempt.ownerName ?? null}
                    {scanAttempt.ownerName && scanAttempt.ownerEmailAddress ? <br /> : null}
                    {scanAttempt.ownerEmailAddress ?? null}
                  </p>
                ) : null}

                <p>{scanAttempt.secretCode}</p>
              </li>
            ))}
          </ol>
        </main>
      ) : (
        <main className="flex h-full w-full items-center justify-center">
          <p className="text-center font-semibold select-none">Nog geen tickets gescand</p>
        </main>
      )}
    </div>
  );
}
