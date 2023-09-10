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
    let qrScanner: QrScanner | null = null;
    let viewFinder: HTMLVideoElement | null = null;
    let overlay: HTMLDivElement | null = null;

    let active = true;
    const [result, setResult] = useState<string>(''); 

    useEffect(() => {
        viewFinder = document.getElementById('viewFinder') as HTMLVideoElement;
        overlay = document.getElementById('overlay') as HTMLDivElement;

        qrScanner = new QrScanner(
            viewFinder,
            result => { handleScan(result); },
            { maxScansPerSecond: 1, preferredCamera: 'environment', calculateScanRegion: calculateScanRegion, highlightScanRegion: true, overlay: overlay},
        );

        qrScanner.start();
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

    return (
        <main className='overflow-hidden h-screen bg-zinc-950 absolute top-0 w-screen select-none'>
            <video id='viewFinder' className='object-cover w-full h-[100dvh]'/>

            <div id='overlay' className='border-[8px] border-zinc-900 broder-solid rounded-md border-opacity-95' />

            <section className={clsx('fixed border-t-2 overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 flex items-center p-5 rounded-md', result == 'success' && 'bg-green-800 border-green-900', result == 'alreadyScanned' && 'bg-yellow-800 border-yellow-900', result == 'noTicket' && 'bg-red-800 border-red-900', result == '' && 'bg-zinc-900 border-zinc-950')}>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'success'? 'fade-in': 'fade-out')}>Success</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'noTicket'? 'fade-in': 'fade-out')}>Geen ticket</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'alreadyScanned'? 'fade-in': 'fade-out')}>Al gescand</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-zinc-400 logo text-7xl', result == ''? 'fade-in': 'fade-out')}>glow</h1>
            </section>
        </main>
    );
}
