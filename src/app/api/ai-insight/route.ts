import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import  prisma  from "@/lib/prisma";

export async function POST(req: Request) {
  const { studentId } = await req.json();

  const results = await prisma.result.findMany({
  where: { studentId },
  include: {
    exam: {
      include: {
        lesson: {
          include: { subject: true }
        }
      }
    },
    assignment: {
      include: {
        lesson: {
          include: { subject: true }
        }
      }
    }
  }
});


const performanceData = results.map(r => {
  const subjectName = r.exam?.lesson.subject.name || r.assignment?.lesson.subject.name || "Unknown Subject";
  const type = r.exam ? "Exam" : "Assignment";
  return `${subjectName} (${type}): ${r.score}`;
}).join(", ");

  
}