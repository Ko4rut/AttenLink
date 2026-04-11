'use client';

import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useAuthGuard from '@/hooks/useAuthGuard';


export default function SectionsPage() {
  const router = useRouter();
  const authorized = useAuthGuard('/');

  if (!authorized) return null;
  // const [sections, setSections] = useState<Section[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#09637E] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AttenLink</h1>

        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600">
          <FaUser />
        </div>
      </header>

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