import {
  FaBookMedical,
  FaBookOpen,
  FaBookReader,
  FaHome,
  FaIdCard,
  FaRegFilePdf,
  FaSignOutAlt,
  
} from "react-icons/fa";
import { FaBookAtlas,  FaGears, FaGraduationCap, FaLocationPin, FaRegCalendar } from "react-icons/fa6";
import { useLocation, NavLink } from "react-router-dom";
import { LoginPageUrl } from "../../utils/helper";
import toast from "react-hot-toast";
import { useSchoolStore } from "../../store/authStore";
import { useSchools } from "../../hooks/useStudents";
import { useEffect } from "react";


const sidebarLinks = [
  { name: "Home", path: "/", icon: <FaHome /> },
  { name: "Subjects", path: "/subjects", icon: <FaBookOpen /> },
  { name: "Time Table", path: "/timetable", icon: <FaRegCalendar /> },
  { name: "Tests", path: "/tests", icon: <FaBookMedical /> },
  { name: "Exams", path: "/exams", icon: <FaBookAtlas /> },
  { name: "Assignments", path: "/assignments", icon: <FaRegFilePdf /> },
  { name: "Events", path: "/events", icon: <FaLocationPin /> },
  { name: "Report Card", path: "/report", icon: <FaBookReader /> },
  // { name: "Profile", path: "/profile", icon: <FaIdCard /> },
  { name: "Settings", path: "/settings", icon: <FaGears /> },
];

const date = new Date();
const year = date.getFullYear();

const Sidebar = () => {
  const { data: schoolInfo } = useSchools();
  const school = useSchoolStore((state) => (state.school));
  const setSchool = useSchoolStore((state) => (state.setSchool));

  const schoolLogo = school?.name === undefined ? "Logo" : `${school?.name[0]} ${school?.name[1]} ${school?.name[2]}`

  useEffect(() => {
    if(schoolInfo) {
      setSchool(schoolInfo)
    }
  }, [schoolInfo, setSchool])
  const pathname = useLocation().pathname;
  return (
    <div className="bg-black h-full rounded-r-sm w-48 fixed">
      <div className="flex flex-col py-2 md:px-4 lg:px-3 text-white justify-between h-full">
        <div className="flex items-center space-x-2 text-2xl font-bold mb-8">
          <FaGraduationCap />
          <h1 className="uppercase">{schoolLogo}</h1>
        </div>
        <div className="flex-1 flex-wrap">
          <div className="flex-col space-y-4">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={`flex gap-2 px-4 items-center py-2 rounded-lg ${
                  pathname === link.path
                    ? "bg-[#dcdada] text-slate-700 rounded-b-3xl rounded-t-3xl w-[200px] "
                    : "hover:bg-[#dcdada] hover:text-slate-700 transition-all duration-200 hover:ml-2 hover:shadow-sm"
                }`}
              >
                <span>
                  {link.icon}
                </span>
                <span>
                  {link.name}
                </span>
              </NavLink>
            ))}
          
          </div>
          
        </div>
         {/* <div className=" flex flex-col items-start space-y-10 px-2 mt-4">
          <button 
            onClick={handleLogout}
            className="flex space-x-2 items-center hover:bg-slate-700 px-4 py-2 hover:ml-2 rounded-lg transition-all duration-200 w-full hover:cursor-pointer">
            <span><FaSignOutAlt /></span>
            <span>Logout</span>
            </button>
          <p className="text-sm mb-2 ml-4">© {year} SkooLLy</p>
            </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
