// app/sections/page.tsx

import Image from 'next/image';
import { FaUser } from "react-icons/fa";
import Pagination from "@/app/auth/sections/components/Pagination"
import Table_Components from '@/app/auth/sections/components/Table';
import SectionHeader from '@/app/auth/sections/components/SectionsHeader';

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

export default async function SectionsPage({ searchParams }: any) {
  const { page: rawPage } = await searchParams

  const page = Math.max(1, Number(rawPage) || 1)
  console.log(page)
  console.log("page raw:", searchParams.page)
  function getSections(page: number, limit = 5) {
    const start = (page - 1) * limit
    const end = start + limit

    return {
      items: mockSections.slice(start, end),
      totalPages: Math.ceil(mockSections.length / limit),
    }
  }

  const data = getSections(page, 7)

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
        {/*Section header*/}
        <SectionHeader />
        {/* Table */}
        <Table_Components data={data.items} />
        {/* Pagination (cập nhật màu nút active) */}
        <Pagination totalPages={data.totalPages} />
      </main>
    </div>
  );
}