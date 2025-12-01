import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import Announcement from "./Announcement";

const Layout = () => {
  return (
    <div className="flex bg-[#dcdada] h-full">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Announcement  text="School is closing soon. " link="View Calendar"/>
        <HeaderBar />
        <div className="flex-1 flex-col p-5">
          {/* children content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
