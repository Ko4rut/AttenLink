'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect } from 'react';
import SessionHeader from '../[sessionId]/components/SessionHeader'


type AttendanceRecord = {
  id: number;
  studentCode: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
  timeCheckIn: string;
};



// Mock data – replace with real API fetch later
const mockAttendance: AttendanceRecord[] = [
  { id: 1, studentCode: "312345678", studentName: "Nguyen Van A", status: "Present", timeCheckIn: "—" },
  { id: 2, studentCode: "312345679", studentName: "Nguyen Thi B", status: "Present", timeCheckIn: "April 8 2026 20:35:20" },
  { id: 3, studentCode: "312345680", studentName: "Tran Van C", status: "Present", timeCheckIn: "April 8 2026 20:34:55" },
  { id: 4, studentCode: "312345681", studentName: "Le Thi D", status: "Late", timeCheckIn: "April 8 2026 20:48:12" },
  { id: 5, studentCode: "312345682", studentName: "Pham Van E", status: "Present", timeCheckIn: "April 8 2026 20:32:10" },
  // ... add more or fetch from API
  { id: 6, studentCode: "312345678", studentName: "Nguyen Van A", status: "Absent", timeCheckIn: "—" },
  { id: 7, studentCode: "312345679", studentName: "Nguyen Thi B", status: "Present", timeCheckIn: "April 8 2026 20:35:20" },
  { id: 8, studentCode: "312345680", studentName: "Tran Van C", status: "Present", timeCheckIn: "April 8 2026 20:34:55" },
  { id: 9, studentCode: "312345681", studentName: "Le Thi D", status: "Late", timeCheckIn: "April 8 2026 20:48:12" },
];

export default function SessionAttendancePage() {
  const { code } = useParams<{ code: string }>();
  const { sessionId } = useParams<{ sessionId: string }>();




  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');

  // You can compute these from real data
  const present = mockAttendance.filter(s => s.status === 'Present').length;
  const absent = mockAttendance.filter(s => s.status === 'Absent').length;
  const late = mockAttendance.filter(s => s.status === 'Late').length;

  const filteredAttendance = mockAttendance.filter(item =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentCode.includes(searchTerm)
  );

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);




  useEffect(() => {
    if (!isQRModalOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQRModalOpen]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      {/* Header */}
      <header className="bg-[#09637E] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AttenLink</h1>
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#09637E]">
          <FaUser size={18} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Back + Export */}
        <SessionHeader />

        {/* Session Info Card */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

              {/* LEFT */}
              <div>
                <h2 className="text-xl font-bold text-[#09637E]">
                  Session 1 Attendance
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Data Structure Algorithm - {code}
                </p>
                <p className="text-sm text-gray-600">
                  Date: April 1, 2025
                </p>

                <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-600">Present:</span> {present}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Absent:</span> {absent}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Late:</span> {late}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full sm:w-80 ">
                <input
                  type="text"
                  placeholder="Search student name or code..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#09637E] "
                />
              </div>
            </div>
          </div>


          {/* Table Section */}
          <div className="p-6">

            <div className="overflow-x-auto border h-84.5 rounded-lg">
              <table className="min-w-full max-h-10  divide-y divide-gray-200">
                <thead className="bg-[#088395]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">#</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Student's Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Student's Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Time Check-in</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y max-h-10 overflow-y-scroll  divide-gray-200">
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-[#f0f7f7]">
                      <td className="px-6 py-4 text-sm text-gray-900">{record.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.studentCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.studentName}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                              record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.timeCheckIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAttendance.length === 0 && (
              <p className="text-center text-gray-500 py-8">No students found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}