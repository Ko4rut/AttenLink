'use client';

import { FaUser } from 'react-icons/fa';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import SessionInfo from './components/SessionInfo';
import AttendanceTable, {
  type AttendanceStatus,
  type AttendanceTableItem,
} from './components/AttendanceTable';
import {
  attendanceApi,
  mapAttendanceRecordToRow,
  type AttendanceRow,
  type SessionAttendanceResponse,
} from '@/services/attendance.api';


import { useRouter } from "next/navigation";
import Header from '@/components/Header';


function formatSessionDate(time?: string) {
  if (!time) return '—';

  const date = new Date(time);

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DemoPage() {
  const { code, sessionId } = useParams<{ code: string; sessionId: string }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [sessionData, setSessionData] =
    useState<SessionAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    try {
      if (!sessionId) return;
      setExporting(true);
      setError(null);

      await attendanceApi.exportSessionAttendanceExcel(sessionId);
    } catch (err) {
      console.error(err);
      setError("Failed to export attendance file.");
    } finally {
      setExporting(false);
    }
  };
  const fetchAttendance = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await attendanceApi.getSessionAttendance(sessionId);
      setSessionData(data);

      const mappedRows = data.records.map((item, index) =>
        mapAttendanceRecordToRow(item, index)
      );

      setRecords(mappedRows);
    } catch (err) {
      console.error(err);
      setError('Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const filteredRecords = useMemo(() => {
    return records.filter(
      (item) =>
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentCode.includes(searchTerm)
    );
  }, [records, searchTerm]);

  const present = records.filter((s) => s.status === 'Present').length;
  const absent = records.filter((s) => s.status === 'Absent').length;
  const late = records.filter((s) => s.status === 'Late').length;
  const router = useRouter();
  // const handleExportExcel = async () => {
  //   try {
  //     if (!sessionId) return;
  //     await attendanceApi.exportSessionAttendanceExcel(sessionId);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to export attendance file.");
  //   }
  // };

  const handleStatusChange = async (
    recordId: string,
    nextStatus: AttendanceStatus
  ) => {
    const currentRecord = records.find((item) => item.id === recordId);
    if (!currentRecord) return;
    if (currentRecord.status === nextStatus) return;

    const previousStatus = currentRecord.status;

    setRecords((prev) =>
      prev.map((item) =>
        item.id === recordId ? { ...item, status: nextStatus } : item
      )
    );

    try {
      setUpdating(true);
      setError(null);

      await attendanceApi.updateAttendanceManual({
        AttendanceRecordID: currentRecord.attendanceRecordID,
        studentUserID: currentRecord.studentUserID,
        SessionID: currentRecord.sessionID,
        status: nextStatus,
      });

      await fetchAttendance();
    } catch (err) {
      console.error(err);

      setRecords((prev) =>
        prev.map((item) =>
          item.id === recordId ? { ...item, status: previousStatus } : item
        )
      );

      setError('Failed to update attendance status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow-sm">
      <Header/>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading attendance...</div>
      ) : error ? (
        <div className="p-10 text-center text-red-500">{error}</div>
      ) : (
        <>
          <SessionInfo
            sessionName={sessionData?.session.Name ?? "Session"}
            sectionName="Data Structure Algorithm"
            code={code ?? ""}
            dateText={formatSessionDate(sessionData?.session.Time)}
            present={present}
            absent={absent}
            late={late}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onExportExcel={handleExportExcel}
            onBack={() => router.back()}
            exporting={exporting}
          />

          <AttendanceTable
            records={filteredRecords}
            onStatusChange={handleStatusChange}
          />
        </>
      )}

      {updating && (
        <div className="px-6 py-3 text-sm text-gray-500">
          Updating attendance...
        </div>
      )}
    </div>
  );
}