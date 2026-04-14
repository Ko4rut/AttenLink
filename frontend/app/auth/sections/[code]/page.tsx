'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { QRCodeModal, type CurrentQRCode } from '@/components/QRCodeModal';
import Link from 'next/link';
import { sessionApi, type SessionItem } from '@/services/session.api';
import { qrCodeApi } from "@/services/qrcode.api";
import axios from 'axios';
import Header from '@/components/Header';

export default function SectionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sectionId = params.code as string;
  const rawCode = searchParams.get('code') ?? '';
  const [code, namePart] = rawCode.split('?name=');

  const name = searchParams.get('name') ?? namePart ?? '';
  const nameValue = searchParams.get('name')?.split('=')[1] ?? '';
  // console.log('Section Detail Page - code:', code, 'sectionId:', sectionId);
  const router = useRouter();

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [SelectedSessionId, setSelectedSessionId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQRCode, setCurrentQRCode] = useState<CurrentQRCode | null>(null);

  async function fetchSessions() {
    try {
      setLoading(true);
      const data = await sessionApi.getSessionsBySection(sectionId);
      console.log('Fetched sessions:', data);
      setSessions(data);
    } catch (error) {
      console.error('Fetch sessions failed:', error);
      alert('Không tải được danh sách session');
    } finally {
      setLoading(false);
    }
  }
  const handleRefresh = async (sessionId: string) => {
    try {
      await qrCodeApi.generate(sessionId);
      const currentQR = await qrCodeApi.getCurrent(sessionId);
      setCurrentQRCode(currentQR);
      console.log('Refreshed QR code:', currentQR);
    } catch (error) {
      console.error(error);
    }
  };

  const displayCurrentCode = async (sessionId: string) => {
    try {
      setSelectedSessionId(sessionId);
      setCurrentQRCode(null);
      setOpenQR(true);

      const currentQR = await qrCodeApi.getCurrent(sessionId);
      setCurrentQRCode(currentQR);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCurrentQRCode(null);
        return;
      }

      console.error('Get current QR failed:', error);
      alert('Không tải được QR code hiện tại');
    }
  };

  useEffect(() => {
    if (sectionId) fetchSessions();

  }, [sectionId]);
  const studentsEnrolled = sessions?.[0]?.checkin?.split('/')?.[1] ?? 0;
  async function create_session() {
    const ok = confirm('Bạn có chắc muốn thêm một session không?');
    if (!ok) return;

    try {
      setCreating(true);
      await sessionApi.createSession(sectionId, {
        Name: `Session ${sessions.length + 1}`,
        Time: new Date().toISOString(),
      });
      await fetchSessions();
    } catch (error) {
      console.error('Create session failed:', error);
      alert('Tạo session thất bại');
    } finally {
      setCreating(false);
    }
  }
  // console.log('Rendering SectionDetailPage with sessions:', sessions);
  return (
    <div className="min-h-screen bg-[#EBF4F6]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <button
            onClick={() => router.push('/auth/sections')}
            className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-black text-xl transition"
          >
            <FiArrowLeft />
          </button>

          <button
            className="bg-[#09637E] hover:bg-[#085a70] text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md flex items-center gap-2 disabled:opacity-60"
            onClick={create_session}
            disabled={creating}
          >
            {creating ? 'Creating...' : '+ Create Session'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl text-[#09637E]">{name}</h2>
            <p className="text-sm text-gray-600">Code: {code}</p>
            <p className="text-sm text-gray-600">Students Enrolled: {studentsEnrolled}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#088395] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-3 text-left">Session</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  {/* <th className="px-6 py-3 text-left">Status</th> */}
                  <th className="px-6 py-3 text-left">QR</th>
                  <th className="px-6 py-3 text-left">Check-in</th>
                  <th className="px-6 py-3 text-left">Attendances</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading sessions...
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  [...sessions].reverse().map((s, index) => (
                    <tr key={s.id} className="hover:bg-[#d1e3e3]">
                      <td className="px-6 py-4 text-black">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-black">{s.name}</td>
                      <td className="px-6 py-4 text-black">{s.time}</td>
                      <td
                        onClick={() => {
                          setSelectedSession(s.name);
                          setOpenQR(true);
                          setSessionId(s.id);
                          displayCurrentCode(s.id)
                        }}
                        className="px-6 py-4 text-[#09637E] cursor-pointer hover:underline"
                      >
                        Details QR
                      </td>

                      <td className="px-6 py-4 text-black">{s.checkin}</td>

                      <td className="px-6 py-4">
                        <Link
                          className="text-[#088395] cursor-pointer hover:underline"
                          href={`/auth/sections/${code}/${s.id}`}
                        >
                          View Attendance
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {openQR && selectedSession && (
        <QRCodeModal
          sessionId={String(selectedSession)}
          sectionCode={code}
          currentQRCode={currentQRCode}
          onClose={() => setOpenQR(false)}
          handleRefresh={() => handleRefresh(String(sessionId))}
        />
      )}
    </div>
  );
}