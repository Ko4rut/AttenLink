'use client';

import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

type Props = {
  open: boolean;
  initialData: {
    SectionID: string;
    code: string;
    name: string;
    enrolled: number;
    totalSessions: number;
    description?: string;
  } | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; description: string }) => void | Promise<void>;
};

export default function EditSectionModal({
  open,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name ?? '');
      setDescription(initialData.description ?? '');
    }
  }, [open, initialData]);

  if (!open || !initialData) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      alert('Name không được để trống');
      return;
    }

    await onSubmit({
      name: trimmedName,
      description: trimmedDescription,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-[#09637E]">Edit Section</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
          >
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Section Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-[#09637E]"
              placeholder="Enter section name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-[#09637E]"
              placeholder="Enter section description"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#09637E] px-4 py-2 font-medium text-white hover:bg-[#085a70] disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}