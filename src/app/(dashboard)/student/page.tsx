import Annoucements from "@/components/Announcements";
import BigCalender from "@/components/BigCalendar";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { log } from "console";
import { cs } from "zod/locales";

const StudentPage=async()=>{
    const {userId}= await auth();
    const classItem=await prisma.class.findMany({
        where:{
            students:{
                some:{
                    id:userId!
                }
            }
        }
    });
  
    return (

        <div className=" p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
            <div className="h-full bg-white p-4 rounded-md">
             <h1 className="text-xl font-semibold">Schedule (4A)</h1>
             <BigCalendarContainer type="classId" id={classItem[0].id} />
            </div>
            </div>
            {/* Right */}
            <div className="w-full xl:w-1/3">
            <EventCalendar />
            <Annoucements />
            </div>
        </div>
    )
}

export default StudentPage;