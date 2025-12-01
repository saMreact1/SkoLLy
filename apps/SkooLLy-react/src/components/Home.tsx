import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "./home/Modal";
import AnalyticsProgressCard from "./shared/AnalyticsProgressCard";
import DashboardChart from "./shared/DashboardChart";
import { studentData } from "../utils/helper";
import CalendarDashboard from "./home/Calendar";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("authenticated") !== "true") {
      toast.success("Logged in successfully!");
      localStorage.setItem("authenticated", "true");
      setTimeout(() => {
        return setShowLoginModal(true);
      }, 3000);
    } else {
      return;
    }
  });

  return (
    <>
      {showLoginModal && (
        <Modal
          title="Welcome!"
          content="You have successfully logged in to SkooLLy. Exams are fast approaching so be prepared"
        />
      )}
      <div className="flex md:flex-col-reverse sm:flex-col lg:flex-row w-full lg:space-x-6 px-2 md:space-y-6 md:items-center">
        {/* left */}
        <div className="lg:w-8/12 flex flex-col space-y-6 md:mt-4">
        <h1 className="font-medium text-xl md:hidden lg:block">Student Dashboard</h1>
         <div className="w-full h-44 bg-slate-100 rounded-lg">
            <article className="border-2 h-full border-black bg-white shadow-[4px_4px_0_0,8px_8px_0_0]">
              <div className="bg-black p-3">
                <div className="flex items-center justify-between">
                  <strong className="text-xs/none font-bold uppercase text-slate-100">
                    System Message
                  </strong>
                  <div className="flex gap-1">
                    <div className="size-3 border-2 border-black bg-white"></div>
                    <div className="size-3 border-2 border-black bg-white"></div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-black">Exam is Fast Approaching...</h3>

                <p className="mt-2 text-sm text-pretty">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Magnam nihil, sit quod quos quibusdam quam ducimus dolore
                  necessitatibus delectus perspiciatis.
                  lorem
                </p>
              </div>
            </article>
          </div>
          <div className="w-full h-64 rounded-lg">
            
            <div className="flex lg:flex-row md:flex-col sm:flex-col space-x-4 bg-slate-700/1 p-4 rounded-lg h-full">
            
              <div className="md:w-full sm:w-full lg:w-1/3 h-55 bg-slate-100 rounded-lg hover:scale-105 transition-all duration-300 ">
                <AnalyticsProgressCard
                  color="#4ade80"
                  label="Attendance Report "
                  percentage={85}
                  remark="Good Standing"
                />
              </div>
              <div className="w-1/3 md:hidden lg:block sm:hidden h-55 bg-slate-100 rounded-lg hover:scale-105 transition-all duration-300">
                <AnalyticsProgressCard
                  color="#60a5fa"
                  label="Term Completion"
                  percentage={25}
                  remark="Term Completion"
                />
              </div>
              <div className="w-1/3 h-55 lg:block md:hidden sm:hidden bg-slate-100 rounded-lg hover:scale-105 transition-all duration-300">
                <AnalyticsProgressCard
                  color="#ee3eed"
                  label="Payment Status"
                  percentage={68}
                  remark="On Track"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-64 bg-slate-100 rounded-lg flex justify-center items-center">
            {/* chart */}
            <DashboardChart data={studentData} />
          </div>
        </div>
        {/* right */}
        <div className="lg:w-4/12">
        <div className="flex flex-col space-y-4 w-full">
            <div className="w-full h-32 bg-slate-100 rounded-lg flex flex-col justify-center items-center relative">
              {/* <h2 className="font-medium text-lg">Profile</h2> */}
             <div className="absolute -top-8 p-2 rounded-full bg-[#dcdada]">
              <img src="/school-logo.png" alt="" className="w-12 h-12 rounded-full  shadow-2xl border border-slate-900" />
             </div>
              <p className="text-sm font-bold text-gray-600 mt-6">John Doe</p>
              <p className="text-sm text-gray-600 ">Lekki School of schools</p>
              <p className="text-sm text-gray-600">JSS2</p>
              <p className="text-sm font-bold text-gray-600">1st Term</p>
            </div>

            <div className="w-full h-32 bg-slate-100 rounded-lg flex flex-col justify-center items-center">
              <h2 className="font-medium text-lg">Next Exam</h2>
              <p className="text-sm text-gray-600">Mathematics</p>
              <p className="text-sm text-gray-600">Date: 25th Dec, 2025</p>
            </div>
            <div className="w-full h-[500px] bg-slate-100 rounded-lg flex flex-col justify-center items-center px-2 py-4">
              <CalendarDashboard />
            </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Home;
