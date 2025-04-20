import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import QrScanner from 'qr-scanner';
import { JSX } from 'react';

import { CameraSwitchButton, FlashButton, ManualScannerButton, ScanHistoryButton } from './scanner-card-buttons.tsx';
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
    <div
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
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.section
              key={'' + isFlashOnState + (camerasListState?.length > 1)}
              className="flex h-1/5 justify-around"
              initial={{ opacity: 0, y: 10 }}
              exit={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'tween' }}
            >
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
              <ScanHistoryButton showingScanAttempt={!!lastScanAttemptState} />
            </motion.section>
          </AnimatePresence>

          <div role="button" tabIndex={0} onClick={restartScanning} className="h-4/5" aria-label="Scan opnieuw">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.section
                key={lastScanAttemptState?.result}
                initial={{ opacity: 0, y: 10 }}
                exit={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'tween' }}
                className="flex h-3/4 flex-col items-center justify-center gap-2"
                role="status"
                aria-live="assertive"
              >
                <p className={clsx(lastScanAttemptState ? 'text-4xl font-bold text-white' : 'brand-font text-5xl')}>
                  {lastScanAttemptState ? mapScanAttemptResultToString(lastScanAttemptState.result) : 'treble'}
                </p>
                {lastScanAttemptState ? (
                  <p className="text-sm font-semibold text-zinc-200">(tap om opnieuw te scannen)</p>
                ) : null}
              </motion.section>
            </AnimatePresence>

            <section className="h-1/4 text-center font-semibold text-zinc-200">
              <p>
                {errorMessageState ? (
                  <>
                    {errorMessageState}
                    <br />
                    <span className="text-sm">(tap om opnieuw te scannen)</span>
                  </>
                ) : (
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
              </p>
            </section>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2" role="alert" aria-live="assertive">
          <WifiIcon aria-hidden="true" />
          <p className="text-center font-semibold">Geen internetverbinding</p>
        </div>
      )}
    </div>
  );
}
