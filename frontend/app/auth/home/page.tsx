// app/sections/page.tsx
'use client';
import { FaUser } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Assume you have an API or context for auth/user data

export default function SectionsPage() {
  const [sections, setSections] = useState([]); // e.g. [{ id: 1, name: 'Math 101 - A', students: 28, attendance: '92%' }, ...]
  const router = useRouter();
  // Fetch sections on mount (replace with your auth/fetch logic)
  useEffect(() => {
    // Example: fetch('/api/sections').then(res => res.json()).then(setSections);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-[#09637E] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AttenLink</h1>

        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600">
          <FaUser />
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8">

        {sections.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((sec: any) => (
              <div
                key={sec.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{sec.name}</h3>
                    <p className="text-sm text-gray-600">{sec.subject || 'Subject'}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {sec.students} students • Attendance: {sec.attendance}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}