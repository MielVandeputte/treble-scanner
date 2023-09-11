import '@fontsource/proza-libre/600.css';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import QrScanner from 'qr-scanner';

function calculateScanRegion(video: HTMLVideoElement): QrScanner.ScanRegion {
    return {
        width: 400,
        height: 400,
        x: video.videoWidth/2 - 200,
        y: video.videoHeight * 2/6 - 200,
    } as QrScanner.ScanRegion;
}

export default function App() {
    let viewFinder: HTMLVideoElement | null = null;
    let overlay: HTMLDivElement | null = null;

    let active = true;
    const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
    const [hasFlash, setHasFlash] = useState<boolean>(false);
    const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
    const [listCameras, setListCameras] = useState<QrScanner.Camera[] | null>(null);
    const [environmentState, setEnvironmentState] = useState<boolean>(true);
    const [switchingCameras, setSwitchingCameras] = useState<boolean>(false);
    const [code, setCode] = useState<string>(''); 

    useEffect(() => {
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
            QrScanner.listCameras().then((result) => {setListCameras(result);});
        });
    }, []);
    
    const handleScan = async (result: QrScanner.ScanResult) => {
        if (result && result.data && active) {
            active = false;
            
            const res = await fetch('https://www.glow-events.be/api/scan-ticket/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "eventId": " ", "secretCode": " "})
            });
    
    
            const json = await res.json();
            console.log(json)


            if (res.ok) {
                const data = await res.json();
                await qrScanner?.pause();
                setCode(data.code);

                setTimeout(async () => {
                    setCode('');
                    active = true;
                    await qrScanner?.start();
                }, 5000);
            } else {
                active = true;
                await qrScanner?.start();
            }
        }
    }

    const toggleFlash = () => {
        const func = async () => {
            if (qrScanner) {
                if (qrScanner.isFlashOn()) {
                    await qrScanner.turnFlashOff();
                } else {
                    await qrScanner.turnFlashOn();
                }
                setIsFlashOn(qrScanner.isFlashOn());
            }
        }
        func();
    }

    const toggleCamera = () => {
        const func = async () => {
            if (qrScanner && !switchingCameras) {
                setSwitchingCameras(true);
                if (environmentState) {
                    await qrScanner.setCamera('user');
                } else {
                    await qrScanner.setCamera('environment');
                }

                qrScanner.hasFlash().then((result) => {setHasFlash(result)});
                setEnvironmentState(!environmentState);
                setSwitchingCameras(false);
            }
        }
        func();
    }

    return (
        <main className='overflow-hidden h-screen bg-zinc-950 absolute top-0 w-screen select-none'>
            <video id='viewFinder' className='object-cover w-full h-[100dvh]'/>

            <div id='overlay' className={clsx('border-[8px] border-solid rounded-md border-opacity-90 transition duration-200', code == 'success' && 'border-green-800', code == 'alreadyScanned' && 'border-yellow-800', code == 'noTicket' && 'border-red-800', code == '' && 'border-zinc-900')}/>

            <header className={clsx('absolute border-t-2 overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 p-5', code == 'success' && 'bg-green-800 border-green-900', code == 'alreadyScanned' && 'bg-yellow-800 border-yellow-900', code == 'noTicket' && 'bg-red-800 border-red-900', code == '' && 'bg-zinc-900 border-zinc-950')}>
                <section className='flex w-full justify-around'>
                    {
                        hasFlash?            
                            <button className='' onClick={toggleFlash}>
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
                            <button className='' onClick={toggleCamera} disabled={switchingCameras}>
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={code == ''? '#999999': '#ffffff'} className='w-6 h-6'>
                                    <path fillRule='evenodd' d='M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z' clipRule='evenodd' />
                                </svg>
                            </button>:
                        <></>
                    }

                    <button>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={code == ''? '#999999': '#ffffff'} className='w-6 h-6'>
                            <path fillRule='evenodd' d='M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z' clipRule='evenodd' />
                        </svg>
                    </button>
                </section>
                    
                <section className='w-full h-full'>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', code == 'success'? 'fade-in': 'fade-out')}>Success</h1>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', code == 'noTicket'? 'fade-in': 'fade-out')}>Geen ticket</h1>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', code == 'alreadyScanned'? 'fade-in': 'fade-out')}>Al gescand</h1>
                    <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-zinc-400 logo text-7xl', code == ''? 'fade-in': 'fade-out')}>glow</h1>
                </section>
            </header>
        </main>
    );
}