import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import default styles

const localizer = momentLocalizer(moment); // Initialize the localizer

const CalendarDashboard = () => {
  const myEventsList = [
    {
      title: 'Test week',
      start: new Date(2025, 10 ,28, 1, 0, 0), // Year, Month (0-indexed), Day, Hour, Minute, Second
      end: new Date(2025, 11, 3, 12, 0, 0),
    },
    {
      title: 'Exam week',
      start: new Date(2025, 11, 15, 9, 0, 0),
      end: new Date(2025, 11, 22, 17, 0, 0),
    },
  ];

  return (
    <div style={{ height: '500px' }}> {/* Calendar container needs a defined height */}
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarDashboard;