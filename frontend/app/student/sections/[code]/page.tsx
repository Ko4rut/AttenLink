'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/student/sections/components/SectionHeader';
import Body from '@/app/student/sections/[code]/components/SessionBody';
import Footer from '@/app/student/sections/[code]/components/SessionFooter';
import { studentSessionApi } from '@/services/student.session.api';

type SessionItem = {
  id: string;
  title: string;
  date: string;
  checkIn: string;
  status: 'Attended' | 'Absent';
};

type SectionDetailData = {
  sectionName: string;
  code: string;
  attendance: string;
  sessions: SessionItem[];
};

export default function SectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [sectionDetail, setSectionDetail] = useState<SectionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    router.push('/student/sections');
  };

  const handleScanQR = () => {
    router.push(`/student/sections/${code}/scanner`);
  };

  useEffect(() => {
    if (!code) return;

    const fetchSectionDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await studentSessionApi.getSectionDetailByCode(code);
        setSectionDetail(data);
      } catch (err: any) {
        console.error('Failed to fetch section detail:', err);
        setError(err?.response?.data?.detail || 'Failed to load section detail');
      } finally {
        setLoading(false);
      }
    };

    fetchSectionDetail();
  }, [code]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#DCE3E6]">
        <p className="text-lg font-semibold text-[#0F8A9D]">Loading...</p>
      </div>
    );
  }

  if (error || !sectionDetail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#DCE3E6] px-6 text-center">
        <p className="text-lg font-semibold text-red-600">
          {error || 'Section detail not found'}
        </p>
        <button
          onClick={() => router.push('/student/sections')}
          className="rounded-lg bg-[#0F8A9D] px-4 py-2 font-semibold text-white"
        >
          Back to sections
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#DCE3E6]">
      <Header onLogout={handleLogout} />
      <Body
        sectionName={sectionDetail.sectionName}
        code={sectionDetail.code}
        attendance={sectionDetail.attendance}
        sessions={sectionDetail.sessions}
      />
      <Footer onScanQR={handleScanQR} />
    </div>
  );
}