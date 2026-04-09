'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuthGuard(redirectTo = '/login') {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!accessToken || !userId) {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);
}