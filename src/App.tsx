import './App.css';
import Scanner from './scanner.tsx';

export default function App() {

    const onNewScanResult = (decodedText: string, decodedResult: string) => {
        // handle decoded results here
    };

    return (
        <div className="App">
            <Scanner
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />
        </div>
    );
}
