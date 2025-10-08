import Annoucements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { auth } from "@clerk/nextjs/server";

const TeacherPage=async()=>{
    const {userId}=await auth();

    return (
        <div className=" h-[750px] flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
           <div className="h-full bg-white p-4 rounded-md">
           <h1 className="text-xl font-semibold mb-4">Schedule</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
         </div>
          </div>

            {/* Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
            <Annoucements />
            </div>
        </div>
    )
}

export default TeacherPage;