import { Plus } from 'lucide-react';

type SectionsFooterProps = {
  onOpenJoinModal: () => void;
};

export default function SectionsFooter({
  onOpenJoinModal,
}: SectionsFooterProps) {
  return (
    <footer className="border-t border-[#A8A8A8] px-8 py-7">
      <button
        onClick={onOpenJoinModal}
        className="flex w-full items-center justify-center gap-5 rounded-2xl bg-[#0F8A9D] py-4"
      >
        <Plus size={42} strokeWidth={2.5} className="text-white" />
        <span className="text-[32px] font-extrabold text-white">
          Join sections
        </span>
      </button>
    </footer>
  );
}