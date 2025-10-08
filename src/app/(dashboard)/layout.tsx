import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
export default function Dashboardut({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <div className="flex  ">
         {/*left*/}
         <div className=" w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]  p-4  ">
          <Link href="/" className="flex items-center justify-center lg:justify-start  gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32}  />
          <span className="hidden lg:block font-bold ">SchoolLama</span>
          </Link>
          <Menu/>
         </div>
          {/*right*/}
         <div className="flex-1   bg-[#F7F8FA] overflow-scroll flex flex-col ">
          <Navbar />
          {children}

         </div>
       </div>
        
   
  );
}
