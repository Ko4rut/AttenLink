type AttendanceRecord = {
  id: number;
  studentCode: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
  timeCheckIn: string;
};

type SessionInfoProps = {
  mockAttendance: AttendanceRecord[];
  code: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function SessionInfo({
  mockAttendance,
  code,
  searchTerm,
  setSearchTerm,
}: SessionInfoProps) {
  const present = mockAttendance.filter(s => s.status === 'Present').length;
  const absent = mockAttendance.filter(s => s.status === 'Absent').length;
  const late = mockAttendance.filter(s => s.status === 'Late').length;

  return (
    <div className="p-6 border-b">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
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

        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search student name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#09637E]"
          />
        </div>
      </div>
    </div>
  );
}