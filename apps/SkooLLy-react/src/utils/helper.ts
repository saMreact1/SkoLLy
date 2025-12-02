export const LoginPageUrl = "http://localhost:4200/auth";
export const ApiBaseUrl = "http://localhost:5000";
export const studentData = {
    assignments: [80, 0, 0],
    tests: [75, 0, 0],
    exams: [10, 0, 0], // assume exam happens week 3-4
    attendance: [85, 0, 0],
  };

  const date = new Date();
  const fullyear = date.getFullYear()
  interface Subject {
  id: string;
  subjectName: string;
  color: string;
}
interface Timetable {
  [key: string]: Subject[];
}
export const convertTimetableToEvents = (dataObj: Timetable, year :number= fullyear, month = 0, firstMondayDate = 6) => {
 const dayIndex: Record<string, number> = {
    Mon: firstMondayDate,
    Tue: firstMondayDate + 1,
    Wed: firstMondayDate + 2,
    Thu: firstMondayDate + 3,
    Fri: firstMondayDate + 4,
  };

  const events: any[] = [];

  for (const key in dataObj) {
    const items = dataObj[key];
    if (!items || items.length === 0) continue;

    // Split key like "Wed-8-9am"
    const [dayPart, startHourStr, endHourStrWithAMPM] = key.split("-");

    let startHour = parseInt(startHourStr);
    let endHour = parseInt(endHourStrWithAMPM.replace(/am|pm/, ""));
    const isPM = endHourStrWithAMPM.includes("pm");

    if (isPM && endHour < 12) endHour += 12;
    if (isPM && startHour < 12 && startHour !== 12) startHour += 12;

    const dayDate = dayIndex[dayPart];

    items.forEach((subject: any) => {
      events.push({
        id: subject.id,
        title: subject.subjectName,
        start: new Date(year, month, dayDate, startHour, 0, 0),
        end: new Date(year, month, dayDate, endHour, 0, 0),
        allDay: false,
        backgroundColor: subject.color || "#3b82f6",
        color: "black",
        description: subject.subjectName,
      });
    });
  }

  return events;
};
