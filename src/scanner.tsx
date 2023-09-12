import '@fontsource/proza-libre/600.css';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import QrScanner from 'qr-scanner';
import { HistoryContext, ScanSessionContext, Ticket } from './wrapper';
import { Link, useNavigate } from 'react-router-dom';

let viewFinder: HTMLVideoElement | null = null;
let overlay: HTMLDivElement | null = null;

let timer: NodeJS.Timeout|null = null;    

let active = true;
let togglingFlash = false;
let switchingCameras = false;
let environmentState = true;

function calculateScanRegion(video: HTMLVideoElement): QrScanner.ScanRegion {
    return {
        width: 400,
        height: 400,
        x: video.videoWidth/2 - 200,
        y: video.videoHeight * 2/6 - 200,
    } as QrScanner.ScanRegion;
}

export default function Scanner() {
    const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
    const [hasFlash, setHasFlash] = useState<boolean>(false);
    const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
    const [listCameras, setListCameras] = useState<QrScanner.Camera[] | null>(null);
    
    const [_qr, setQr] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [ownerName, setOwnerName] = useState<string>('');
    const [ownerEmail, setOwnerEmail] = useState<string>('');
    const [ticketTypeId, setTicketTypeId] = useState<number>(0);
    const [ticketTypeName, setTicketTypeName] = useState<string>('');

    const historyContext = useContext(HistoryContext);
    const scanSessionContext = useContext(ScanSessionContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (scanSessionContext.scanSession == null) {
            navigate('/'); 
        } else {
            viewFinder = document.getElementById('viewFinder') as HTMLVideoElement;
            overlay = document.getElementById('overlay') as HTMLDivElement;

            const qrScanner = new QrScanner(
                viewFinder,
                result => { handleScan(result); },
                { maxScansPerSecond: 1, preferredCamera: 'environment', calculateScanRegion: calculateScanRegion, highlightScanRegion: true, overlay: overlay},
            );

            setQrScanner(qrScanner);
            qrScanner.start().then(() => {
                qrScanner.hasFlash().then((result) => {setHasFlash(result)});
                QrScanner.listCameras().then((result) => {setListCameras(result)});
            });
        }
    }, []);
    
    const handleScan = async (result: QrScanner.ScanResult) => {
        if (result && result.data && active && scanSessionContext.scanSession) {
            active = false;
            setQr(result.data);

            const res = await fetch('https://www.glow-events.be/api/scan-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'eventId': scanSessionContext.scanSession.eventId, 'secretCode': result.data, 'scanAuthorizationCode': '952bf6c7edb188e66ae69e38af4f2b7b' })
            });
    
            if (res.ok) {
                await qrScanner?.pause();
                const data = await res.json();

                if (data.code != 'noTicket') {
                    setOwnerName(data.ownerName);
                    setOwnerEmail(data.ownerEmail);
                    setTicketTypeId(data.ticketTypeId);
                    setTicketTypeName(data.ticketTypeName);
                    
                    const newTicket: Ticket = { timestamp: new Date(), qr: result.data, code: data.code, ownerName: data.ownerName, ownerEmail: data.ownerEmail, ticketTypeId: data.ticketTypeId, ticketTypeName: data.ticketTypeName } as Ticket;
                    historyContext.addToHistory(newTicket);
                }

                setCode(data.code);

                timer = setTimeout(async () => {
                    setCode('');
                    active = true;
                    await qrScanner?.start();
                    timer = null;
                }, 10_000);
            } else {
                active = true;
                await qrScanner?.start();
            }
        }
    }

    const removeCode = async () => {
        if (timer) { clearTimeout(timer); }
        setCode('');
        active = true;
        await qrScanner?.start();
    }

    const toggleFlash = () => {
        console.log('correctversion')
        if (qrScanner && !switchingCameras && !togglingFlash) {
            togglingFlash = true;
            if (qrScanner.isFlashOn()) {
                qrScanner.turnFlashOff().then(() => {
                    setIsFlashOn(false);
                    togglingFlash = false;
                });
            } else {
                qrScanner.turnFlashOn().then(() => {
                    setIsFlashOn(true);
                    togglingFlash = false;
                });
            }
        }
    }

    const toggleCamera = () => {
        if (qrScanner && !switchingCameras) {
            switchingCameras = true;
            setIsFlashOn(false);

            if (environmentState) {
                qrScanner.setCamera('user').then(() => {
                    qrScanner.hasFlash().then((result) => { setHasFlash(result); });
                    environmentState = false;
                    switchingCameras = false;
                });
            } else {
                qrScanner.setCamera('environment').then(() => {
                    qrScanner.hasFlash().then((result) => { setHasFlash(result); });
                    environmentState = true;
                    switchingCameras = false;
                });
            }
        }
    }

    return (
        <main className='overflow-hidden h-screen bg-zinc-950 absolute top-0 w-screen select-none'>
            <video id='viewFinder' className='object-cover w-full h-[100dvh]'/>

            <div id='overlay' className={clsx('border-[8px] border-solid rounded-md border-opacity-40 transition duration-200', code == 'success' && 'border-green-800', code == 'alreadyScanned' && 'border-yellow-800', code == 'noTicket' && 'border-red-800', code == '' && 'border-zinc-200')}/>

            <header className={clsx('absolute overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 p-5', code == 'success' && 'bg-green-800', code == 'alreadyScanned' && 'bg-yellow-800', code == 'noTicket' && 'bg-red-800', code == '' && 'bg-zinc-900')}>
                <section className='flex w-full justify-around no-blue-box h-1/5'>
                    {
                        hasFlash?            
                            <button className='w-12 aspect-square flex justify-center items-center' onClick={toggleFlash}>
                                {
                                    isFlashOn?
                                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={code == ''? '#999999': '#ffffff'} className='w-6 h-6'>
                                            <path fill-rule='evenodd' d='M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z' clip-rule='evenodd' />
                                        </svg>:

                                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={code == ''? '#999999': '#ffffff'} className='w-6 h-6'>
                                            <path d='M20.798 11.012l-3.188 3.416L9.462 6.28l4.24-4.542a.75.75 0 011.272.71L12.982 9.75h7.268a.75.75 0 01.548 1.262zM3.202 12.988L6.39 9.572l8.148 8.148-4.24 4.542a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262zM3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18z' />
                                        </svg>
                                }
                            </button>:
                        <></>
                    }

                    {
                        listCameras && listCameras.length > 1?
                            <button className='w-12 aspect-square flex justify-center items-center' onClick={toggleCamera} disabled={switchingCameras}>
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={code == ''? '#999999': '#ffffff'} className='w-6 h-6'>
                                    <path fillRule='evenodd' d='M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z' clipRule='evenodd' />
                                </svg>
                            </button>:
                        <></>
                    }

                    <Link to={'/menu'} className='w-12 aspect-square flex justify-center items-center '>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={code == ''? '#999999': '#ffffff'} className='w-6 h-6'>
                            <path fillRule='evenodd' d='M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z' clipRule='evenodd' />
                        </svg>
                    </Link>
                </section>
                    
                <section onClick={removeCode} className='w-full relative h-3/5'>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center text-white font-sans font-bold text-5xl', code == 'success'? 'fade-in': 'fade-out')}>
                        Success
                    </h1>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center text-white font-sans font-bold text-5xl', code == 'noTicket'? 'fade-in': 'fade-out')}>
                        Geen<br/>ticket
                    </h1>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center text-white font-sans font-bold text-5xl', code == 'alreadyScanned'? 'fade-in': 'fade-out')}>
                        Al<br/>gescand
                    </h1>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 bottom-1/2 translate-y-[55%]  text-center text-zinc-400 logo text-5xl', code == ''? 'fade-in': 'fade-out')}>
                        glow
                    </h1>
                </section>

                <section onClick={(removeCode)} className={clsx('h-1/5 overflow-ellipsis whitespace-nowrap w-full transition duration-200',(!code || code === 'noTicket') && 'hidden')}>                    
                    <div className='text-white overflow-hidden whitespace-nowrap font-sans text-center font-semibold'>Type {ticketTypeId} | {ticketTypeName}</div>
                    <div className='text-white overflow-hidden whitespace-nowrap font-sans text-center font-semibold'>{ownerName} | {ownerEmail}</div>
                </section>
            </header>
        </main>
    );
}