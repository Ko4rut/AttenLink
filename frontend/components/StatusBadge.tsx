// components/StatusBadge.tsx
export default function StatusBadge({ status }: { status: 'Attended' | 'Absent' }) {
  const styles = {
    Attended: 'bg-green-100 text-green-700 border-green-300',
    Absent: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <span
      className={`
        px-4 py-1.5 rounded-full text-sm font-medium border
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}