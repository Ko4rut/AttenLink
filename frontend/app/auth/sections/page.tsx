// app/sections/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaUser } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiX } from "react-icons/fi";

// Mock data
const mockSections = [
  { code: 'DSA2026', name: 'Data Structures and Algorithms', enrolled: 45, totalSessions: 5 },
  { code: 'DSA2026', name: 'Technical Programming', enrolled: 45, totalSessions: 4 },
  { code: 'CAL2026', name: 'Calculus 1', enrolled: 45, totalSessions: 7 },
  { code: 'DIP2026', name: 'Digital Image Processing', enrolled: 45, totalSessions: 4 },
  { code: 'DAA2026', name: 'Design Analysis Algorithms', enrolled: 45, totalSessions: 10 },
  { code: 'MLB2026', name: 'Machine Learning Basic', enrolled: 45, totalSessions: 5 },
  { code: 'NLP2026', name: 'Natural Language Processing', enrolled: 45, totalSessions: 5 },
];

export default function SectionsPage() {
  const [sections] = useState(mockSections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });

  const router = useRouter();
  // const user = { image: '/path/to/your-avatar.jpg' }; // → thay bằng real user sau

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API để tạo section mới
    console.log('Creating section:', formData);
    // Sau khi tạo thành công → đóng modal + refresh danh sách
    setIsModalOpen(false);
    // setFormData({ code: '', name: '', description: '' }); // reset nếu cần
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-[#09637E] text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">AttenLink</h1>
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#09637E] shadow-sm">
          <FaUser size={18} />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <button
            onClick={() => router.push('/auth/home')}
            className="flex items-center gap-2 text-gray-700 hover:text-black text-xl transition"
          >
            <FiArrowLeft />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#09637E] hover:bg-[#085a70] text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            + Create Section
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#09637E] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Student Enrolled</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Total Sessions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sections.map((section, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-teal-50' : 'bg-white'} hover:bg-[#7AB2B2]/30 transition-colors cursor-pointer`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{section.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{section.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{section.enrolled}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{section.totalSessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (cập nhật màu nút active) */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
          <div>
            {/* Showing 1 to 10 of 68 results (có thể động sau) */}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              ← Previous
            </button>
            <nav className="hidden md:flex gap-1">
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-black text-white hover:bg-[#085a70]">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
              <span className="px-2 py-2">...</span>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">67</button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">68</button>
            </nav>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Next →
            </button>
          </div>
        </div>
      </main>

      {/* Modal Create Section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#09637E] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create a new Section</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter section code"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09637E] focus:border-[#09637E]"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09637E] focus:border-[#09637E]"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description (optional)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09637E] focus:border-[#09637E]"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-[#09637E] hover:bg-[#085a70] text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm"
                >
                  + Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}