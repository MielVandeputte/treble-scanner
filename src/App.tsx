import Scanner from './scanner.tsx';

export default function App() {

    const onNewScanResult = (_decodedText: string, _decodedResult: string) => {
        // handle decoded results here
    };

    return (
        <div>
            <Scanner
                fps={30}
                qrbox={500}
                disableFlip={true}
                qrCodeSuccessCallback={onNewScanResult}
            />
        </div>
    );
}
