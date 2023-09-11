import '@fontsource/proza-libre/600.css';
import { HistoryContext, ScanSessionContext, Ticket } from './wrapper';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Menu() {
    const historyContext = useContext(HistoryContext);
    const scanSessionContext = useContext(ScanSessionContext);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (scanSessionContext.scanSession == null) { navigate('/'); }
    }, []);

    const logout = () => {
        historyContext.clearHistory();
        scanSessionContext.setScanSession(null);
        navigate('/');
    }

    return (
        <div className='bg-zinc-950 h-screen w-full'>
            <main className='px-5 pt-5'>
                <h1 className='text-center pb-5 text-white text-3xl font-bold'>Scangeschiedenis</h1>
                {
                    historyContext.history.length > 0?
                        historyContext.history.map((ticket: Ticket) => (
                            <div className='text-white'>
                                {ticket.qr}
                            </div>
                        )):
                    
                    <div className='text-zinc-200 text-xl font-semibold text-center w-full'>Nog geen tickets gescand</div>
                }
            </main>
            <footer className='absolute bottom-0 w-full p-5 items-center flex'>
                <Link className='mr-5 rounded-full aspect-square text-white h-20 bg-zinc-800 aria-selected:bg-zinc-700 border-2 border-transparent' to='/scanner'>
                    <div className='flex items-center justify-center h-full'>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='#ffffff' className='w-6 h-6'>
                            <path stroke-linecap='round' stroke-linejoin='round' d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' />
                        </svg>
                    </div>
                </Link>
                <button onClick={logout} className='rounded-full font-semibold text-white text-xl w-full h-20 bg-red-900 aria-selected:bg-red-950 border-2 border-transparent'>
                    Ander event
                </button>
            </footer>
        </div>
    );
}