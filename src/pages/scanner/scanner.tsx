import clsx from 'clsx';
import QrScanner from 'qr-scanner';
import { JSX, use, useCallback, useEffect, useRef, useState } from 'react';

import { ScannerCard } from './scanner-card.tsx';
import { ScanCredentialsContext } from '../../contexts/scan-credentials-context.tsx';
import { ScanHistoryContext } from '../../contexts/scan-history-context.tsx';
import { scanTicket } from '../../services/scan-ticket.ts';
import { ScanAttempt } from '../../types/scan-attempt.ts';

function calculateScanRegion(htmlVideoElement: HTMLVideoElement): QrScanner.ScanRegion {
  return {
    width: 400,
    height: 400,
    x: htmlVideoElement.videoWidth / 2 - 200,
    y: (htmlVideoElement.videoHeight * 2) / 6 - 200,
  };
}

export function Scanner(): JSX.Element {
  const scanCredentials = use(ScanCredentialsContext).scanCredentials;
  const addScanAttempt = use(ScanHistoryContext).addScanAttempt;

  const [hasFlashState, setHasFlashState] = useState<boolean>(false);
  const [isFlashOnState, setFlashEnabledState] = useState<boolean>(false);
  const [camerasListState, setCamerasListState] = useState<QrScanner.Camera[]>([]);

  const [lastScanAttemptState, setLastScanAttemptState] = useState<ScanAttempt | null>(null);
  const [errorMessageState, setErrorMessageState] = useState<string | null>(null);

  const viewFinder = useRef<HTMLVideoElement | null>(null);
  const overlay = useRef<HTMLDivElement | null>(null);
  const scanner = useRef<QrScanner | null>(null);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const scanningActive = useRef<boolean>(false);
  const togglingFlash = useRef<boolean>(false);
  const switchingCameras = useRef<boolean>(false);
  const selectedCamera = useRef<'environment' | 'user'>('environment');

  const handleScan = useCallback(
    async (scanResult: QrScanner.ScanResult) => {
      if (!scanningActive.current || !navigator.onLine) {
        return;
      }

      if (scanResult.data) {
        scanningActive.current = false;

        const scanAttempt = await scanTicket(scanResult.data, scanCredentials!);

        if (scanAttempt.data) {
          setLastScanAttemptState(scanAttempt.data);
          addScanAttempt(scanAttempt.data);
        } else if (scanAttempt.error) {
          setErrorMessageState(scanAttempt.error);
        }
        timer.current = setTimeout(() => restartScanning(), 10_000);
      } else {
        setErrorMessageState('Geen QR-code gevonden');
      }
    },
    [scanCredentials, addScanAttempt],
  );

  useEffect(() => {
    if (viewFinder.current && overlay.current) {
      scanner.current = new QrScanner(viewFinder.current, handleScan, {
        preferredCamera: 'environment',
        calculateScanRegion: calculateScanRegion,
        highlightScanRegion: true,
        overlay: overlay.current,
      });

      scanner.current.start().then(() => {
        scanningActive.current = true;
        togglingFlash.current = false;
        switchingCameras.current = false;
        selectedCamera.current = 'environment';

        setTimeout(() => {
          scanner.current?.hasFlash().then(result => {
            setHasFlashState(result);
          });

          QrScanner.listCameras().then(result => {
            setCamerasListState(result);
          });
        }, 100);
      });
    }

    return () => {
      setHasFlashState(false);
      setFlashEnabledState(false);
      setCamerasListState([]);

      setLastScanAttemptState(null);
      setErrorMessageState(null);

      scanner.current?.destroy();
      scanner.current = null;

      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      scanningActive.current = false;
      togglingFlash.current = false;
      switchingCameras.current = false;
      selectedCamera.current = 'environment';
    };
  }, [handleScan]);

  function restartScanning(): void {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setLastScanAttemptState(null);
    setErrorMessageState(null);

    scanningActive.current = true;
  }

  function toggleFlash(): void {
    if (scanner.current && !switchingCameras.current && !togglingFlash.current) {
      togglingFlash.current = true;

      if (scanner.current.isFlashOn()) {
        scanner.current.turnFlashOff().then(() => {
          setFlashEnabledState(false);
          togglingFlash.current = false;
        });
      } else {
        scanner.current.turnFlashOn().then(() => {
          setFlashEnabledState(true);
          togglingFlash.current = false;
        });
      }
    }
  }

  function toggleCamera(): void {
    if (scanner.current && !switchingCameras.current && !togglingFlash.current) {
      switchingCameras.current = true;

      if (selectedCamera.current === 'environment') {
        scanner.current.setCamera('user').then(() => {
          setHasFlashState(false);
          setFlashEnabledState(false);

          scanner.current?.hasFlash().then(result => {
            setHasFlashState(result);
          });

          selectedCamera.current = 'user';
          switchingCameras.current = false;
        });
      } else if (selectedCamera.current === 'user') {
        scanner.current.setCamera('environment').then(() => {
          setHasFlashState(false);
          setFlashEnabledState(false);

          scanner.current?.hasFlash().then(result => {
            setHasFlashState(result);
          });

          selectedCamera.current = 'environment';
          switchingCameras.current = false;
        });
      }
    }
  }

  return (
    <main className="absolute top-0 h-svh overflow-hidden bg-zinc-950 select-none">
      <video ref={viewFinder} className="h-svh w-screen object-cover" aria-hidden="true" />

      <div
        ref={overlay}
        className={clsx(
          lastScanAttemptState?.result === 'SUCCESS' ? 'border-emerald-900/40' : '',
          lastScanAttemptState?.result === 'ALREADY_SCANNED' ? 'border-amber-900/40' : '',
          lastScanAttemptState?.result === 'NOT_FOUND' ? 'border-rose-900/40' : '',
          lastScanAttemptState?.result ? '' : 'border-zinc-200/40',
          'rounded-sm border-8 border-solid transition',
        )}
        aria-hidden="true"
      />

      <ScannerCard
        hasFlashState={hasFlashState}
        isFlashOnState={isFlashOnState}
        camerasListState={camerasListState}
        lastScanAttemptState={lastScanAttemptState}
        errorMessageState={errorMessageState}
        restartScanning={restartScanning}
        toggleFlash={toggleFlash}
        toggleCamera={toggleCamera}
      />
    </main>
  );
}
