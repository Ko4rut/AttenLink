'use client';

import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type ScanQrBodyProps = {
    onScanSuccess?: (decodedText: string) => void;
};

export default function Body({ onScanSuccess }: ScanQrBodyProps) {
    const [scannerVisible, setScannerVisible] = useState(true);
    const [scanResult, setScanResult] = useState<string | null>(null);

    useEffect(() => {
        if (!scannerVisible) return;

        const html5QrCode = new Html5Qrcode('reader');
        let mounted = true;

        const startScanner = async () => {
            try {
                // Ưu tiên mở camera sau trước
                try {
                    await html5QrCode.start(
                        { facingMode: 'environment' },
                        {
                            fps: 10,
                            qrbox: { width: 220, height: 220 },
                            aspectRatio: 1,
                        },
                        async (decodedText) => {
                            if (!mounted) return;

                            setScanResult(decodedText);
                            onScanSuccess?.(decodedText);

                            try {
                                await html5QrCode.stop();
                            } catch { }

                            setScannerVisible(false);
                        },
                        () => { }
                    );

                    return;
                } catch {
                    // nếu facingMode không chạy được thì fallback xuống dưới
                }

                const cameras = await Html5Qrcode.getCameras();

                if (!cameras || cameras.length === 0) {
                    alert('Không tìm thấy camera. Hãy kiểm tra quyền truy cập.');
                    return;
                }

                let backCameraId: string | undefined;

                for (const cam of cameras) {
                    const label = cam.label.toLowerCase();
                    if (
                        label.includes('back') ||
                        label.includes('rear') ||
                        label.includes('environment')
                    ) {
                        backCameraId = cam.id;
                        break;
                    }
                }

                const cameraId = backCameraId || cameras[cameras.length - 1].id;

                await html5QrCode.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: { width: 220, height: 220 },
                        aspectRatio: 1,
                    },
                    async (decodedText) => {
                        if (!mounted) return;

                        setScanResult(decodedText);
                        onScanSuccess?.(decodedText);

                        try {
                            await html5QrCode.stop();
                        } catch { }

                        setScannerVisible(false);
                    },
                    () => { }
                );
            } catch (err) {
                console.error('Lỗi khởi động camera:', err);
                alert(
                    'Không mở được camera. Kiểm tra quyền camera, HTTPS, hoặc trình duyệt hỗ trợ.'
                );
            }
        };

        startScanner();

        return () => {
            mounted = false;

            (async () => {
                try {
                    await html5QrCode.stop();
                } catch { }

                try {
                    html5QrCode.clear();
                } catch { }
            })();
        };
    }, [scannerVisible, onScanSuccess]);

    return (
        <main className="flex-1 bg-[#DCE3E6] px-6 pt-14">
            <h1 className="mb-10 text-center text-[32px] font-extrabold text-black">
                Scan the QR here
            </h1>

            <div className="mx-auto w-full max-w-[320px] bg-[#EDEDED] p-5">
                <div className="relative overflow-hidden rounded-2xl bg-black">
                    {scannerVisible && (
                        <>
                            <div id="reader" className="w-full" />

                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute left-6 top-6 h-10 w-10 border-l-[6px] border-t-[6px] border-white" />
                                <div className="absolute right-6 top-6 h-10 w-10 border-r-[6px] border-t-[6px] border-white" />
                                <div className="absolute bottom-6 left-6 h-10 w-10 border-b-[6px] border-l-[6px] border-white" />
                                <div className="absolute bottom-6 right-6 h-10 w-10 border-b-[6px] border-r-[6px] border-white" />
                            </div>
                        </>
                    )}

                    {!scannerVisible && (
                        <div className="flex min-h-105 items-center justify-center bg-[#222] px-6 text-center">
                            <div>
                                <p className="text-lg font-bold text-white">Scan completed</p>
                                {scanResult && (
                                    <p className="mt-3 break-all text-sm text-white/80">
                                        {scanResult}
                                    </p>
                                )}

                                <button
                                    onClick={() => {
                                        setScanResult(null);
                                        setScannerVisible(true);
                                    }}
                                    className="mt-6 rounded-xl bg-[#0F8A9D] px-5 py-3 text-white"
                                >
                                    Scan again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}