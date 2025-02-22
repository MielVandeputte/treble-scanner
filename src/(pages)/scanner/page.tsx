import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import QrScanner from 'qr-scanner';
import {
    TicketScanAttemptHistoryContext,
    InternetConnectedContext,
    ScannerCredentialsContext,
} from '../../context-provider.tsx';
import { useNavigate } from 'react-router-dom';
import { TicketScanAttempt, TicketScanAttemptResult } from '../../types.ts';
import { getBaseBackendUrl } from '../../common/backend-base-url.ts';
import { ScannerCard } from './card.tsx';

export function Scanner() {
    const navigate = useNavigate();

    const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);
    const internetConnectedContext = useContext(InternetConnectedContext);

    const [hasFlashState, setHasFlashState] = useState<boolean>(false);
    const [isFlashOnState, setIsFlashOnState] = useState<boolean>(false);
    const [camerasListState, setCamerasListState] = useState<QrScanner.Camera[]>([]);

    const [ticketScanResultState, setTicketScanResultState] = useState<TicketScanAttemptResult | null>();
    const [ownerNameState, setOwnerNameState] = useState<string | null>();
    const [ownerEmailState, setOwnerEmailState] = useState<string | null>();
    const [ticketTypeNameState, setTicketTypeNameState] = useState<string | null>();

    const [errorMessageState, setErrorMessageState] = useState<string | null>(null);

    const timer = useRef<NodeJS.Timeout | null>(null);
    const qrScanner = useRef<QrScanner | null>(null);

    const viewFinder = useRef<HTMLVideoElement | null>(null);
    const overlay = useRef<HTMLDivElement | null>(null);

    const scanningActive = useRef<boolean>(true);
    const togglingFlash = useRef<boolean>(false);
    const switchingCameras = useRef<boolean>(false);
    const preferredCameraEnvironment = useRef<boolean>(true);

    useEffect(() => {
        if (!scannerCredentialsContext.scannerCredentials) {
            navigate('/');
        }
    }, [navigate, scannerCredentialsContext.scannerCredentials]);

    const handleScan = useCallback(
        async (scanResult: QrScanner.ScanResult) => {
            if (!scanningActive.current || !internetConnectedContext) {
                return;
            }

            setTicketScanResultState(undefined);
            setOwnerNameState(undefined);
            setOwnerEmailState(undefined);
            setTicketTypeNameState(undefined);

            setErrorMessageState(null);

            if (!scanResult.data) {
                setErrorMessageState('Geen QR-code gevonden');
            } else if (!scannerCredentialsContext.scannerCredentials) {
                setErrorMessageState('Niet ingelogd');
            } else {
                scanningActive.current = false;

                try {
                    const scanTicketQuery = await fetch(
                        getBaseBackendUrl() +
                            `/events/${scannerCredentialsContext.scannerCredentials.eventId}/modules/basic-ticket-store/scan-ticket`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                secretCode: scanResult.data,
                                scanAuthorizationCode:
                                    scannerCredentialsContext.scannerCredentials.scanAuthorizationCode,
                            }),
                        }
                    );

                    const json = await scanTicketQuery.json();

                    if (scanTicketQuery.ok) {
                        setTicketScanResultState(json.data.result);
                        setOwnerNameState(json.data.ownerName);
                        setOwnerEmailState(json.data.ownerEmail);
                        setTicketTypeNameState(json.data.ticketTypeName);

                        const newTicketScanAttempt: TicketScanAttempt = {
                            id: crypto.randomUUID(),
                            result: json.data.result,
                            timestamp: new Date(),
                            secretCode: scanResult.data,
                            ownerName: json.data.ownerName,
                            ownerEmail: json.data.ownerEmail,
                            ticketTypeName: json.data.ticketTypeName,
                        };

                        ticketScanAttemptHistoryContext.addTicketScanAttemptToHistory(newTicketScanAttempt);

                        timer.current = setTimeout(() => {
                            setOwnerNameState(null);
                            setOwnerEmailState(null);
                            setTicketTypeNameState(null);
                            setTicketScanResultState(null);

                            scanningActive.current = true;
                            timer.current = null;
                        }, 10_000);
                    } else if (json.error) {
                        setErrorMessageState(json.error);
                        scanningActive.current = true;
                    }
                } catch (error) {
                    setErrorMessageState('Ongekende error opgetreden');
                    scanningActive.current = true;
                }
            }
        },
        [internetConnectedContext, scannerCredentialsContext.scannerCredentials]
    );

    useEffect(() => {
        if (viewFinder.current && overlay.current) {
            qrScanner.current = new QrScanner(viewFinder.current, handleScan, {
                preferredCamera: 'environment',
                calculateScanRegion: calculateScanRegion,
                highlightScanRegion: true,
                overlay: overlay.current,
            });

            qrScanner.current.start().then(() => {
                scanningActive.current = true;
                togglingFlash.current = false;
                switchingCameras.current = false;
                preferredCameraEnvironment.current = true;

                setTimeout(() => {
                    qrScanner.current?.hasFlash().then((result) => {
                        setHasFlashState(result);
                    });

                    QrScanner.listCameras().then((result) => {
                        setCamerasListState(result);
                    });
                }, 50);
            });
        }

        return () => {
            qrScanner.current?.destroy();
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        };
    }, [handleScan]);

    useEffect(() => {
        if (internetConnectedContext) {
            restartScanning();
        } else {
            setTicketScanResultState(null);
            setTicketTypeNameState(null);
            setOwnerNameState(null);
            setOwnerEmailState(null);
        }
    }, [internetConnectedContext]);

    function calculateScanRegion(video: HTMLVideoElement): QrScanner.ScanRegion {
        return {
            width: 400,
            height: 400,
            x: video.videoWidth / 2 - 200,
            y: (video.videoHeight * 2) / 6 - 200,
        };
    }

    function restartScanning(): void {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }

        setTicketScanResultState(null);
        setOwnerNameState(null);
        setOwnerEmailState(null);
        setTicketTypeNameState(null);

        scanningActive.current = true;
    }

    function toggleFlash(): void {
        if (qrScanner.current && !switchingCameras.current && !togglingFlash.current) {
            togglingFlash.current = true;

            if (qrScanner.current.isFlashOn()) {
                qrScanner.current.turnFlashOff().then(() => {
                    setIsFlashOnState(false);
                    togglingFlash.current = false;
                });
            } else {
                qrScanner.current.turnFlashOn().then(() => {
                    setIsFlashOnState(true);
                    togglingFlash.current = false;
                });
            }
        }
    }

    function toggleCamera(): void {
        if (qrScanner.current && !switchingCameras.current) {
            switchingCameras.current = true;
            setIsFlashOnState(false);

            if (preferredCameraEnvironment.current) {
                qrScanner.current.setCamera('user').then(() => {
                    qrScanner.current?.hasFlash().then((result) => {
                        setHasFlashState(result);
                    });
                    preferredCameraEnvironment.current = false;
                    switchingCameras.current = false;
                    togglingFlash.current = false;
                });
            } else {
                qrScanner.current.setCamera('environment').then(() => {
                    qrScanner.current?.hasFlash().then((result) => {
                        setHasFlashState(result);
                    });
                    preferredCameraEnvironment.current = true;
                    switchingCameras.current = false;
                    togglingFlash.current = false;
                });
            }
        }
    }

    return (
        <main className="overflow-hidden h-dvh bg-zinc-950 absolute top-0 w-screen select-none">
            <video ref={viewFinder} className="object-cover w-screen h-dvh" />

            <div
                ref={overlay}
                className={clsx(
                    'border-[8px] border-solid rounded-sm border-opacity-40 transition duration-200',
                    ticketScanResultState === 'SUCCESS' && 'border-emerald-800',
                    ticketScanResultState === 'ALREADY_SCANNED' && 'border-amber-800',
                    ticketScanResultState === 'NOT_FOUND' && 'border-rose-800',
                    !ticketScanResultState && 'border-zinc-200'
                )}
            />

            <ScannerCard
                restartScanning={restartScanning}
                toggleCamera={toggleCamera}
                camerasListState={camerasListState}
                switchingCameras={switchingCameras.current}
                toggleFlash={toggleFlash}
                isFlashOnState={isFlashOnState}
                hasFlashState={hasFlashState}
                ticketScanResultState={ticketScanResultState}
                ticketTypeNameState={ticketTypeNameState}
                ownerNameState={ownerNameState}
                ownerEmailState={ownerEmailState}
                errorMessageState={errorMessageState}
            />
        </main>
    );
}
