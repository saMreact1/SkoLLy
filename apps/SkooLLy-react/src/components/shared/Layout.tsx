import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import Announcement from "./Announcement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { useStudents } from "../../hooks/useStudents";

const queryClient = new QueryClient();

const Layout = () => {
  const { data } = useStudents();
  const user = useAuthStore((state) => (state.user = data?.user));
  if (!data)
    return (
      <div className="h-full w-full flex items-center justify-center"></div>
    );

  return (
<QueryClientProvider client={queryClient}>
  <div className="flex h-screen w-screen bg-[#dcdada] overflow-hidden">
    {/* Sidebar */}
    <Sidebar />

    {/* Main content */}
    <div className="flex flex-col flex-1 min-h-0">
      <Announcement
        text="School is closing soon. "
        link="View Calendar"
      />

      <HeaderBar user={user} />
      <div className="flex-1 min-h-0 ml-[250px] overflow-y-auto p-5 w-[84%] mt-12">
        <Outlet />
      </div>
    </div>
  </div>
</QueryClientProvider>

  );
};

export default Layout;
