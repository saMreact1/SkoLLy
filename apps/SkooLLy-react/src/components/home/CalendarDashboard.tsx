import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import default styles

const localizer = momentLocalizer(moment); // Initialize the localizer

const CalendarDashboard = ({events}: {events: any}) => {

  return (
    <div style={{ height: '500px' }}> {/* Calendar container needs a defined height */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarDashboard;