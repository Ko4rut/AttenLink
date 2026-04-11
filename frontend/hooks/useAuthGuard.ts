'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuthGuard(redirectTo = '/student/login') {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!accessToken || !userId) {
      router.replace(redirectTo);
      return;
    }

    setAuthorized(true);
  }, [router, redirectTo]);

  return authorized;
}