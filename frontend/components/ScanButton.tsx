// components/ScanButton.tsx
'use client';

export default function ScanButton() {
  const handleScan = () => {
    // You can integrate real QR scanner here later
    // For now: just alert or redirect
    alert('Open camera → Scan QR code');
    // Or: router.push('/scan')
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-5 z-10 pointer-events-none">
<button
  onClick={handleScan}
  className="
    flex items-center justify-center gap-3
    bg-teal-600 hover:bg-teal-700
    text-white font-semibold text-base
    px-6 py-3 rounded-xl shadow-lg
    active:scale-95 transition-all duration-150
  "
>
  <img
    src="img/camera.png"
    alt="camera"
    className="w-5 h-5 object-contain"
  />

  <span>Scan QR</span>
</button>

    </div>
  );
}