'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditSectionModal from '@/app/auth/sections/components/EditSectionModal';

type Section = {
  SectionID: string;
  code: string;
  name: string;
  enrolled: number;
  totalSessions: number;
  description?: string;
};

type Props = {
  data: Section[];
  onDeleteSection: (section: Section) => void | Promise<void>;
  onEditSection: (
    section: Section,
    values: { name: string; description: string }
  ) => void | Promise<void>;
};

export default function Table_Components({
  data,
  onDeleteSection,
  onEditSection,
}: Props) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function handleRowClick(section: Section) {
    const query = new URLSearchParams({
      code: section.code,
      name: section.name,
      description: section.description ?? '',
    });

    router.push(`/auth/sections/${section.SectionID}?${query.toString()}`);
  }

  function handleContextMenu(
    e: React.MouseEvent<HTMLTableRowElement>,
    section: Section
  ) {
    e.preventDefault();

    setSelectedSection(section);
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setMenuOpen(true);
  }

  async function handleDeleteClick() {
    if (!selectedSection) return;

    setMenuOpen(false);

    const ok = window.confirm(`Do you want to delete section "${selectedSection.name}" ?`);
    if (!ok) return;

    await onDeleteSection(selectedSection);
  }

  async function handleEditSubmit(values: { name: string; description: string }) {
    if (!selectedSection) return;

    try {
      setEditing(true);
      await onEditSection(selectedSection, values);
      setEditOpen(false);
    } finally {
      setEditing(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto h-106 rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#09637E] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Student Enrolled
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Total Sessions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((items) => (
              <tr
                key={items.SectionID}
                onClick={() => handleRowClick(items)}
                onContextMenu={(e) => handleContextMenu(e, items)}
                className="cursor-pointer bg-white transition-colors hover:bg-[#7AB2B2]/30"
              >
                <td className="h-13 whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {items.code}
                </td>
                <td className="h-13 whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  {items.name}
                </td>
                <td className="h-13 whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  {items.enrolled}
                </td>
                <td className="h-13 whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                  {items.totalSessions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {menuOpen && selectedSection && (
        <div
          ref={menuRef}
          className="fixed z-50 w-56 overflow-hidden rounded-xl border bg-white shadow-lg"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              setEditOpen(true);
            }}
            className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit name & description
          </button>

          <button
            onClick={handleDeleteClick}
            className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}

      <EditSectionModal
        open={editOpen}
        initialData={selectedSection}
        loading={editing}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}