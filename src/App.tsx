import { QrReader } from 'react-qr-reader';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase.ts';
import '@fontsource/proza-libre/600.css';
import { useState } from 'react';
import clsx from 'clsx';

const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false}});

export default function App() {

    let active = true;
    const [result, setResult] = useState<string>('');

    const handleScan = async (result: any) => {
        if (result && active) {
            active = false;
            
            const scanTicketRPC = await supabase.rpc('scanTicket', {'eventIdArg': 'minimaxi2024', 'secretCodeArg': result.text});
            
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
        <div className='overflow-hidden h-screen bg-zinc-950 absolute top-0 w-screen'>
            <main className='absolute -top-44 w-full h-full'>
                <QrReader onResult={handleScan} constraints={{facingMode: 'environment'}} className='w-full'/>
            </main>

            <aside className={clsx('fixed overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 flex items-center p-5', result == 'success' && 'bg-green-800', result == 'alreadyScanned' && 'bg-yellow-800', result == 'noTicket' && 'bg-red-800', result == '' && 'bg-zinc-900')}>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'success'? 'fade-in': 'fade-out')}>Success</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'noTicket'? 'fade-in': 'fade-out')}>Geen ticket</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-white font-sans font-bold text-7xl', result == 'alreadyScanned'? 'fade-in': 'fade-out')}>Al gescand</h1>
                <h1 className={clsx('absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center text-zinc-400 logo text-7xl', result == ''? 'fade-in': 'fade-out')}>glow</h1>
            </aside>
        </div>
    );
}
