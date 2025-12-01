import { useEffect, lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "./components/shared/Loader";
import { LoginPageUrl } from "./utils/helper";

const angularAppUrl = LoginPageUrl;

const Home = lazy(() => import("./components/Home"));
const Layout = lazy(() => import("./components/shared/Layout"));
const Subjects = lazy(() => import("./components/Subjects"));
const Timetable = lazy(() => import("./components/Timetable"));
const Tests = lazy(() => import("./components/Tests"));
const Exams = lazy(() => import("./components/Exams"));
const ReportCard = lazy(() => import("./components/ReportCard"));
const Profile = lazy(() => import("./components/Profile"));
const Settings = lazy(() => import("./components/Settings"));
const Assignments = lazy(() => import("./components/Assignments"));
const Events = lazy(() => import("./components/Events"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {path: "subjects", element: <Subjects /> },
      {path: "timetable", element: <Timetable /> },
      {path: "tests", element: <Tests /> },
      {path: "exams", element: <Exams /> },
      {path: "assignments", element: <Assignments /> },
      {path: "events", element: <Events /> },
      {path: "report", element: <ReportCard /> },
      {path: "profile", element: <Profile /> },
      {path: "settings", element: <Settings /> },
    ],
    
  },
]);

const App = () => {
  useEffect(() => {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || localStorage.getItem("authToken");
    document.title = "SkooLLy - Student " + (pathname === "/" ? "Home" : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2));

    console.log("Token from URL:", token);

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
    <Toaster position="bottom-right" />
    <Suspense fallback={<Loader/>}>
      <RouterProvider router={router} />
    </Suspense>
    </>
  );
};

export default App;
