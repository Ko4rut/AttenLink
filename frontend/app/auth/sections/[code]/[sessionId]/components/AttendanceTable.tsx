'use client';

import { useEffect, useRef, useState } from 'react';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export type AttendanceTableItem = {
  id: string;
  studentCode: string;
  fullName: string;
  status: AttendanceStatus;
  checkInTime: string;
};

type AttendanceTableProps = {
  records: AttendanceTableItem[];
  onStatusChange?: (recordId: string, nextStatus: AttendanceStatus) => void;
};

const STATUS_OPTIONS: AttendanceStatus[] = ['Present', 'Absent', 'Late'];

function getStatusBadgeClass(status: AttendanceStatus) {
  if (status === 'Present') {
    return 'bg-green-100 text-green-800';
  }

  if (status === 'Absent') {
    return 'bg-red-100 text-red-800';
  }

  return 'bg-yellow-100 text-yellow-800';
}

export default function AttendanceTable({
  records,
  onStatusChange,
}: AttendanceTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6" ref={containerRef}>
      <div className="h-84.5 overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#088395]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Student&apos;s Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Student&apos;s Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Time Check-in
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {records.map((record, index) => (
              <tr key={record.id} className="hover:bg-[#f0f7f7]">
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {record.studentCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{record.fullName}</td>

                <td className="relative px-6 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId((prev) => (prev === record.id ? null : record.id))
                    }
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </button>

                  {openMenuId === record.id && (
                    <div className="absolute left-6 top-12 z-20 min-w-30 rounded-lg border bg-white py-1 shadow-lg">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            onStatusChange?.(record.id, option);
                            setOpenMenuId(null);
                          }}
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                            option === record.status ? 'font-semibold text-[#09637E]' : 'text-gray-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">{record.checkInTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {records.length === 0 && (
        <p className="py-8 text-center text-gray-500">No students found.</p>
      )}
    </div>
  );
}