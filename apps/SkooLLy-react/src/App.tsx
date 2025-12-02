import { useEffect, lazy, Suspense } from "react";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoginPageUrl } from "./utils/helper";
import Loader2 from "./components/shared/Loader2";

const angularAppUrl = LoginPageUrl;

const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./components/shared/Layout"));
const Subjects = lazy(() => import("./pages/Subjects"));
const Timetable = lazy(() => import("./pages/Timetable"));
const Tests = lazy(() => import("./pages/Tests"));
const Exams = lazy(() => import("./pages/Exams"));
const ReportCard = lazy(() => import("./pages/ReportCard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Assignments = lazy(() => import("./pages/Assignments"));
const Events = lazy(() => import("./pages/Events"));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "subjects", element: <Subjects /> },
      { path: "timetable", element: <Timetable /> },
      { path: "tests", element: <Tests /> },
      { path: "exams", element: <Exams /> },
      { path: "assignments", element: <Assignments /> },
      { path: "events", element: <Events /> },
      { path: "report", element: <ReportCard /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

const App = () => {
  useEffect(() => {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || localStorage.getItem("authToken");
    document.title =
      "SkooLLy - Student " +
      (pathname === "/"
        ? "Home"
        : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2));

  

    if (token) {
      localStorage.setItem("authToken", token);

      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // No token → redirect to Angular login
      window.location.replace(angularAppUrl);
    }
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" />
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Loader2 /></div>}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </>
  );
};

export default App;
