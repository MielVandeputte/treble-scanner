import Scanner from './scanner.tsx';

export default function App() {

    const onNewScanResult = (_decodedText: string, _decodedResult: string) => {
        // handle decoded results here
    };

    return (
        <div>
            <Scanner
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />
        </div>
    );
}
