import { QrReader } from 'react-qr-reader';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase.ts';

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
        <div className='h-screen overflow-hidden bg-zinc-950'>
            <QrReader onResult={handleScan} constraints={ {facingMode: 'environment' } } className='p-2 max-h-screen' />
        </div>
    );
}
