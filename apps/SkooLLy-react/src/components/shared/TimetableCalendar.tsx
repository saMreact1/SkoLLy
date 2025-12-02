import CalendarDashboard from '../home/CalendarDashboard';

const TimetableCalendar = ({events}: {events: any}) => {
  return (
     <div className="p-6 bg-white rounded-lg shadow-lg">
        <CalendarDashboard events={events} />
    </div>
  )
}

export default TimetableCalendar