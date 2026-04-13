import { FiArrowLeft } from 'react-icons/fi';

type SessionInfoProps = {
  sessionName: string;
  sectionName: string;
  code: string;
  dateText: string;
  present: number;
  absent: number;
  late: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onExportExcel: () => void | Promise<void>;
  onBack: () => void;
  exporting?: boolean;
};

export default function SessionInfo({
  sessionName,
  sectionName,
  code,
  dateText,
  present,
  absent,
  late,
  searchTerm,
  setSearchTerm,
  onExportExcel,
  onBack,
  exporting = false,
}: SessionInfoProps) {
  return (
    <div className="border-b p-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center cursor-pointer gap-2 text-gray-700 hover:text-black text-xl transition"
      >
        <FiArrowLeft />
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#09637E]">
            {sessionName} Attendance
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {sectionName} - {code}
          </p>

          <p className="text-sm text-gray-600">Date: {dateText}</p>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-600">Present:</span>{" "}
              {present}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Absent:</span>{" "}
              {absent}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Late:</span> {late}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-80">
          <button
            type="button"
            onClick={onExportExcel}
            disabled={exporting}
            className="inline-flex items-center justify-center rounded-lg bg-[#09637E] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting ? "Exporting..." : "Export Excel"}
          </button>

          <input
            type="text"
            placeholder="Search student name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#09637E]"
          />
        </div>
      </div>
    </div>
  );
}