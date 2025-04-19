import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import QrScanner from 'qr-scanner';
import { JSX } from 'react';

import { CameraSwitchButton, FlashButton, ManualScannerButton, MenuButton } from './scanner-card-buttons.tsx';
import { WifiIcon } from '../../components/icons.tsx';
import { useOnlineStatus } from '../../hooks/use-online-status.tsx';
import { mapScanAttemptResultToString, ScanAttempt } from '../../types/scan-attempt.ts';

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
        'absolute bottom-0 z-50 h-1/3 w-full overflow-hidden rounded-t-md p-5 transition duration-200',
      )}
    >
      {onlineStatus ? (
        <>
          <motion.section layout="position" className="flex h-1/5 w-full justify-around">
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
          </motion.section>

          <button onClick={restartScanning} className="h-4/5 w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.section
                key={lastScanAttemptState?.result ?? 'idle'}
                initial={{ opacity: 0, y: 10 }}
                exit={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'tween' }}
                className="flex h-3/4 flex-col justify-center gap-2"
              >
                <span
                  className={clsx(
                    lastScanAttemptState ? 'text-4xl font-bold text-white' : 'brand-font text-5xl text-zinc-400',
                  )}
                >
                  {lastScanAttemptState ? mapScanAttemptResultToString(lastScanAttemptState.result) : 'treble'}
                </span>
                {lastScanAttemptState ? (
                  <span className="text-sm font-semibold text-zinc-200">(tap om opnieuw te scannen)</span>
                ) : null}
              </motion.section>
            </AnimatePresence>

            <section className="h-1/4 w-full text-center font-semibold text-zinc-200">
              {errorMessageState ?? (
                <>
                  {lastScanAttemptState?.ticketTypeName}
                  {lastScanAttemptState?.ownerName ? (
                    <>
                      <br />
                      {lastScanAttemptState?.ownerName}
                    </>
                  ) : null}
                </>
              )}
            </section>
          </button>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-400">
          <WifiIcon />
          <span className="text-center font-semibold">Geen internetverbinding</span>
        </div>
      )}
    </header>
  );
}
