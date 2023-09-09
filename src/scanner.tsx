// @ts-nocheck

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';

export default function Scanner(props) {
    useEffect(() => {
        const html5QrCode = new Html5Qrcode('reader', true);
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            console.log('success')
        };

        const config = { fps: 30, qrbox: { width: 250, height: 250 }};

        html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback);

    }, []);

    return (
        <div id='reader' className='w-full' />
    );
}