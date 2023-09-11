import '@fontsource/proza-libre/600.css';
import { ScanSessionContext } from './wrapper';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function Landing() {
    const scanSessionContext = useContext(ScanSessionContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (scanSessionContext.scanSession != null) { navigate('/scanner'); }
    }, []);

    const checkCode = () => {
        setLoading(true);

        fetch('https://www.glow-events.be/api/check-scan-authorization-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'eventId': 'minimaxi2024', 'scanAuthorizationCode': '952bf6c7edb188e66ae69e38af4f2b7b' })
        }).then(async (data) => {
            const result = await data.json();

            if (result.correct === true) {
                scanSessionContext.setScanSession({ eventId: 'minimaxi2024', scanAuthorizationCode: '952bf6c7edb188e66ae69e38af4f2b7b' });
                navigate('scanner');
            }

            setLoading(false);
        });
    }

    return (
        <div className='bg-zinc-900 w-screen h-screen flex justify-center items-center p-5 select-none'>            
            <main className='flex justify-center items-center'>
                <div className='flex flex-col items-center'>
                    <h1 className='text-center text-zinc-400 logo text-7xl'>glow</h1>

                    <div className='m-5'>
                        <label className='text-zinc-200 text-xl font-semibold'>
                            eventId
                        </label>

                        <label className='text-zinc-200 text-xl font-semibold'>
                            code
                        </label>
                    </div>

                    <button className={clsx(loading && 'bg-emerald-800 pointer-events-none animate-pulse', !loading && 'bg-zinc-800', 'm-5 border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-20 w-72 text-center font-semibold text-xl')} onClick={checkCode}>
                        Start
                    </button>

                </div>
            </main>
        </div>
    );
}