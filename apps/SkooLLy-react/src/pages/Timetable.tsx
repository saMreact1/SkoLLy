import toast from "react-hot-toast";
import { useStudents, useTimeTable } from "../hooks/useStudents";
// import TimetableCalendar from "../components/shared/TimetableCalendar";
import Loader from "../components/shared/Loader";
import { useTimetableStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { convertTimetableToEvents } from "../utils/helper";
import TimetableComponent from "../components/timetable/TimetableComponent";

// const events = [
//   {
//     id: "1",
//     title: "Team Meeting",
//     start: new Date("2025-12-04T10:00:00"),
//     end: new Date("2025-12-04T11:00:00"),
//     description: "Weekly team sync",
//     backgroundColor: "#3b82f6",
//     color: "black",
//   },
//   {
//     id: "2",
//     title: "Project Deadline",
//     start: new Date("2025-12-12T23:59:59"),
//     end: new Date("2025-12-19T23:59:59"),
//     allDay: true,
//     backgroundColor: "#ef4444",
//     color: "black",
//   },
// ];

// const timetableData = [
//   { day: "Monday", time: "8:00 - 9:00", subject: "Mathematics" },
//   { day: "Monday", time: "9:00 - 10:00", subject: "English" },
//   { day: "Monday", time: "10:00 - 11:00", subject: "Physics" },

//   { day: "Tuesday", time: "8:00 - 9:00", subject: "Chemistry" },
//   { day: "Tuesday", time: "9:00 - 10:00", subject: "Biology" },
// ];



const Timetable = () => {
  const { data: user } = useStudents();
  const classId = user?.user.classId;
  const { data: timetable, isLoading, error } = useTimeTable(classId, { enabled: !!classId })
  const { timetable: timeTable, setTimetable } = useTimetableStore();
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  // Update store and local events whenever timetable changes
  useEffect(() => {
    if (timetable?.data) {
      setTimetable(timetable.data);
      const converted = convertTimetableToEvents(timetable.data);
      setEvents(converted);
    }
  }, [timetable, setTimetable]);

  if (!classId || isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );

  if (!timeTable || events.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p>No Time Table available at the moment</p>
      </div>
    );
  }
  return (
    <div>
      {/* <TimetableCalendar events={events} /> */}
      <TimetableComponent data={timeTable ?? {}}/>
    </div>
  );
};

export default Timetable;
