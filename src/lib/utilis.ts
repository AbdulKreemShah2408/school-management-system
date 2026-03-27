import { auth } from "@clerk/nextjs/server"

export const getUserInfo = async () => {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  return { userId, role }
}

const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

  // Monday nikalne ka sahi tareeqa
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek();

  return lessons.map((lesson) => {
    
    const lessonDate = new Date(lesson.start);
    const lessonDayOfWeek = lessonDate.getDay();
    
   
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    
    // Sirf Hours aur Minutes set karein
    adjustedStartDate.setHours(
      lessonDate.getHours(),
      lessonDate.getMinutes(),
      0,
      0
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    const lessonEndDate = new Date(lesson.end);
    adjustedEndDate.setHours(
      lessonEndDate.getHours(),
      lessonEndDate.getMinutes(),
      0,
      0
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
}