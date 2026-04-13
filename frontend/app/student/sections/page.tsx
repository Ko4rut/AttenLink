'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/student/sections/components/SectionHeader';
import Body from '@/app/student/sections/components/SectionBody';
import Footer from '@/app/student/sections/components/SectionFooter';
import JoinSectionModal from '@/app/student/sections/components/JoinSectionModal';
import { joinSection } from '@/services/enrollment.api';
import {
  getSectionsByStudent,
  type StudentSectionItem,
} from '@/services/section.api';

export default function SectionPage() {
  const router = useRouter();

  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<StudentSectionItem[]>([]);
  const [fetchingSections, setFetchingSections] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const filteredSections = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return sections;

    return sections.filter(
      (section) =>
        section.name.toLowerCase().includes(keyword) ||
        section.code.toLowerCase().includes(keyword)
    );
  }, [sections, searchValue]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    router.push('/student');
  };

  const fetchSections = async () => {
    try {
      setFetchingSections(true);

      const res = await getSectionsByStudent();
      setSections(res.data || []);
    } catch (error: any) {
      console.error('Get sections failed:', error);
      alert(error?.response?.data?.detail || 'Get sections failed');
    } finally {
      setFetchingSections(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleJoinSection = async (code: string) => {
    try {
      setLoading(true);

      const res = await joinSection({ code });

      alert(res.message || 'Join section successfully');
      setOpenJoinModal(false);
      await fetchSections();
    } catch (error: any) {
      const message = error?.response?.data?.detail || 'Join section failed';
      alert(message);
      console.error('Join section failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D9E0E3] flex flex-col justify-between">
      <Header onLogout={handleLogout} />

      <Body
        sections={filteredSections}
        loading={fetchingSections}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <Footer onOpenJoinModal={() => setOpenJoinModal(true)} />

      <JoinSectionModal
        open={openJoinModal}
        onClose={() => setOpenJoinModal(false)}
        onSubmit={handleJoinSection}
        loading={loading}
      />
    </div>
  );
}