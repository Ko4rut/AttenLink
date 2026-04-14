'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/app/auth/sections/components/Pagination';
import Table_Components from '@/app/auth/sections/components/Table';
import SectionHeader from '@/app/auth/sections/components/SectionsHeader';
import {
  getSectionsByTeacher,
  updateSection,
  deleteSection,
  type Section,
} from '@/services/section.api';
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

  async function handleDeleteSection(section: Section) {
    try {
      const teacherUserId = localStorage.getItem('user_id');

      if (!teacherUserId) {
        throw new Error('Teacher user id not found');
      }

      await deleteSection(section.SectionID, teacherUserId);

      setSections((prev) =>
        prev.filter((item) => item.SectionID !== section.SectionID)
      );

      alert('Delete section successfully');
    } catch (error) {
      console.error('Delete section failed:', error);
      alert('Delete section failed');
    }
  }

  async function handleEditSection(
    section: Section,
    values: { name: string; description: string }
  ) {
    try {
      const teacherUserId = localStorage.getItem('user_id');

      if (!teacherUserId) {
        throw new Error('Teacher user id not found');
      }

      await updateSection(section.SectionID, teacherUserId, {
        name: values.name,
        description: values.description,
      });

      setSections((prev) =>
        prev.map((item) =>
          item.SectionID === section.SectionID
            ? {
              ...item,
              name: values.name,
              description: values.description,
            }
            : item
        )
      );

      alert('Update section successfully');
    } catch (error) {
      console.error('Edit section failed:', error);
      alert('Edit section failed');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader />
        <Table_Components
          data={sections}
          onDeleteSection={handleDeleteSection}
          onEditSection={handleEditSection}
        />
        <Pagination totalPages={totalPages} />
      </main>
    </div>
  );
}