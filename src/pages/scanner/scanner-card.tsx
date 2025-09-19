import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import QrScanner from 'qr-scanner';
import { JSX } from 'react';

import { CameraSwitchButton, FlashToggle, ManualScannerLink, ScanHistoryLink } from './scanner-card-buttons.tsx';
import { WifiIcon } from '../../components/icons.tsx';
import { useOnlineStatus } from '../../hooks/use-online-status.tsx';
import { mapScanAttemptResultToString, ScanAttempt } from '../../types/scan-attempt.ts';

import '@fontsource/proza-libre/600.css';

export function ScannerCard({
  hasFlash,
  flashEnabled,
  cameraList,

  lastScanAttempt,
  errorMessage,

  restartScanning,
  toggleFlash,
  switchCamera,
}: {
  hasFlash: boolean;
  flashEnabled: boolean;
  cameraList: QrScanner.Camera[];

  lastScanAttempt: ScanAttempt | null;
  errorMessage: string | null | undefined;

  restartScanning: () => void;
  toggleFlash: () => void;
  switchCamera: () => void;
}): JSX.Element {
  const onlineStatus = useOnlineStatus();

  return (
    <div
      className={clsx(
        lastScanAttempt?.result === 'SUCCESS' ? 'bg-emerald-900/95' : '',
        lastScanAttempt?.result === 'ALREADY_SCANNED' ? 'bg-amber-900/95' : '',
        lastScanAttempt?.result === 'NOT_FOUND' ? 'bg-rose-900/95' : '',
        lastScanAttempt?.result ? '' : 'bg-zinc-950/95',
        'absolute bottom-0 z-50 h-1/3 w-full overflow-hidden rounded-t-md p-5 transition',
      )}
      data-testid="scanner-card"
    >
      {onlineStatus ? (
        <>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.section
              key={'' + flashEnabled + (cameraList?.length > 1)}
              className="flex h-1/5 justify-around"
              initial={{ opacity: 0, y: 10 }}
              exit={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'tween' }}
            >
              {hasFlash ? (
                <FlashToggle
                  toggled={flashEnabled}
                  appearance={lastScanAttempt === null ? 'regular' : 'bright'}
                  onToggle={toggleFlash}
                />
              ) : null}

              {cameraList?.length > 1 ? (
                <CameraSwitchButton
                  appearance={lastScanAttempt === null ? 'regular' : 'bright'}
                  onClick={switchCamera}
                />
              ) : null}

              <ManualScannerLink appearance={lastScanAttempt === null ? 'regular' : 'bright'} />
              <ScanHistoryLink appearance={lastScanAttempt === null ? 'regular' : 'bright'} />
            </motion.section>
          </AnimatePresence>

          <div role="button" tabIndex={0} onClick={restartScanning} className="h-4/5" aria-label="Scan opnieuw">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.section
                key={lastScanAttempt?.result}
                initial={{ opacity: 0, y: 10 }}
                exit={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'tween' }}
                className="flex h-3/4 flex-col items-center justify-center gap-2"
                role="status"
                aria-live="assertive"
              >
                <p className={clsx(lastScanAttempt ? 'text-4xl font-bold text-white' : 'brand-font text-5xl')}>
                  {lastScanAttempt ? mapScanAttemptResultToString(lastScanAttempt.result) : 'treble'}
                </p>
                {lastScanAttempt ? (
                  <p className="text-sm font-semibold text-zinc-200">(tap om opnieuw te scannen)</p>
                ) : null}
              </motion.section>
            </AnimatePresence>

            <section className="h-1/4 text-center font-semibold text-zinc-200" role="alert" aria-live="polite">
              <p>
                {errorMessage ? (
                  <>
                    {errorMessage}
                    <br />
                    <span className="text-sm">(tap om opnieuw te scannen)</span>
                  </>
                ) : (
                  <>
                    {lastScanAttempt?.ticketTypeName}
                    {lastScanAttempt?.ownerName ? (
                      <>
                        <br />
                        {lastScanAttempt?.ownerName}
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
          <WifiIcon aria-hidden />
          <p className="text-center font-semibold">Geen internetverbinding</p>
        </div>
      )}
    </div>
  );
}
