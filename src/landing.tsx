import '@fontsource/proza-libre/600.css';
import { ScanSessionContext } from './wrapper';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function Landing() {
    const scanSessionContext = useContext(ScanSessionContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (scanSessionContext.scanSession != null) { navigate('/scanner'); }
    }, []);

    const handleSubmit = (event: FormEvent) => {
        setLoading(true);
        event.preventDefault();

        const target = event.target as typeof event.target & {
            eventId: { value: string };
            eventscanAuthorizationCode: { value: string };
        };
        
        fetch('https://www.glow-events.be/api/check-scan-authorization-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'eventId': target.eventId.value, 'scanAuthorizationCode': target.eventscanAuthorizationCode.value })
        }).then(async (data) => {
            const result = await data.json();

            if (result.data === true) {
                scanSessionContext.setScanSession({ eventId: target.eventId.value, scanAuthorizationCode: target.eventscanAuthorizationCode.value });
                navigate('/scanner');
            }

            setLoading(false);
        });
    }

    //minimaxi2024
    //952bf6c7edb188e66ae69e38af4f2b7b

    return (
        <div className='bg-zinc-900 w-screen h-screen flex justify-center items-center p-5 select-none'>            
            <main className='flex justify-center items-center'>
                <div className='flex flex-col items-center'>
                    <h1 className='text-center text-white logo text-7xl'>glow</h1>

                    <p className='text-zinc-200 my-10 text-xl text-center max-w-[600px]'>
                        Voer de event-id en de geheime code in om te beginnen scannen.
                        Beide zijn te vinden in het dasboard op glow-events.be.
                    </p>

                    <form onSubmit={handleSubmit} className='w-full sm:px-16'>
                        <div className='flex items-center'>
                            <label className='text-zinc-200 text-xl font-semibold w-32'>
                                event-id
                            </label>
                            <input type='text' id='eventId' name='eventId' autoComplete='off' maxLength={50} required className='py-3 px-5 w-full text-zinc-200 rounded-full bg-zinc-800 text-xl'/>
                        </div>

                        <div className='flex items-center mt-5'>
                            <label className='text-zinc-200 text-xl font-semibold w-32'>
                                code
                            </label>
                            <input type='text' id='eventscanAuthorizationCode' name='eventscanAuthorizationCode' autoComplete='off' maxLength={50} required className='py-3 px-5 w-full text-zinc-200 rounded-full bg-zinc-800 text-xl'/>
                        </div>

                        <button type='submit' className={clsx(loading && 'active:outline-none pointer-events-none animate-pulse', 'bg-emerald-800 mt-10 border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-14 w-full text-center font-semibold text-xl')}>
                            Start
                        </button>
                    </form>

                </div>
            </main>
        </div>
    );
}