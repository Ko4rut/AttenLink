import { ChevronRight } from 'lucide-react';

type SectionCardProps = {
  code: string;
  name: string;
  sessions: number;
};

export default function SectionCard({
  code,
  name,
  sessions,
}: SectionCardProps) {
  return (
    <div className="bg-[#0F8A9D] rounded-2xl px-4 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6 min-w-0">
        <span className="text-white font-extrabold text-xl whitespace-nowrap">
          {code}
        </span>

        <div className="min-w-0">
          <p className="text-white font-bold text-xl truncate">{name}</p>
          <p className="text-white/80 text-sm text-right mt-1">
            {sessions} sessions
          </p>
        </div>
      </div>

      <ChevronRight
        className="text-white shrink-0 ml-3"
        size={28}
        strokeWidth={2.5}
      />
    </div>
  );
}