'use client';

import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useAuthGuard from '@/hooks/useAuthGuard';
import Header from '@/components/Header';

export default function SectionsPage() {
  const router = useRouter();
  const authorized = useAuthGuard('/');

  if (!authorized) return null;
  // const [sections, setSections] = useState<Section[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto mt-8">

        <div className="flex flex-col items-center justify-center py-32">
          <img
            src="/img/image.png"
            alt="Sections"
            className="w-54 cursor-pointer hover:scale-105 transition mb-4"
            onClick={() => router.push('/auth/sections')}
          />

          <p className="text-xl font-semibold text-gray-700 cursor-pointer">
            Sections
          </p>
        </div>
      </main>
    </div>
  );
}