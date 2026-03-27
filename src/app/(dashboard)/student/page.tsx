import Annoucements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const { userId } = await auth();

  const student = await prisma.student.findUnique({
    where: { id: userId! },
    include: {
      class: true,
    },
  });

  return (
    <div className="p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">
            Schedule ({student?.class?.name || "N/A"})
          </h1>

          {student?.classId ? (
            <BigCalendarContainer type="classId" id={student.classId} />
          ) : (
            <div className="mt-4 p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md">
              <p className="font-bold">No class assigned!</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Annoucements />
      </div>
    </div>
  );
};

export default StudentPage;
