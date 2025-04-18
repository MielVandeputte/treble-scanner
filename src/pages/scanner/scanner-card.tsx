import clsx from 'clsx';
import QrScanner from 'qr-scanner';
import { JSX } from 'react';

import { CameraSwitchButton, FlashButton, ManualScannerButton, MenuButton } from './scanner-card-buttons.tsx';
import { WifiIcon } from '../../components/icons.tsx';
import { useOnlineStatus } from '../../hooks/use-online-status.tsx';
import { ScanAttempt } from '../../types/scan-attempt.ts';

import '@fontsource/proza-libre/600.css';

export function ScannerCard({
  hasFlashState,
  isFlashOnState,
  camerasListState,

  lastScanAttemptState,
  errorMessageState,

  restartScanning,
  toggleFlash,
  toggleCamera,
}: {
  hasFlashState: boolean;
  isFlashOnState: boolean;
  camerasListState: QrScanner.Camera[];

  lastScanAttemptState: ScanAttempt | null;
  errorMessageState: string | null | undefined;

  restartScanning: () => void;
  toggleFlash: () => void;
  toggleCamera: () => void;
}): JSX.Element {
  const onlineStatus = useOnlineStatus();

  return (
    <header
      className={clsx(
        lastScanAttemptState?.result === 'SUCCESS' ? 'bg-emerald-900/95' : '',
        lastScanAttemptState?.result === 'ALREADY_SCANNED' ? 'bg-amber-900/95' : '',
        lastScanAttemptState?.result === 'NOT_FOUND' ? 'bg-rose-900/95' : '',
        lastScanAttemptState?.result ? '' : 'bg-zinc-950/95',
        'absolute bottom-0 z-50 h-1/3 w-full overflow-hidden rounded-t-md p-5 transition',
      )}
    >
      {onlineStatus ? (
        <>
          <section className="flex h-1/5 w-full justify-around">
            {hasFlashState ? (
              <FlashButton
                toggleFlash={toggleFlash}
                isFlashOnState={isFlashOnState}
                showingScanAttempt={!!lastScanAttemptState}
              />
            ) : null}

            {camerasListState?.length > 1 ? (
              <CameraSwitchButton toggleCamera={toggleCamera} showingScanAttempt={!!lastScanAttemptState} />
            ) : null}

            <ManualScannerButton showingScanAttempt={!!lastScanAttemptState} />
            <MenuButton showingScanAttempt={!!lastScanAttemptState} />
          </section>

          <button onClick={restartScanning} className="relative h-3/5 w-full whitespace-nowrap">
            <div className="h-3/4">
              <FeedbackText shown={lastScanAttemptState?.result === 'SUCCESS'} text="Geldig ticket" />
              <FeedbackText shown={lastScanAttemptState?.result === 'ALREADY_SCANNED'} text="Al gescand" />
              <FeedbackText shown={lastScanAttemptState?.result === 'NOT_FOUND'} text="Ongeldig ticket" />
              <FeedbackText shown={!lastScanAttemptState?.result} text="treble" />
            </div>

            <div
              onClick={restartScanning}
              className="h-1/4 w-full text-center font-sans font-semibold text-zinc-200 transition ease-in-out"
            >
              {errorMessageState ?? (
                <>
                  {lastScanAttemptState?.ticketTypeName}
                  {lastScanAttemptState?.ownerName && lastScanAttemptState?.ownerEmail && (
                    <>
                      <br />
                      {lastScanAttemptState?.ownerName} | {lastScanAttemptState?.ownerEmail}
                    </>
                  )}
                </>
              )}
            </div>
          </button>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-400 transition">
          <WifiIcon />
          <h1 className="text-center font-semibold">Geen internetverbinding</h1>
        </div>
      )}
    </header>
  );
}

function FeedbackText({ text, shown }: { text: string; shown: boolean }): JSX.Element {
  return (
    <div
      className={clsx(
        'absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-[55%] flex-col gap-2 text-center',
        shown ? 'fade-in' : 'fade-out',
      )}
    >
      <h1 className={clsx(text === 'treble' ? 'brand-font text-5xl text-zinc-400' : 'text-4xl font-bold text-white')}>
        {text}
      </h1>
      {text !== 'treble' && <span className="text-sm font-semibold text-zinc-200">(tap om opnieuw te scannen)</span>}
    </div>
  );
}
