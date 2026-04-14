type SessionItem = {
  id: string;
  title: string;
  date: string;
  checkIn: string;
  status: string;
};

type SectionBodyProps = {
  sectionName: string;
  code: string;
  attendance: string;
  sessions: SessionItem[];
};

function getStatusClass(status: string) {
  if (status === 'Present') {
    return 'bg-green-100 text-green-800';
  }

  if (status === 'Absent') {
    return 'bg-red-100 text-red-800';
  }

  return 'bg-yellow-100 text-yellow-800';
}

export default function Body({
  sectionName,
  code,
  attendance,
  sessions,
}: SectionBodyProps) {
  return (
    <main className="px-6 pb-8">
      <h2 className="text-[30px] font-extrabold text-[#0F8A9D]">
        {sectionName}
      </h2>

      <div className="mt-4 space-y-2 text-[18px] text-black">
        <p>
          <span>Sections code: </span>
          <span className="font-normal">{code}</span>
        </p>
        <p>
          <span>Attendance: </span>
          <span className="font-normal">{attendance}</span>
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {sessions.length === 0 ? (
          <div className="rounded-2xl bg-[#F6F4F4] px-6 py-8 text-center">
            <p className="text-[18px] font-bold text-[#0F8A9D]">
              No sessions have been organized yet
            </p>
            <p className="mt-2 text-[14px] text-[#7A7A7A]">
              Please wait for your teacher to create a session.
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            return (
              <div
                key={session.id}
                className="flex overflow-hidden rounded-2xl bg-[#F6F4F4]"
              >
                <div className="flex min-h-22 w-27.5 items-start bg-[#0F8A9D] px-4 py-3">
                  <span className="text-[22px] font-bold text-white">
                    {session.title}
                  </span>
                </div>

                <div className="flex flex-1 items-start justify-between px-4 py-3">
                  <div>
                    <p className="text-[16px] font-bold text-black">
                      {session.date}
                    </p>
                    <p className="mt-1 text-[12px] text-[#B8B8B8]">
                      Check-in: {session.checkIn}
                    </p>
                  </div>

                  <div
                    className={`min-w-27.5 rounded-lg px-3 py-1 text-center text-[14px] font-bold ${getStatusClass(
                      session.status
                    )}`}
                  >
                    {session.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}