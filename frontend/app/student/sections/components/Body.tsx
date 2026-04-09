import { Search, ChevronRight } from 'lucide-react';

type Section = {
  code: string;
  name: string;
  sessions: number;
};

type SectionsBodyProps = {
  sections?: Section[];
};

export default function SectionsBody({
  sections = [
    { code: 'DSA2016', name: 'Data Structure Algorithms', sessions: 5 },
    { code: 'CAL2016', name: 'Calculus 1', sessions: 8 },
    { code: 'CAL2012', name: 'Calculus 1', sessions: 8 },
     { code: 'CAL2016232323', name: 'Calculus 1', sessions: 8 },
  ],
}: SectionsBodyProps) {
  return (
    <main className="flex-1 px-6 pt-6">
      <h1 className="mb-8 text-[34px] font-extrabold text-[#0F8A9D]">
        Sections
      </h1>

      {/* Search bar */}
      <div className="mb-9">
        <div className="flex items-center justify-between rounded-2xl border border-[#C9C9C9] bg-[#F6F4F4] px-4 py-3">
          <span className="text-[18px] text-[#B9B9B9]">Search sections...</span>
          <Search size={24} className="text-[#222222]" strokeWidth={2.2} />
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-7 overflow-y-scroll max-h-125">
        {sections.map((section) => (
          <div
            key={section.code}
            className="flex items-center justify-between rounded-2xl bg-[#0F8A9D] px-4 py-4"
          >
            <div className="flex min-w-0 items-center gap-6">
              <span className="whitespace-nowrap text-[18px] font-extrabold text-white">
                {section.code}
              </span>

              <div className="min-w-0">
                <p className="truncate text-[18px] font-bold text-white">
                  {section.name}
                </p>
                <p className="mt-1 text-right text-[13px] font-semibold text-white/75">
                  {section.sessions} sessions
                </p>
              </div>
            </div>

            <ChevronRight
              size={28}
              strokeWidth={2.8}
              className="ml-3 shrink-0 text-white"
            />
          </div>
        ))}
      </div>
    </main>
  );
}