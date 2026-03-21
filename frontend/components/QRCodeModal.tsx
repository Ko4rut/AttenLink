'use client';

import { FiX } from "react-icons/fi";
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false,
});

type Props = {
  sessionId: number;
  sectionCode: string;
  onClose: () => void;
};

export default function QRCodeModal({ sessionId, sectionCode, onClose }: Props) {

  const qrValue = `${window.location.origin}/attend/${sectionCode}/${sessionId}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[350px] relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3"
        >
          <FiX size={20} />
        </button>

        <h3 className="text-center font-bold mb-4">
          Scan QR to attend
        </h3>

        <div className="flex justify-center">
          <QRCode value={qrValue} size={200} />
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          Session: {sessionId}
        </p>
      </div>
    </div>
  );
}