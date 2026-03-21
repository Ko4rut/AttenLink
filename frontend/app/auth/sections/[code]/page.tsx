'use client';

import { useParams } from 'next/navigation';
import { FaUser } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from "react-icons/fi";
import { useState } from 'react';
import QRCodeModal from '@/components/QRCodeModal';

type Session = {
  id: number;
  name: string;
  time: string;
  status: "Active" | "Closed";
  qr: string;
  checkin: string;
};
// Mock data (chỉ để render UI)
const mockSessions: Session[] = [
  { id: 1, name: "Session 1", time: "April 1 2026 20:30-23", status: "Closed", qr: "Expired", checkin: "42/45" },
  { id: 3, name: "Session 3", time: "April 15 2026 20:32-10", status: "Closed", qr: "Expired", checkin: "44/45" },
  { id: 4, name: "Session 4", time: "April 22 2026 20:39-20", status: "Active", qr: "Generate QR", checkin: "44/45" },
];


export default function SectionDetailPage() {
  const { code } = useParams();
  const router = useRouter();
  const [sessions, setSessions] = useState(mockSessions)
  const [openQR, setOpenQR] = useState(false)
  const [selectedSession, setSelectedSession] = useState<number | null>(null)


  function toggle_status(sessionId: number) {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
            ...session,
            status: session.status === "Active" ? "Closed" : "Active"
          }
          : session
      )
    )
  }


  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      {/* Header */}
      <header className="bg-[#09637E] text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">AttenLink</h1>
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#09637E]">
          <FaUser size={18} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">

          {/* Back button */}
          <button
            onClick={() => router.push('/auth/sections')}
            className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-black text-xl transition"
          >
            <FiArrowLeft />
          </button>

          {/* Create button */}
          <button
            className="bg-[#09637E] hover:bg-[#085a70] text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            + Create Section
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl text-[#09637E]">Data Structure and Algorithms</h2>
            <p className="text-sm text-gray-600">Code: {code}</p>
            <p className="text-sm text-gray-600">Students Enrolled: 45</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#088395]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-3 text-left">Session</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">QR</th>
                  <th className="px-6 py-3 text-left">Check-in</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#d1e3e3]">
                    <td className="px-6 py-4 text-black">{s.id}</td>
                    <td className="px-6 py-4 font-medium text-black">{s.name}</td>
                    <td className="px-6 py-4 text-black">{s.time}</td>

                    <td className="px-6 py-4 text-black">
                      <span
                        onClick={() => toggle_status(s.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${s.status === 'Active'
                          ? 'bg-green-300 text-green-800'
                          : 'bg-red-300 text-red-800'
                          }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td
                      onClick={() => {
                        setSelectedSession(s.id)
                        setOpenQR(true)
                      }}
                      className="text-[#09637E] cursor-pointer hover:underline"
                    >
                      Generate QR
                    </td>

                    <td className="px-6 py-4 text-black">
                      {s.checkin}
                    </td>

                    <td className="px-6 py-4">
                      <button className="text-[#088395] cursor-pointer hover:underline">
                        View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </main>
      {
        openQR && selectedSession && (
          <QRCodeModal
            sessionId={selectedSession}
            sectionCode={code as string}
            createdAt={new Date()}
            onClose={() => setOpenQR(false)}
          />
        )
      }
    </div>
  );
}