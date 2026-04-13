'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

export default function AuthHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleGoHome = () => {
    router.push('/auth/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');

    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-[#09637E] p-4 text-white shadow-md">
      <button
        type="button"
        onClick={handleGoHome}
        className="text-xl font-bold transition hover:opacity-90"
      >
        AttenLink
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#09637E] shadow-sm transition hover:opacity-90"
        >
          <FaUser size={18} />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 min-w-35 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}