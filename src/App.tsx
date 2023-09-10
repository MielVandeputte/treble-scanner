import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase.ts';
import '@fontsource/proza-libre/600.css';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import QrScanner from 'qr-scanner';

const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false}});

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

    const [result, setResult] = useState<string>(''); 

    useEffect(() => {
        viewFinder = document.getElementById('viewFinder') as HTMLVideoElement;
        overlay = document.getElementById('overlay') as HTMLDivElement;

        const qrScanner = new QrScanner(
            viewFinder,
            result => { handleScan(result); },
            { maxScansPerSecond: 1, preferredCamera: 'environment', calculateScanRegion: calculateScanRegion, highlightScanRegion: true, overlay: overlay},
        );

        setQrScanner(qrScanner);
        qrScanner.start().then(()=>{ qrScanner.hasFlash().then((result) => {setHasFlash(result)}); });
        

    }, []);
    
    const handleScan = async (result: QrScanner.ScanResult) => {
        if (result && result.data && active) {
            active = false;
            console.log(result)

            const scanTicketRPC = await supabase.rpc('scanTicket', {'eventIdArg': 'minimaxi2024', 'secretCodeArg': result.data});
                
            if (scanTicketRPC.data) {
                setResult(scanTicketRPC.data);

                setTimeout(() => {
                    setResult('');
                    active = true;
                }, 5000);
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
            }
        }
        func();
    }

    return (
        <main className='overflow-hidden h-screen bg-zinc-950 absolute top-0 w-screen select-none'>
            <video id='viewFinder' className='object-cover w-full h-[100dvh]'/>

            <div id='overlay' className={clsx('border-[8px] border-solid rounded-md border-opacity-90 transition duration-200', result == 'success' && 'border-green-800', result == 'alreadyScanned' && 'border-yellow-800', result == 'noTicket' && 'border-red-800', result == '' && 'border-zinc-900')}/>

            <button className='absolute top-5' onClick={toggleFlash}>
                {
                    qrScanner && hasFlash?
                        (qrScanner as QrScanner).isFlashOn()?
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                                <path fill-rule='evenodd' d='M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z' clip-rule='evenodd' />
                            </svg>:

                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                                <path d='M20.798 11.012l-3.188 3.416L9.462 6.28l4.24-4.542a.75.75 0 011.272.71L12.982 9.75h7.268a.75.75 0 01.548 1.262zM3.202 12.988L6.39 9.572l8.148 8.148-4.24 4.542a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262zM3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18z' />
                            </svg>:
                        <></>
                }
            </button>

            <section className={clsx('fixed border-t-2 overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 flex items-center p-5', result == 'success' && 'bg-green-800 border-green-900', result == 'alreadyScanned' && 'bg-yellow-800 border-yellow-900', result == 'noTicket' && 'bg-red-800 border-red-900', result == '' && 'bg-zinc-900 border-zinc-950')}>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'success'? 'fade-in': 'fade-out')}>Success</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'noTicket'? 'fade-in': 'fade-out')}>Geen ticket</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'alreadyScanned'? 'fade-in': 'fade-out')}>Al gescand</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-zinc-400 logo text-7xl', result == ''? 'fade-in': 'fade-out')}>glow</h1>
            </section>
        </main>
    );
}
