'use client';

import { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import Pagination from "@/app/auth/sections/components/Pagination";
import Table_Components from '@/app/auth/sections/components/Table';
import SectionHeader from '@/app/auth/sections/components/SectionsHeader';
import { getSectionsByTeacher, type Section } from '@/services/section.api';
import Header from '@/components/Header';

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const teacherUserId = localStorage.getItem('user_id');

        if (!teacherUserId) {
          throw new Error('Teacher user id not found');
        }

        const data = await getSectionsByTeacher(teacherUserId, 1, 7);

        console.log(data);
        setSections(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
        setSections([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader />
        <Table_Components data={sections} />
        <Pagination totalPages={totalPages} />
      </main>
    </div>
  );
}