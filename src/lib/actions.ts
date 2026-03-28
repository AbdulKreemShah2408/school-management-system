"use server";

import { revalidatePath } from "next/cache";
import {
  AssignmentSchema,
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
  ParentSchema,
  ResultSchema,
  EventSchema,
  AnnouncementSchema,
} from "./formValidationSechma";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema,
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema,
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema,
) => {
  try {
    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,

      emailAddress: data.email ? [data.email] : [],
      publicMetadata: { role: "parent" },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || "",
        address: data.address,

        students: {
          connect: data.students?.map((studentId: string) => ({
            id: studentId,
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error("❌ ERROR IN ACTION:", err.message || err);
    return { success: false, error: true };
  }
};
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema,
) => {
  try {
    await prisma.class.create({
      data,
    });

    revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema,
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      emailAddress: [data.email ?? ""],
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: { success: boolean; error: boolean },
  data: any
) => {
  try {
    
    const classItem = await prisma.class.findUnique({
      where: { id: Number(data.classId) },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    
    const user = await clerkClient.users.createUser({
      username: data.username,
      emailAddress: [data.email || ""],
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    
    await prisma.student.create({
      data: {
        id: user.id, 
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        gradeId: Number(data.gradeId),
        classId: Number(data.classId),
        parentId: data.parentId,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log("❌ CREATE ERROR:", err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: { success: boolean; error: boolean },
  data: any
) => {
  if (!data.id) return { success: false, error: true };

  try {
    
    const userUpdate: any = {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      emailAddress: [data.email || ""],
    };

    if (data.password && data.password.length >= 8) {
      userUpdate.password = data.password;
    }

    await clerkClient.users.updateUser(data.id, userUpdate);

    
    await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null, 
        bloodType: data.bloodType,
        sex: data.sex,
        
        birthday: new Date(data.birthday), 
        
        gradeId: parseInt(data.gradeId), 
        classId: parseInt(data.classId),
        parentId: data.parentId, 
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err: any) {
    
    return { success: false, error: true };
  }
};
export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;

  try {
    try {
      await clerkClient.users.getUser(id);
      await clerkClient.users.deleteUser(id);
    } catch (clerkErr: any) {
      if (clerkErr.status === 404) {
        console.log("Clerk student not found, skipping Clerk delete.");
      } else {
        throw clerkErr;
      }
    }

    await prisma.student.delete({
      where: { id },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  try {
    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: new Date(data.startTime),
        dueDate: new Date(data.dueDate),
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  try {
    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: new Date(data.startTime),
        dueDate: new Date(data.dueDate),
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createResult = async (currentState: any, data: ResultSchema) => {
  try {
    console.log("SERVER ACTION STARTED:", data);

    const finalData = {
      score: Number(data.score),
      studentId: data.studentId,

      examId: data.examId ? Number(data.examId) : null,

      assignmentId: data.assignmentId ? Number(data.assignmentId) : null,
    };

    const newResult = await prisma.result.create({
      data: finalData,
    });

    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err: any) {
    console.log("❌ PRISMA ERROR DETAILS:", err.message);
    return { success: false, error: true };
  }
};

export const updateResult = async (currentState: any, data: ResultSchema) => {
  try {
    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId || null,
        assignmentId: data.assignmentId || null,
      },
    });

    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.log("❌ Error updating result:", err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (currentState: any, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.log("❌ Error deleting result:", err);
    return { success: false, error: true };
  }
};
export const updateParent = async (currentState: any, data: ParentSchema) => {
  if (!data.id) return { success: false, error: true };

  try {
    const client = await clerkClient();

    const updatePayload: any = {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
    };

    if (data.password && data.password.length >= 8) {
      updatePayload.password = data.password;
    }

    await client.users.updateUser(data.id, updatePayload);

    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || "",
        address: data.address,
      },
    });

    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err: any) {
    console.error("❌ UPDATE ERROR:", err);
    return { success: false, error: true };
  }
};

export const deleteParent = async (currentState: any, formData: FormData) => {
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: true };

  try {
    const client = await clerkClient();

    const parent = await prisma.parent.findUnique({
      where: { id: id },
    });

    if (!parent) {
      return { success: true, error: false };
    }

    await prisma.student.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });

    try {
      await client.users.deleteUser(id);
    } catch (clerkErr) {
      console.log("Clerk user not found, moving to DB...");
    }

    await prisma.parent.delete({
      where: { id: id },
    });

    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err: any) {
    console.error("❌ DELETE ERROR:", err);

    return { success: false, error: true };
  }
};
export const createLesson = async (currentState: any, data: any) => {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        subjectId: parseInt(data.subjectId),
        classId: parseInt(data.classId),
        teacherId: data.teacherId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateLesson = async (currentState: CurrentState, data: any) => {
  if (!data.id) return { success: false, error: true };

  try {
    await prisma.lesson.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        name: data.name,
        day: data.day,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        subjectId: parseInt(data.subjectId),
        classId: parseInt(data.classId),
        teacherId: data.teacherId,
      },
    });

    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createEvent = async (currentState: any, data: EventSchema) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId || null,
      },
    });

    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (currentState: any, data: EventSchema) => {
  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId || null,
      },
    });

    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (currentState: any, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createAnnouncement = async (
  currentState: any,
  data: AnnouncementSchema,
) => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId || null,
      },
    });

    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: any,
  data: AnnouncementSchema,
) => {
  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId || null,
      },
    });

    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteAnnouncement = async (currentState: any, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log("❌ Error deleting announcement:", err);
    return { success: false, error: true };
  }
};
