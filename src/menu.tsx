import '@fontsource/proza-libre/600.css';
import { HistoryContext } from './app';
import { useContext } from 'react';

export default function Menu() {
    
    const historyContext = useContext(HistoryContext);

    console.log(historyContext)

    return (
        <main className=''>
            menu
        </main>
    );
}