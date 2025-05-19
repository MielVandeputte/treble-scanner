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

  const viewFinderRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scanningActiveRef = useRef<boolean>(false);
  const togglingFlashRef = useRef<boolean>(false);
  const switchingCameraRef = useRef<boolean>(false);
  const selectedCameraRef = useRef<'environment' | 'user'>('environment');

  const handleScan = useCallback(
    async (scanResult: QrScanner.ScanResult) => {
      if (!scanningActiveRef.current || !navigator.onLine) {
        return;
      }

      if (scanResult.data) {
        scanningActiveRef.current = false;

        const { data, error } = await scanTicket(scanResult.data, scanCredentials!);

        if (data) {
          setLastScanAttempt(data);
          addScanAttempt(data);
        } else if (error) {
          setErrorMessage(error);
        }

        restartTimeoutRef.current = setTimeout(restartScanning, 10_000);
      } else {
        setErrorMessage('Geen QR-code gevonden');
      }
    },
    [scanCredentials, addScanAttempt],
  );

  useEffect(() => {
    if (viewFinderRef.current && overlayRef.current) {
      scannerRef.current = new QrScanner(viewFinderRef.current, handleScan, {
        preferredCamera: 'environment',
        calculateScanRegion,
        highlightScanRegion: true,
        overlay: overlayRef.current,
      });

      scannerRef.current.start().then(() => {
        scanningActiveRef.current = true;
        togglingFlashRef.current = false;
        switchingCameraRef.current = false;
        selectedCameraRef.current = 'environment';

        setTimeout(() => {
          scannerRef.current?.hasFlash().then(result => {
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

      scannerRef.current?.destroy();
      scannerRef.current = null;

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }

      scanningActiveRef.current = false;
      togglingFlashRef.current = false;
      switchingCameraRef.current = false;
      selectedCameraRef.current = 'environment';
    };
  }, [handleScan]);

  function restartScanning(): void {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    setLastScanAttempt(null);
    setErrorMessage(null);

    scanningActiveRef.current = true;
  }

  function toggleFlash(): void {
    if (scannerRef.current && !togglingFlashRef.current && !switchingCameraRef.current) {
      togglingFlashRef.current = true;

      if (scannerRef.current.isFlashOn()) {
        scannerRef.current.turnFlashOff().then(() => {
          setFlashEnabled(false);
          togglingFlashRef.current = false;
        });
      } else {
        scannerRef.current.turnFlashOn().then(() => {
          setFlashEnabled(true);
          togglingFlashRef.current = false;
        });
      }
    }
  }

  function switchCamera(): void {
    if (scannerRef.current && !switchingCameraRef.current && !togglingFlashRef.current) {
      switchingCameraRef.current = true;

      if (selectedCameraRef.current === 'environment') {
        scannerRef.current.setCamera('user').then(() => {
          setHasFlash(false);
          setFlashEnabled(false);

          scannerRef.current?.hasFlash().then(result => {
            setHasFlash(result);
          });

          selectedCameraRef.current = 'user';
          switchingCameraRef.current = false;
        });
      } else if (selectedCameraRef.current === 'user') {
        scannerRef.current.setCamera('environment').then(() => {
          setHasFlash(false);
          setFlashEnabled(false);

          scannerRef.current?.hasFlash().then(result => {
            setHasFlash(result);
          });

          selectedCameraRef.current = 'environment';
          switchingCameraRef.current = false;
        });
      }
    }
  }

  return (
    <main className="absolute top-0 h-svh w-screen overflow-hidden bg-zinc-950 select-none">
      <video ref={viewFinderRef} className="h-svh w-screen object-cover" aria-hidden />

      <div
        ref={overlayRef}
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
