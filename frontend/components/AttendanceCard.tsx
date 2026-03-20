// components/AttendanceCard.tsx
type Session = {
  name: string;
  date: string;
  checkin: string;
  status: 'Attended' | 'Absent';
};

export default function AttendanceCard({ session }: { session: Session }) {
  const isAttended = session.status === 'Attended';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h3 className="font-semibold text-lg">{session.name}</h3>
          <p className="text-gray-600 text-sm mt-0.5">{session.date}</p>
          <p className="text-sm text-gray-500 mt-1">
            Check-in: <span className="font-medium">{session.checkin}</span>
          </p>
        </div>

        <span
          className={`
            px-4 py-1.5 rounded-full text-sm font-medium border
            ${isAttended 
              ? 'bg-green-100 text-green-700 border-green-300' 
              : 'bg-red-100 text-red-700 border-red-300'}
          `}
        >
          {session.status}
        </span>
      </div>
    </div>
  );
}