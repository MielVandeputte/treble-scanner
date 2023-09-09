import { QrReader } from "react-qr-reader";

export default function App() {

    const handleScan = (result: any) => {
        if (result) {
            console.log(result.text)
        }
    }


    return (
        <>
            <QrReader onResult={handleScan} constraints={ {facingMode: 'user'} }        
            />
        </>
    );
}
