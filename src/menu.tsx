import '@fontsource/proza-libre/600.css';
import { HistoryContext, ScanSessionContext, Ticket } from './wrapper';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

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
        <div className='bg-zinc-900 h-screen flex flex-col w-full overflow-x-hidden'>
            <main className='px-5 pt-10 flex-grow overflow-y-scroll'>
                <h1 className='text-center pb-5 text-white text-3xl font-bold select-none'>Scangeschiedenis</h1>
                <div className='text-center'>
                    {
                        historyContext.history.length > 0?
                            historyContext.history.map((ticket: Ticket, index: number) => (
                                <div key={index} className={clsx('py-5 border-zinc-800', (index >= (historyContext.history.length - 1))? 'border-0': 'border-b-2')}>
                                    <div className='text-white text-xl font-semibold mb-1'>
                                        {ticket.ownerName} - {ticket.code == 'alreadyScanned'? 'Ticket al gescand': ticket.code == 'success'? 'Correct ticket': '' }
                                    </div>
                                    <div className='text-zinc-200'>
                                        Type {ticket.ticketTypeId} | {ticket.ticketTypeName}
                                    </div>
                                    <div className='text-zinc-200'>
                                        {ticket.qr}
                                    </div>
                                    <div className='text-zinc-200'>
                                        {ticket.ownerEmail}
                                    </div>
                                    <div className='text-zinc-200'>
                                        {ticket.timestamp.toTimeString().split(' ')[0]}
                                    </div>
                                </div>
                            )):
                        
                        <div className='text-zinc-200 font-semibold text-center w-full'>Nog geen tickets gescand</div>
                    }
                </div>
            </main>
            <footer className='w-full p-5 items-center flex select-none'>
                <Link className='mr-5 rounded-full aspect-square text-white h-12 bg-zinc-800 aria-selected:bg-zinc-700 border-2 border-transparent' to='/scanner'>
                    <div className='flex items-center justify-center h-full'>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='#ffffff' className='w-5 h-5'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' />
                        </svg>
                    </div>
                </Link>
                <button onClick={logout} className='rounded-full font-semibold text-white w-full h-12 bg-red-900 aria-selected:bg-red-950 border-2 border-transparent no-blue-box'>
                    Ander event
                </button>
            </footer>
        </div>
    );
}