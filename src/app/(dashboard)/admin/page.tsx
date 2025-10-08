import Annoucements from "@/components/Announcements";
import AttendanceChartContaniner from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanaceChart from "@/components/FinanaceChart";
import UserCard from "@/components/UserCard";


const AdminPage=async({searchParams}:{searchParams:{[keys:string]:string | undefined}})=>{
   
    
    return (
        <div className="p-4 flex flex-col gap-4 md:flex-row ">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {/* USER CARD */}
            <div className="flex gap-4  justify-between flex-wrap ">
                <UserCard type="admin" />
                 <UserCard type="teacher" />
                 <UserCard type="student" />
                <UserCard type="parent" />
            </div>
            {/* MIDDLE CHART */}
            <div className="flex gap-4 flex-col lg:flex-row">
                {/* COUNT CHART */}
                <div className="w-full lg:w-1/3 h-[450px]">
                <CountChartContainer /> 
                </div>
                {/* ATTENDANCE CHART */}
                <div className="w-full lg:w-2/3 h-[450px]  ">
                <AttendanceChartContaniner />
                </div>
            </div>
            {/* BOTTEM CHART */}
            <div className="w-full h-[500px]">
                <FinanaceChart />
            </div>
            </div>
            {/* Right */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <EventCalendarContainer  searchParams={searchParams}/>
            <Annoucements />
            </div>
        </div>
    )
}

export default AdminPage;