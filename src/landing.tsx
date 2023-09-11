import '@fontsource/proza-libre/600.css';
import { ScanSessionContext } from './wrapper';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const scanSessionContext = useContext(ScanSessionContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (scanSessionContext.scanSession != null) { navigate('scanner'); }
    }, []);

    const a = () => {

        scanSessionContext.setScanSession({ eventId: 'minimaxi2024', authorizationCode: '' });
        navigate('scanner');
    }

    return (
        <main className=''>
            hallo

            <button onClick={a}>
                hallohallo
            </button>
        </main>
    );
}