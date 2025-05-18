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

  const [hasFlash, setHasFlash] = useState<boolean>(false);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(false);
  const [cameraList, setCameraList] = useState<QrScanner.Camera[]>([]);

  const [lastScanAttempt, setLastScanAttempt] = useState<ScanAttempt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const viewFinder = useRef<HTMLVideoElement | null>(null);
  const overlay = useRef<HTMLDivElement | null>(null);
  const scanner = useRef<QrScanner | null>(null);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const scanningActive = useRef<boolean>(false);
  const togglingFlash = useRef<boolean>(false);
  const switchingCamera = useRef<boolean>(false);
  const selectedCamera = useRef<'environment' | 'user'>('environment');

  const handleScan = useCallback(
    async (scanResult: QrScanner.ScanResult) => {
      if (!scanningActive.current || !navigator.onLine) {
        return;
      }

      if (scanResult.data) {
        scanningActive.current = false;

        const { data, error } = await scanTicket(scanResult.data, scanCredentials!);

        if (data) {
          setLastScanAttempt(data);
          addScanAttempt(data);
        } else if (error) {
          setErrorMessage(error);
        }

        timer.current = setTimeout(restartScanning, 10_000);
      } else {
        setErrorMessage('Geen QR-code gevonden');
      }
    },
    [scanCredentials, addScanAttempt],
  );

  useEffect(() => {
    if (viewFinder.current && overlay.current) {
      scanner.current = new QrScanner(viewFinder.current, handleScan, {
        preferredCamera: 'environment',
        calculateScanRegion,
        highlightScanRegion: true,
        overlay: overlay.current,
      });

      scanner.current.start().then(() => {
        scanningActive.current = true;
        togglingFlash.current = false;
        switchingCamera.current = false;
        selectedCamera.current = 'environment';

        setTimeout(() => {
          scanner.current?.hasFlash().then(result => {
            setHasFlash(result);
          });

          QrScanner.listCameras().then(result => {
            setCameraList(result);
          });
        }, 100);
      });
    }

    return () => {
      setHasFlash(false);
      setFlashEnabled(false);
      setCameraList([]);

      setLastScanAttempt(null);
      setErrorMessage(null);

      scanner.current?.destroy();
      scanner.current = null;

      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      scanningActive.current = false;
      togglingFlash.current = false;
      switchingCamera.current = false;
      selectedCamera.current = 'environment';
    };
  }, [handleScan]);

  function restartScanning(): void {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setLastScanAttempt(null);
    setErrorMessage(null);

    scanningActive.current = true;
  }

  function toggleFlash(): void {
    if (scanner.current && !togglingFlash.current && !switchingCamera.current) {
      togglingFlash.current = true;

      if (scanner.current.isFlashOn()) {
        scanner.current.turnFlashOff().then(() => {
          setFlashEnabled(false);
          togglingFlash.current = false;
        });
      } else {
        scanner.current.turnFlashOn().then(() => {
          setFlashEnabled(true);
          togglingFlash.current = false;
        });
      }
    }
  }

  function switchCamera(): void {
    if (scanner.current && !switchingCamera.current && !togglingFlash.current) {
      switchingCamera.current = true;

      if (selectedCamera.current === 'environment') {
        scanner.current.setCamera('user').then(() => {
          setHasFlash(false);
          setFlashEnabled(false);

          scanner.current?.hasFlash().then(result => {
            setHasFlash(result);
          });

          selectedCamera.current = 'user';
          switchingCamera.current = false;
        });
      } else if (selectedCamera.current === 'user') {
        scanner.current.setCamera('environment').then(() => {
          setHasFlash(false);
          setFlashEnabled(false);

          scanner.current?.hasFlash().then(result => {
            setHasFlash(result);
          });

          selectedCamera.current = 'environment';
          switchingCamera.current = false;
        });
      }
    }
  }

  return (
    <main className="absolute top-0 h-svh w-screen overflow-hidden bg-zinc-950 select-none">
      <video ref={viewFinder} className="h-svh w-screen object-cover" aria-hidden />

      <div
        ref={overlay}
        className={clsx(
          lastScanAttempt?.result === 'SUCCESS' ? 'border-emerald-900/40' : '',
          lastScanAttempt?.result === 'ALREADY_SCANNED' ? 'border-amber-900/40' : '',
          lastScanAttempt?.result === 'NOT_FOUND' ? 'border-rose-900/40' : '',
          lastScanAttempt?.result ? '' : 'border-zinc-200/40',
          'rounded-sm border-8 border-solid transition',
        )}
        aria-hidden
      />

      <ScannerCard
        hasFlash={hasFlash}
        flashEnabled={flashEnabled}
        cameraList={cameraList}
        lastScanAttempt={lastScanAttempt}
        errorMessage={errorMessage}
        restartScanning={restartScanning}
        toggleFlash={toggleFlash}
        switchCamera={switchCamera}
      />
    </main>
  );
}
