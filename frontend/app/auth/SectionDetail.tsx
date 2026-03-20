'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiX } from "react-icons/fi";
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false,
  loading: () => <p className="text-gray-500">Generating QR...</p>,
});

// Mock data – replace with real API later
const mockSessions = [
  { id: 1, name: "Session 1", time: "April 1 2026 20:30-23", status: "Closed", qr: "Expired", checkin: "42/45" },
  { id: 3, name: "Session 3", time: "April 15 2026 20:32-10", status: "Closed", qr: "Expired", checkin: "44/45" },
  { id: 4, name: "Session 4", time: "April 22 2026 20:39-20", status: "Active", qr: "Generate QR", checkin: "44/45" },
];

export default function SectionDetailPage() {
  const { code } = useParams();
  const router = useRouter();
  const [sessions, setSessions] = useState(mockSessions);

  // Modal & QR state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300);

  const activeSession = sessions.find(s => s.id === selectedSessionId);

  // Countdown timer
  useEffect(() => {
    if (!isModalOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessions(prevSessions =>
            prevSessions.map(s =>
              s.id === selectedSessionId ? { ...s, qr: "Expired" } : s
            )
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isModalOpen, timeLeft, selectedSessionId]);

  const toggleStatus = (id: number) => {
    setSessions(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Active' ? 'Closed' : 'Active' }
          : item
      )
    );
  };

  const handleGenerateQR = (sessionId: number) => {
    // In real app → call your API to create attendance session
    const attendanceUrl = `${window.location.origin}/attend/${code}/${sessionId}?token=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setSelectedSessionId(sessionId);
    setQrValue(attendanceUrl);
    setTimeLeft(300);
    setIsModalOpen(true);

    // Optional: update UI
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId ? { ...s, qr: "Generated" } : s
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      <header className="bg-[#09637E] text-white p-4 flex justify-between">
        <div>
          <h1 className="text-xl font-bold">AttenLink</h1>
        </div>
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#09637E]">
          <FaUser size={18} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-black text-xl transition"
          >
            <FiArrowLeft />
          </button>

          <button
            className="bg-[#09637E] hover:bg-[#085a70] text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2"
          >
            + Create Section
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl  text-[#09637E]">Data Structure and Algorithms</h2>
            <p className="text-sm text-gray-600">Code: DSA2026</p>
            <p className="text-sm text-gray-600">Students Enrolled: 45</p>
          </div>

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
                  <tr key={s.id} className="hover:bg-[#7AB2B2]">
                    <td className="px-6 py-4 text-black">{s.id}</td>
                    <td className="px-6 py-4 font-medium text-black">{s.name}</td>
                    <td className="px-6 py-4 text-black">{s.time}</td>
                    <td className="px-6 py-4 text-black">
                      <span
                        onClick={() => toggleStatus(s.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          s.status === 'Active'
                            ? 'bg-green-300 text-green-800 hover:bg-green-400'
                            : 'bg-red-300 text-red-800 hover:bg-red-400'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black">
                      {s.qr === 'Generate QR' ? (
                        <button
                          onClick={() => handleGenerateQR(s.id)}
                          className="text-[#09637E] hover:underline font-medium"
                        >
                          Generate QR
                        </button>
                      ) : (
                        s.qr
                      )}
                    </td>
                    <td className="px-6 py-4 text-black">{s.checkin}</td>
                    <td className="px-6 py-4">
                      <button className="text-[#088395] hover:underline">View Attendance</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* QR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <FiX size={24} />
            </button>

            <h3 className="text-lg font-bold text-center mb-2 text-black">
              Scan this QR Code to attend
            </h3>

            {activeSession && (
              <p className="text-center text-sm text-gray-600 mb-4">
                {activeSession.name} • Code: {code}
              </p>
            )}

            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white border-8 border-gray-200 rounded-xl">
                <QRCode
                  value={qrValue}
                  size={220}
                  level="Q"
                  fgColor="#09637E"   // quay lại màu chính của app
                />
              </div>
            </div>

            <div className="text-center text-sm font-medium text-red-600">
              Expires in: {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}