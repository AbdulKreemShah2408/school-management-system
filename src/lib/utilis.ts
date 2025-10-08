import { auth } from "@clerk/nextjs/server"

// Clerk se current user info get karne ka helper
export const getUserInfo = async () => {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  return { userId, role }
}

// ✅ Corrected: Always calculate Monday of current week
const currentWorkWeek = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // Sunday = 0, Monday = 1, ..., Saturday = 6

  // find how many days we need to subtract to get Monday
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() + diff)
  startOfWeek.setHours(0, 0, 0, 0)

  return startOfWeek
}

// ✅ Adjust lessons to current week
export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek()

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay()
    // Convert: Sunday=0 → 6, Mon=1 → 0, ..., Sat=6 → 5
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1

    const adjustedStartDate = new Date(startOfWeek)
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday)
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    )

    const adjustedEndDate = new Date(adjustedStartDate)
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    )

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    }
  })
}
