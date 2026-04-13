'use client';

import { Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { StudentSectionItem } from '@/services/section.api';

type SectionsBodyProps = {
  sections?: StudentSectionItem[];
  loading?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export default function SectionsBody({
  sections = [],
  loading = false,
  searchValue,
  onSearchChange,
}: SectionsBodyProps) {
  const router = useRouter();

  return (
    <main className="flex-1 px-6 pt-6">
      <h1 className="mb-8 text-[34px] font-extrabold text-[#0F8A9D]">
        Sections
      </h1>

      <div className="mb-9">
        <div className="flex items-center justify-between rounded-2xl border border-[#C9C9C9] bg-[#F6F4F4] px-4 py-3">
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sections..."
            className="w-full bg-transparent text-[18px] outline-none placeholder:text-[#B9B9B9]"
          />
          <Search size={24} className="text-[#222222]" strokeWidth={2.2} />
        </div>
      </div>

      <div className="space-y-7 overflow-y-scroll max-h-125">
        {loading ? (
          <p className="text-center text-[18px] font-semibold text-[#0F8A9D]">
            Loading sections...
          </p>
        ) : sections.length === 0 ? (
          <p className="text-center text-[18px] font-semibold text-[#0F8A9D]">
            No sections joined yet
          </p>
        ) : (
          sections.map((section) => (
            <div
              key={section.SectionID}
              onClick={() => router.push(`/student/sections/${section.code}`)}
              className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#0F8A9D] px-4 py-4"
            >
              <div className="flex min-w-0 w-full items-center gap-6">
                <span className="whitespace-nowrap text-[18px] font-bold text-white">
                  {section.code}
                </span>

                <div className="min-w-0 w-full">
                  <p className="truncate text-[18px] font-bold text-white">
                    {section.name}
                  </p>
                  <p className="mt-1 text-right text-[13px] font-semibold text-white/75">
                    {section.sessionsCount} sessions
                  </p>
                </div>
              </div>

              <ChevronRight
                size={28}
                strokeWidth={2.8}
                className="ml-3 shrink-0 text-white"
              />
            </div>
          ))
        )}
      </div>
    </main>
  );
}