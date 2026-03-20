// app/sections/page.tsx  (or wherever your page is)
'use client'; // ← important: we need client-side interactivity

import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';

export default function SectionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionCode, setSectionCode] = useState('');

  const sections = [
    {
      code: 'DSA2016',
      name: 'Data Structure Algorithms',
      count: 5,
    },
    {
      code: 'CAL2016',
      name: 'Calculus 1',
      count: 8,
    },
  ];

  const handleJoin = () => {
    // TODO: call your API here with sectionCode
    console.log('Joining section:', sectionCode.trim());
    
    // Reset & close (you can change logic later)
    setSectionCode('');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSectionCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#088395] border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 relative flex items-center justify-center">
          <button className="absolute left-4 p-2 hover:bg-[#09637E] rounded-full transition-colors">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <img src="/img/paper-plane.png" alt="logo" className="w-7 h-7" />
            <h1 className="text-xl font-semibold text-white">AttenLink</h1>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-[#088395] mb-4">Sections</h2>

        {/* Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search sections..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#088395] focus:border-[#088395] text-black"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        </div>

        {/* Section Cards */}
        <div className="space-y-4">
          {sections.map((section) => (
            <button
              key={section.code}
              className="w-full bg-[#088395] rounded-xl p-5 text-left transition-all hover:shadow-lg hover:scale-[1.01] group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-white group-hover:text-gray-100">
                    {section.code}
                  </h2>
                  <p className="text-gray-100 mt-0.5">{section.name}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-100">
                  <span className="text-sm font-medium">{section.count} sessions</span>
                  <svg
                    className="w-5 h-5 group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Floating Join Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#088395] text-white px-33 py-4 rounded-full shadow-xl hover:bg-[#09637E] active:bg-[#074C66] transition-all font-medium text-lg"
        >
          <Plus size={24} />
          Join sections
        </button>
      </div>

      {/* ────────────────────────────────────────
          JOIN MODAL
      ──────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#088395] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Enter section code</h3>
              <button
                onClick={handleCancel}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
            <input
              type="text"
              value={sectionCode}
              onChange={(e) => setSectionCode(e.target.value.toUpperCase())}
              placeholder="e.g. DSA2016"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#088395] focus:border-[#088395] 
                        text-lg text-black"
              autoFocus
            />


              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!sectionCode.trim()}
                  className="flex-1 py-3 bg-[#088395] text-white font-medium rounded-lg hover:bg-[#09637E] active:bg-[#074C66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}