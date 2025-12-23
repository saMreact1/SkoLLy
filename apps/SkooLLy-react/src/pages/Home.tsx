import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../components/home/Modal";
import AnalyticsProgressCard from "../components/shared/AnalyticsProgressCard";
import DashboardChart from "../components/shared/DashboardChart";
import { studentData } from "../utils/helper";
import CalendarDashboard from "../components/home/CalendarDashboard";
import {
  useAuthStore,
  useClassesStore,
  useNotificationStore,
  useSchoolStore,
  useTermStore,
} from "../store/authStore";
import {
  useClasses,
  useNotifications,
  useSchools,
  useStudents,
  useTerm,
} from "../hooks/useStudents";
import Loader from "../components/shared/Loader";

const myEventsList = [
  {
    title: "Test week",
    start: new Date(2025, 10, 28, 1, 0, 0), // Year, Month (0-indexed), Day, Hour, Minute, Second
    end: new Date(2025, 11, 3, 12, 0, 0),
  },
  {
    title: "Exam week",
    start: new Date(2025, 11, 15, 9, 0, 0),
    end: new Date(2025, 11, 22, 17, 0, 0),
  },
];

const Home = () => {
  const { data: profile, isLoading, error } = useStudents();
  const user = useAuthStore((state) => (state.user = profile?.user));
  const { data: schoolInfo } = useSchools();
  const school = useSchoolStore((state) => (state.school = schoolInfo));
  const { data: classes } = useClasses();
  const allClass = useClassesStore((state) => (state.classes = classes));

  const { data: notifications } = useNotifications();

  const allNotifications = useNotificationStore(
    (state) => (state.notification = notifications)
  ); 

  const {data: termData} = useTerm();
  const term = useTermStore((state) => (state.term = termData));

  if (error) toast.error(error.message);

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
      {showLoginModal && profile && (
        <Modal
          title={`Welcome Back ${user?.fullName}!`}
          content="You have successfully logged in to SkooLLy. Exams are fast approaching so be prepared"
        />
      )}
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      {!isLoading && profile && (
        <div className="flex md:flex-col-reverse sm:flex-col lg:flex-row lg:space-x-6 px-2 md:space-y-6 md:items-center w-full mt-6 z-999">
          {/* left */}
          <div className="lg:w-8/12 flex flex-col space-y-6 md:mt-4">
            <h1 className="font-medium text-xl md:hidden lg:block">
              Student Dashboard
            </h1>
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

                {allNotifications?.length === 0 && (
                  <div className="text-black text-pretty text-center animate-pulse">
                    <h3 className="text-md">
                      No Notifications at the moment...
                    </h3>
                  </div>
                )}
                {allNotifications?.length > 1 && (
                  <div className="border-t-2 border-black p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-black">
                      {allNotifications[0]?.title}...
                    </h3>

                    <p className="mt-2 text-sm text-pretty">
                      {allNotifications[0]?.content}
                    </p>
                  </div>
                )}
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
              <div className="w-full h-38 bg-slate-100 rounded-lg flex flex-col justify-center items-center relative">
                {/* <h2 className="font-medium text-lg">Profile</h2> */}
                <div className="absolute -top-8 p-2 rounded-full bg-[#dcdada]">
                  <img
                    src="/school-logo.png"
                    alt=""
                    className="w-12 h-12 rounded-full  shadow-2xl border border-slate-900"
                  />
                </div>
                <p className="text-sm font-bold text-gray-600 mt-6">
                  {user.fullName}
                </p>
                <p className="text-sm text-gray-600 ">
                  {school?.name.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">{allClass?.name}</p>
                <p className="text-sm font-bold text-gray-600">
                  {term?.term === "FIRST" && "1st" || term?.term === "SECOND" && "2nd" || term?.term === "THIRD" && "3rd" ||  "" }
                  {" "}
                  Term
                </p>
                <p className="text-xs text-gray-500">
                  {term?.session || "" }
                  {" "}
                  session
                </p>
              </div>

              <div className="w-full h-32 bg-slate-100 rounded-lg flex flex-col justify-center items-center">
                <h2 className="font-medium text-lg">Next Exam</h2>
                <p className="text-sm text-gray-600">Mathematics</p>
                <p className="text-sm text-gray-600">Date: 22th Dec, 2025</p>
              </div>
              <div className="w-full h-[500px] bg-slate-100 rounded-lg flex flex-col justify-center items-center px-2 py-4">
                <CalendarDashboard events={myEventsList} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
