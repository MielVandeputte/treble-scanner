import '@fontsource/proza-libre/600.css';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import QrScanner from 'qr-scanner';
import {
    TicketScanAttemptHistoryContext,
    InternetConnectedContext,
    ScannerCredentialsContext,
} from '../context-provider.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { TicketScanAttempt } from '../types.ts';

let viewFinder: HTMLVideoElement | null = null;
let overlay: HTMLDivElement | null = null;

let qrScanner: QrScanner | null = null;
let timer: NodeJS.Timeout | null = null;

let active = true;
let togglingFlash = false;
let switchingCameras = false;
let environmentState = true;

function calculateScanRegion(video: HTMLVideoElement): QrScanner.ScanRegion {
    return {
        width: 400,
        height: 400,
        x: video.videoWidth / 2 - 200,
        y: (video.videoHeight * 2) / 6 - 200,
    };
}

export function ScannerPage() {
    const navigate = useNavigate();

    const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);
    const internetConnectedContext = useContext(InternetConnectedContext);

    const [hasFlashState, setHasFlashState] = useState<boolean>(false);
    const [isFlashOnState, setIsFlashOnState] = useState<boolean>(false);
    const [camerasListState, setCamerasListState] = useState<QrScanner.Camera[]>();

    const [ticketScanResultState, setTicketScanResultState] = useState<string | null>();
    const [ownerNameState, setOwnerNameState] = useState<string | null>();
    const [ownerEmailState, setOwnerEmailState] = useState<string | null>();
    const [ticketTypeNameState, setTicketTypeNameState] = useState<string | null>();

    const [errorMessageState, setErrorMessageState] = useState<string | null>();

    useEffect(() => {
        if (!scannerCredentialsContext.scannerCredentials) navigate('/');
    }, [scannerCredentialsContext.scannerCredentials]);

    useEffect(() => {
        viewFinder = document.getElementById('viewFinder') as HTMLVideoElement;
        overlay = document.getElementById('overlay') as HTMLDivElement;

        qrScanner = new QrScanner(viewFinder, handleScan, {
            preferredCamera: 'environment',
            calculateScanRegion: calculateScanRegion,
            highlightScanRegion: true,
            overlay: overlay,
        });

        qrScanner.start().then(() => {
            active = true;
            togglingFlash = false;
            switchingCameras = false;
            environmentState = true;

            qrScanner?.hasFlash().then((result) => {
                setHasFlashState(result);
            });

            QrScanner.listCameras().then((result) => {
                setCamerasListState(result);
            });
        });

        return () => {
            qrScanner?.destroy();
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!internetConnectedContext.valueOf()) {
            setTicketScanResultState(null);
            setTicketTypeNameState(null);
            setOwnerNameState(null);
            setOwnerEmailState(null);
        }
    }, [internetConnectedContext]);

    async function handleScan(scanResult: QrScanner.ScanResult): Promise<void> {
        if (!active || !internetConnectedContext.valueOf()) return;

        if (!scanResult.data) {
            setErrorMessageState('Geen QR-code gevonden');
        } else if (!scannerCredentialsContext.scannerCredentials) {
            setErrorMessageState('Niet ingelogd');
        } else {
            active = false;
            setErrorMessageState(null);

            const scanTicketQuery = await fetch(
                `https://www.glow-events.be/api/events/${scannerCredentialsContext.scannerCredentials.eventId}/modules/basic-ticket-store/scan-ticket`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        secretCode: scanResult.data,
                        scanAuthorizationCode: scannerCredentialsContext.scannerCredentials.scanAuthorizationCode,
                    }),
                }
            );

            const json = await scanTicketQuery.json();

            if (scanTicketQuery.ok) {
                setOwnerNameState(json.data.ownerName);
                setOwnerEmailState(json.data.ownerEmail);
                setTicketTypeNameState(json.data.ticketTypeName);
                setTicketScanResultState(json.data.result);

                const newTicketScanAttempt: TicketScanAttempt = {
                    result: json.data.result,
                    timestamp: new Date(),
                    secretCode: scanResult.data,
                    ownerName: json.data.ownerName,
                    ownerEmail: json.data.ownerEmail,
                    ticketTypeName: json.data.ticketTypeName,
                };

                ticketScanAttemptHistoryContext.addTicketScanAttemptToHistory(newTicketScanAttempt);
            } else if (json.error) {
                setErrorMessageState(json.error);
            }

            timer = setTimeout(() => {
                setTicketScanResultState(null);
                setOwnerNameState(null);
                setOwnerEmailState(null);
                setTicketTypeNameState(null);

                active = true;
                timer = null;
            }, 10_000);
        }
    }

    function restartScanning(): void {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        setTicketScanResultState(null);
        setOwnerNameState(null);
        setOwnerEmailState(null);
        setTicketTypeNameState(null);

        active = true;
    }

    function toggleFlash(): void {
        if (qrScanner && !switchingCameras && !togglingFlash) {
            togglingFlash = true;

            if (qrScanner.isFlashOn()) {
                qrScanner.turnFlashOff().then(() => {
                    setIsFlashOnState(false);
                    togglingFlash = false;
                });
            } else {
                qrScanner.turnFlashOn().then(() => {
                    setIsFlashOnState(true);
                    togglingFlash = false;
                });
            }
        }
    }

    function toggleCamera(): void {
        if (qrScanner && !switchingCameras) {
            switchingCameras = true;
            setIsFlashOnState(false);

            if (environmentState) {
                qrScanner.setCamera('user').then(() => {
                    qrScanner?.hasFlash().then((result) => {
                        setHasFlashState(result);
                    });
                    environmentState = false;
                    switchingCameras = false;
                    togglingFlash = false;
                });
            } else {
                qrScanner.setCamera('environment').then(() => {
                    qrScanner?.hasFlash().then((result) => {
                        setHasFlashState(result);
                    });
                    environmentState = true;
                    switchingCameras = false;
                    togglingFlash = false;
                });
            }
        }
    }

    return (
        <main className="overflow-hidden h-dvh bg-zinc-950 absolute top-0 w-screen select-none">
            <video id="viewFinder" className="object-cover w-full h-dvh" />

            <div
                id="overlay"
                className={clsx(
                    'border-[8px] border-solid rounded-md border-opacity-40 transition duration-200',
                    ticketScanResultState === 'success' && 'border-green-800',
                    ticketScanResultState === 'alreadyScanned' && 'border-yellow-800',
                    ticketScanResultState === 'notFound' && 'border-red-800',
                    !ticketScanResultState && 'border-zinc-200'
                )}
            />

            <header
                className={clsx(
                    'absolute overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 p-5',
                    ticketScanResultState === 'success' && 'bg-green-800',
                    ticketScanResultState === 'alreadyScanned' && 'bg-yellow-800',
                    ticketScanResultState === 'notFound' && 'bg-red-800',
                    !ticketScanResultState && 'bg-zinc-950'
                )}
            >
                {internetConnectedContext ? (
                    <div className="w-full h-full">
                        <section className="flex w-full justify-around no-blue-box h-1/5">
                            {hasFlashState ? (
                                <button
                                    className="w-12 aspect-square flex justify-center items-center"
                                    onClick={toggleFlash}
                                >
                                    {isFlashOnState ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill={ticketScanResultState == '' ? '#999999' : '#ffffff'}
                                            className="w-6 h-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill={ticketScanResultState == '' ? '#999999' : '#ffffff'}
                                            className="w-6 h-6"
                                        >
                                            <path d="M20.798 11.012l-3.188 3.416L9.462 6.28l4.24-4.542a.75.75 0 011.272.71L12.982 9.75h7.268a.75.75 0 01.548 1.262zM3.202 12.988L6.39 9.572l8.148 8.148-4.24 4.542a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262zM3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18z" />
                                        </svg>
                                    )}
                                </button>
                            ) : (
                                <></>
                            )}

                            {camerasListState && camerasListState.length > 1 ? (
                                <button
                                    className="w-12 aspect-square flex justify-center items-center"
                                    onClick={toggleCamera}
                                    disabled={switchingCameras}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={ticketScanResultState == '' ? '#999999' : '#ffffff'}
                                        className="w-6 h-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            ) : (
                                <></>
                            )}

                            <Link
                                to={'/manual-scanner'}
                                className="w-12 aspect-square flex justify-center items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke={ticketScanResultState == '' ? '#999999' : '#ffffff'}
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                </svg>
                            </Link>

                            <Link to={'/menu'} className="w-12 aspect-square flex justify-center items-center ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={ticketScanResultState === '' ? '#999999' : '#ffffff'}
                                    className="w-6 h-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </section>

                        <button onClick={restartScanning} className="w-full relative h-3/5 whitespace-nowrap">
                            <h1
                                className={clsx(
                                    'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center text-white font-sans font-bold text-4xl',
                                    ticketScanResultState === 'success' ? 'fade-in' : 'fade-out'
                                )}
                            >
                                Geldig ticket
                            </h1>
                            <h1
                                className={clsx(
                                    'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center text-white font-sans font-bold text-4xl',
                                    ticketScanResultState === 'notFound' ? 'fade-in' : 'fade-out'
                                )}
                            >
                                Ongeldig ticket
                            </h1>
                            <h1
                                className={clsx(
                                    'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center text-white font-sans font-bold text-4xl',
                                    ticketScanResultState === 'alreadyScanned' ? 'fade-in' : 'fade-out'
                                )}
                            >
                                Al gescand
                            </h1>
                            <h1
                                className={clsx(
                                    'absolute left-1/2 -translate-x-1/2 bottom-1/2 translate-y-[55%] text-center text-zinc-400 logo text-5xl',
                                    !ticketScanResultState ? 'fade-in' : 'fade-out'
                                )}
                            >
                                glow
                            </h1>
                        </button>

                        <button
                            onClick={restartScanning}
                            className={clsx(
                                'h-1/5 overflow-ellipsis whitespace-nowrap w-full transition duration-200 ease-in-out text-zinc-200 font-sans text-center font-semibold'
                            )}
                        >
                            <div>{errorMessageState}</div>
                            <div>{ticketTypeNameState}</div>
                            {ownerNameState && ownerEmailState && (
                                <div>
                                    {ownerNameState} | {ownerEmailState}
                                </div>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-full flex justify-center items-center flex-col transition duration-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#999999"
                            className="w-6 h-6 mb-6 mx-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                            />
                        </svg>

                        <h1 className="font-semibold text-center text-zinc-400">Geen internetverbinding</h1>
                    </div>
                )}
            </header>
        </main>
    );
}
