// app/sections/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaUser } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiX } from "react-icons/fi";
import { useSearchParams } from "next/navigation"
import Pagination from "@/components/Pagination"
import CreateSectionModal from "@/components/Section/CreateSectionModal"

// Mock data
const mockSections = [
  { code: 'DSA2026', name: 'Data Structures and Algorithms', enrolled: 42, totalSessions: 12 },
  { code: 'TPR2026', name: 'Technical Programming', enrolled: 38, totalSessions: 10 },
  { code: 'CAL2026', name: 'Calculus 1', enrolled: 55, totalSessions: 14 },
  { code: 'DIP2026', name: 'Digital Image Processing', enrolled: 29, totalSessions: 9 },
  { code: 'DAA2026', name: 'Design and Analysis of Algorithms', enrolled: 47, totalSessions: 11 },
  { code: 'MLB2026', name: 'Machine Learning Basics', enrolled: 36, totalSessions: 10 },
  { code: 'NLP2026', name: 'Natural Language Processing', enrolled: 33, totalSessions: 8 },

  { code: 'OSY2026', name: 'Operating Systems', enrolled: 50, totalSessions: 13 },
  { code: 'DBS2026', name: 'Database Systems', enrolled: 44, totalSessions: 12 },
  { code: 'CNP2026', name: 'Computer Networks', enrolled: 41, totalSessions: 11 },
  { code: 'SE2026', name: 'Software Engineering', enrolled: 39, totalSessions: 10 },
  { code: 'AI2026', name: 'Introduction to Artificial Intelligence', enrolled: 46, totalSessions: 12 },
  { code: 'DS2026', name: 'Data Science Fundamentals', enrolled: 34, totalSessions: 9 },
  { code: 'CS2026', name: 'Cyber Security Basics', enrolled: 28, totalSessions: 8 },

  { code: 'HCI2026', name: 'Human Computer Interaction', enrolled: 31, totalSessions: 7 },
  { code: 'CGA2026', name: 'Computer Graphics', enrolled: 27, totalSessions: 8 },
  { code: 'IOT2026', name: 'Internet of Things', enrolled: 35, totalSessions: 9 },
  { code: 'BIG2026', name: 'Big Data Analytics', enrolled: 40, totalSessions: 11 },
  { code: 'CLD2026', name: 'Cloud Computing', enrolled: 37, totalSessions: 10 },
  { code: 'MOB2026', name: 'Mobile Application Development', enrolled: 43, totalSessions: 10 },
  { code: 'WEB2026', name: 'Web Development', enrolled: 48, totalSessions: 12 },

  // thêm mới
  { code: 'ALG2026', name: 'Advanced Algorithms', enrolled: 45, totalSessions: 12 },
  { code: 'STA2026', name: 'Statistics for Computing', enrolled: 52, totalSessions: 13 },
  { code: 'LIN2026', name: 'Linear Algebra', enrolled: 49, totalSessions: 12 },
  { code: 'PHY2026', name: 'Physics for Engineers', enrolled: 53, totalSessions: 14 },
  { code: 'CHE2026', name: 'Chemistry Basics', enrolled: 30, totalSessions: 10 },
  { code: 'ENG2026', name: 'English for IT', enrolled: 60, totalSessions: 15 },
  { code: 'PRJ2026', name: 'Capstone Project', enrolled: 25, totalSessions: 16 },

  { code: 'DEV2026', name: 'DevOps Fundamentals', enrolled: 41, totalSessions: 11 },
  { code: 'UXD2026', name: 'UX/UI Design', enrolled: 33, totalSessions: 9 },
  { code: 'BLK2026', name: 'Blockchain Basics', enrolled: 29, totalSessions: 8 },
  { code: 'ARV2026', name: 'AR/VR Development', enrolled: 22, totalSessions: 7 },
  { code: 'GAM2026', name: 'Game Development', enrolled: 38, totalSessions: 10 },
  { code: 'AUT2026', name: 'Automation Testing', enrolled: 36, totalSessions: 9 },
  { code: 'MAN2026', name: 'IT Project Management', enrolled: 44, totalSessions: 11 },

  { code: 'FIN2026', name: 'Financial Technology', enrolled: 27, totalSessions: 8 },
  { code: 'ECO2026', name: 'Economics for Engineers', enrolled: 48, totalSessions: 12 },
  { code: 'LAW2026', name: 'IT Law and Ethics', enrolled: 35, totalSessions: 9 },
  { code: 'RES2026', name: 'Research Methods', enrolled: 32, totalSessions: 8 },
  { code: 'SYS2026', name: 'System Analysis and Design', enrolled: 46, totalSessions: 11 },
  { code: 'EMB2026', name: 'Embedded Systems', enrolled: 31, totalSessions: 9 },
   { code: 'DSA2026', name: 'Data Structures and Algorithms', enrolled: 42, totalSessions: 12 },
  { code: 'TPR2026', name: 'Technical Programming', enrolled: 38, totalSessions: 10 },
  { code: 'CAL2026', name: 'Calculus 1', enrolled: 55, totalSessions: 14 },
  { code: 'DIP2026', name: 'Digital Image Processing', enrolled: 29, totalSessions: 9 },
  { code: 'DAA2026', name: 'Design and Analysis of Algorithms', enrolled: 47, totalSessions: 11 },
  { code: 'MLB2026', name: 'Machine Learning Basics', enrolled: 36, totalSessions: 10 },
  { code: 'NLP2026', name: 'Natural Language Processing', enrolled: 33, totalSessions: 8 },

  { code: 'OSY2026', name: 'Operating Systems', enrolled: 50, totalSessions: 13 },
  { code: 'DBS2026', name: 'Database Systems', enrolled: 44, totalSessions: 12 },
  { code: 'CNP2026', name: 'Computer Networks', enrolled: 41, totalSessions: 11 },
  { code: 'SE2026', name: 'Software Engineering', enrolled: 39, totalSessions: 10 },
  { code: 'AI2026', name: 'Introduction to Artificial Intelligence', enrolled: 46, totalSessions: 12 },
  { code: 'DS2026', name: 'Data Science Fundamentals', enrolled: 34, totalSessions: 9 },
  { code: 'CS2026', name: 'Cyber Security Basics', enrolled: 28, totalSessions: 8 },

  { code: 'HCI2026', name: 'Human Computer Interaction', enrolled: 31, totalSessions: 7 },
  { code: 'CGA2026', name: 'Computer Graphics', enrolled: 27, totalSessions: 8 },
  { code: 'IOT2026', name: 'Internet of Things', enrolled: 35, totalSessions: 9 },
  { code: 'BIG2026', name: 'Big Data Analytics', enrolled: 40, totalSessions: 11 },
  { code: 'CLD2026', name: 'Cloud Computing', enrolled: 37, totalSessions: 10 },
  { code: 'MOB2026', name: 'Mobile Application Development', enrolled: 43, totalSessions: 10 },
  { code: 'WEB2026', name: 'Web Development', enrolled: 48, totalSessions: 12 },

  // thêm mới
  { code: 'ALG2026', name: 'Advanced Algorithms', enrolled: 45, totalSessions: 12 },
  { code: 'STA2026', name: 'Statistics for Computing', enrolled: 52, totalSessions: 13 },
  { code: 'LIN2026', name: 'Linear Algebra', enrolled: 49, totalSessions: 12 },
  { code: 'PHY2026', name: 'Physics for Engineers', enrolled: 53, totalSessions: 14 },
  { code: 'CHE2026', name: 'Chemistry Basics', enrolled: 30, totalSessions: 10 },
  { code: 'ENG2026', name: 'English for IT', enrolled: 60, totalSessions: 15 },
  { code: 'PRJ2026', name: 'Capstone Project', enrolled: 25, totalSessions: 16 },

  { code: 'DEV2026', name: 'DevOps Fundamentals', enrolled: 41, totalSessions: 11 },
  { code: 'UXD2026', name: 'UX/UI Design', enrolled: 33, totalSessions: 9 },
  { code: 'BLK2026', name: 'Blockchain Basics', enrolled: 29, totalSessions: 8 },
  { code: 'ARV2026', name: 'AR/VR Development', enrolled: 22, totalSessions: 7 },
  { code: 'GAM2026', name: 'Game Development', enrolled: 38, totalSessions: 10 },
  { code: 'AUT2026', name: 'Automation Testing', enrolled: 36, totalSessions: 9 },
  { code: 'MAN2026', name: 'IT Project Management', enrolled: 44, totalSessions: 11 },

  { code: 'FIN2026', name: 'Financial Technology', enrolled: 27, totalSessions: 8 },
  { code: 'ECO2026', name: 'Economics for Engineers', enrolled: 48, totalSessions: 12 },
  { code: 'LAW2026', name: 'IT Law and Ethics', enrolled: 35, totalSessions: 9 },
  { code: 'RES2026', name: 'Research Methods', enrolled: 32, totalSessions: 8 },
  { code: 'SYS2026', name: 'System Analysis and Design', enrolled: 46, totalSessions: 11 },
  { code: 'EMB2026', name: 'Embedded Systems', enrolled: 31, totalSessions: 9 },
]

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
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);


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


  // =============== Xử lý phân trang


  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1

  function getSections(page: number, limit = 5) {
    const start = (page - 1) * limit
    const end = start + limit

    return {
      items: mockSections.slice(start, end),
      totalPages: Math.ceil(mockSections.length / limit),
    }
  }
  const data = getSections(page, 7) // mỗi page 10 dòng
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
            className="flex items-center gap-2 cu text-gray-700 hover:text-black cursor-pointer text-xl transition"
          >
            <FiArrowLeft />
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#09637E] hover:bg-[#085a70] cursor-pointer text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            + Create Section
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto h-106 rounded-lg border border-gray-200 shadow-sm">
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
              {data.items.map((section, index) => (
                <tr
                  key={index}
                  className="bg-teal-50 hover:bg-[#7AB2B2]/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/auth/sections/${section.code}`)}
                >
                  <td className="px-6 py-4 h-13 whitespace-nowrap text-sm font-medium text-gray-900">
                    {section.code}
                  </td>
                  <td className="px-6 py-4 h-13  whitespace-nowrap text-sm text-gray-700">
                    {section.name}
                  </td>
                  <td className="px-6 py-4 h-13 whitespace-nowrap text-sm text-gray-700">
                    {section.enrolled}
                  </td>
                  <td className="px-6 py-4 h-13 whitespace-nowrap text-sm text-gray-700">
                    {section.totalSessions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (cập nhật màu nút active) */}
        <Pagination totalPages={data.totalPages} />
      </main>

      {/* Modal Create Section */}
      <CreateSectionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}