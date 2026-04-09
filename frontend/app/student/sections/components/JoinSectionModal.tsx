'use client';

import { useEffect, useState } from 'react';

type JoinSectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void | Promise<void>;
  loading?: boolean;
};

export default function JoinSectionModal({
  open,
  onClose,
  onSubmit,
  loading = false,
}: JoinSectionModalProps) {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!open) setCode('');
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    await onSubmit(code.trim());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-75 overflow-hidden bg-white shadow-xl">
        <div className="bg-[#0F8A9D] py-3 text-center">
          <h2 className="text-[20px] font-bold text-white">Enter section code</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-9 py-7">
          <input
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-10.5 w-full rounded-xl border-2 border-[#D1D1D1] px-4 text-[16px] outline-none placeholder:text-[#B0B0B0] focus:border-[#0F8A9D]"
          />

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="min-w-19.5 rounded-lg bg-[#0F8A9D] px-4 py-2 text-[16px] text-white disabled:opacity-50"
            >
              {loading ? '...' : 'Enter'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-w-19.5 rounded-lg bg-[#0F8A9D] px-4 py-2 text-[16px] text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}