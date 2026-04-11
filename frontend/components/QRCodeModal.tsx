'use client';

import { FiX, FiRefreshCw } from "react-icons/fi";
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from "react";

const QRCode = dynamic(
  () => import('qrcode.react').then(mod => mod.QRCodeSVG),
  {
    ssr: false,
    loading: () => <p>Loading QR...</p>
  }
);

export type CurrentQRCode = {
  QRTokenID: string;
  token: string;
  expireAt: string;
  isActive: boolean;
  createAt: string;
};

type Props = {
  sessionId: string;
  sectionCode: string;
  currentQRCode: CurrentQRCode | null;
  onClose: () => void;
  handleRefresh: () => void;
};

export function QRCodeModal({
  sessionId,
  sectionCode,
  currentQRCode,
  onClose,
  handleRefresh,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!currentQRCode?.expireAt || !currentQRCode?.isActive) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const expireTime = new Date(currentQRCode.expireAt).getTime();
      const diff = Math.max(0, Math.floor((expireTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentQRCode]);

  const qrValue = useMemo(() => {
    if (!currentQRCode?.token) return '';

    return `${window.location.origin}/attend/${sectionCode}/${sessionId}?token=${currentQRCode.token}`;
  }, [currentQRCode, sectionCode, sessionId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const hasQRCode =
    !!currentQRCode &&
    !!currentQRCode.token &&
    !!currentQRCode.expireAt &&
    currentQRCode.isActive;

  const isExpired = hasQRCode ? timeLeft <= 0 : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-87.5 rounded-xl bg-white p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer"
        >
          <FiX size={20} />
        </button>

        <h3 className="mb-4 text-center font-bold">
          Scan QR to attend
        </h3>

        {!hasQRCode ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              Chưa có QR code hiện tại
            </p>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-lg bg-[#0F8A9D] px-4 py-2 text-white hover:opacity-90"
              >
                <FiRefreshCw size={16} />
                Generate QR
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <QRCode value={qrValue} size={200} />
            </div>

            <p className="mt-4 break-all text-center text-sm text-gray-500">
              {currentQRCode.token}
            </p>

            <p className="mt-2 text-center text-xs text-gray-400">
              QRTokenID: {currentQRCode.QRTokenID}
            </p>

            <p className="mt-3 text-center text-red-500">
              {isExpired ? "Expired" : `Expires in: ${formatTime(timeLeft)}`}
            </p>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-lg bg-[#0F8A9D] px-4 py-2 text-white hover:opacity-90"
              >
                <FiRefreshCw size={16} />
                Refresh QR
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}