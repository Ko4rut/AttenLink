'use client';

import { Camera } from 'lucide-react';

type FooterProps = {
  onScanQR: () => void;
};

export default function Footer({ onScanQR }: FooterProps) {
  return (
    <footer className="border-t border-[#A8A8A8] px-8 py-7">
      <button
        onClick={onScanQR}
        className="flex w-full items-center justify-center gap-6 rounded-2xl bg-[#0F8A9D] py-4"
      >
        <Camera size={34} strokeWidth={2.2} className="text-white" />
        <span className="text-[32px] font-extrabold text-white">
          Scan QR
        </span>
      </button>
    </footer>
  );
}