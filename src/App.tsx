import { QrReader } from 'react-qr-reader';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase.ts';
import '@fontsource/proza-libre/600.css';

const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false}});

export default function App() {

    const handleScan = async (result: any) => {
        if (result) {
            const test = await supabase.rpc('scanTicket', {'eventIdArg': 'minimaxi2024', 'secretCodeArg': result.text});

            console.log('tset')
            console.log(test)
        }
    }

    return (
        <div className='overflow-hidden h-screen bg-zinc-950 absolute top-0 w-screen'>
            <main className='absolute -top-48 w-full h-full'>
                <QrReader onResult={handleScan} constraints={{facingMode: 'environment'}} className='w-full'/>
            </main>

            <aside className='fixed z-50 w-full h-1/4 bg-zinc-900 bg-opacity-95 bottom-0 flex justify-center items-center p-5'>
                <h1 className='text-zinc-400 logo text-7xl'>glow</h1>
            </aside>
        </div>
    );
}
