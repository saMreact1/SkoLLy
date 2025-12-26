import type { TimetableData } from "../../types/timetable";

interface TimetableProps {
  data: TimetableData;
}

const DAYS = [
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
];

const TIMES = [
  { label: "8 - 9am", key: "8-9am" },
  { label: "9 - 10am", key: "9-10am" },
  { label: "10 - 11am", key: "10-11am" },
  "BREAK",
  { label: "11 - 12pm", key: "11-12pm" },
  { label: "12 - 1pm", key: "12-1pm" },
  { label: "1 - 2pm", key: "1-2pm" },
];

const TimetableComponent = ({ data }: TimetableProps) => {
  if (!data || typeof data !== "object") {
    return <p className="text-red-500">Invalid timetable data</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-3 border">Time</th>
            {DAYS.map((day) => (
              <th key={day.key} className="p-3 border">
                {day.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {TIMES.map((time, index) =>
            time === "BREAK" ? (
              <tr key={`break-${index}`} className="bg-black/10 text-red-400">
                <td colSpan={6} className="p-4 text-center font-bold">
                  BREAK TIME
                </td>
              </tr>
            ) : (
              <tr key={(time as { label: string; key: string }).key}>
                <td className="border p-2 font-medium bg-gray-100">
                  {(time as { label: string; key: string }).label}
                </td>

                {DAYS.map((day) => {
                  const key = `${day.key}-${(time as { label: string; key: string }).key}`;
                  const slot = data[key]?.[0]; // backend sends arrays

                  return (
                    <td
                      key={key}
                      className="border p-2 text-center"
                      style={{
                        backgroundColor: slot?.color || "transparent",
                      }}
                    >

                      {slot ? (
                        <span className="font-semibold text-white">
            
                          {slot.subjectName}
                        </span>
                      ) : (
                        <span className="text-gray-400">Free</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableComponent;
