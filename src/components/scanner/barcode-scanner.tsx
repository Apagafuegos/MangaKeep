'use client'

import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { useEffect, useRef } from 'react'

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void
    onScanFailure?: (error: unknown) => void
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    useEffect(() => {
        // Initialize scanner
        // ID must match the div below
        const scannerId = "reader"

        // Prevent double init
        if (!scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                scannerId,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 150 },
                    aspectRatio: 1.0,
                    showTorchButtonIfSupported: true,
                    rememberLastUsedCamera: true,
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
                },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    onScanSuccess(decodedText)
                    // Optional: Pause or clear if we only want one scan
                    // scanner.clear(); 
                },
                () => {
                    // console.log("Scan error");
                }
            );

            scannerRef.current = scanner
        }

        // Cleanup
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error(err));
                scannerRef.current = null;
            }
        }
    }, [onScanSuccess])

    return (
        <div className="w-full">
            <div id="reader" className="w-full overflow-hidden rounded-lg bg-black/5"></div>
            <p className="text-center text-xs text-muted-foreground mt-2">Point camera at ISBN barcode</p>
        </div>
    )
}
