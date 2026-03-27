import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utilis";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="w-full h-full">
      {schedule.length > 0 ? (
        <div className="h-[700px] w-full p-2">
          <BigCalendar data={schedule} />
        </div>
      ) : (
        <div className="p-10 text-center text-gray-500 bg-white rounded-md shadow-sm">
          No lessons found for this {type === "teacherId" ? "teacher" : "class"}
          .
        </div>
      )}
    </div>
  );
};

export default BigCalendarContainer;
