'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/student/sections/components/SectionHeader';
import Body from '@/app/student/sections/components/SectionBody';
import Footer from '@/app/student/sections/components/SectionFooter';
import JoinSectionModal from '@/app/student/sections/components/JoinSectionModal';

export default function SectionPage() {
  const router = useRouter();
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    router.push('/');
  };

  const handleJoinSection = async (code: string) => {
    try {
      setLoading(true);

      // call api join section
      console.log('section code:', code);

      setOpenJoinModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D9E0E3] flex flex-col justify-between">
      <Header onLogout={handleLogout} />
      <Body />
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