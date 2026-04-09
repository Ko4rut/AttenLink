'use client'
import Header from '@/app/student/sections/components/Header';
import Body from '@/app/student/sections/components/Body';
import Footer from '@/app/student/sections/components/Footer';
import { useRouter } from 'next/navigation';

export default function SectionPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    router.push('/');
  };

  const handleJoinSection = async (code: string) => {
    // call api join section
  };


  return (
    <div className="min-h-screen bg-[#D9E0E3] flex justify-between flex-col">
      <Header onLogout={handleLogout} />
      <Body />
      <Footer />
    </div>
  );
}