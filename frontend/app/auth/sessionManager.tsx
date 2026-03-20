// app/page.tsx
import AttendanceCard from '@/components/AttendanceCard';
import ScanButton from '@/components/ScanButton';

export default function AttendancePage() {
  const course = {
    code: "DSA2026",
    name: "Data Structures & Algorithms",
    attendance: "1/2",
  };

const sessions = [
  {
    name: "Session 1",
    date: "April 1, 2024",
    checkin: "08:00",
    status: "Attended" as const,     // ← helps a lot
  },
  {
    name: "Session 2",
    date: "April 1, 2024",
    checkin: "18:00",
    status: "Absent" as const,
  },
] as const;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
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
        <div className="bg-white text-gray-900 px-5 pt-6 pb-8 rounded-t-3xl">
          <h2 className="text-xl font-bold">{course.name}</h2>
          <p className="text-gray-600 mt-1">
            Sections code: <strong>{course.code}</strong>
          </p>
          <p className="text-lg font-semibold mt-4">
            Attendance: <span className="text-teal-600">{course.attendance}</span>
          </p>
        </div>
     

      {/* Sessions */}
      <div className="px-5 pt-6 space-y-4">
        {sessions.map((session, i) => (
          <AttendanceCard key={i} session={session} />
        ))}
      </div>

      {/* Floating Scan Button */}
      <ScanButton />
    </div>
  );
}