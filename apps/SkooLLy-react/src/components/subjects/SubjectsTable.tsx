import type { Subject } from "../../types/subjects";


const SubjectsTable = ({ subjects, currentClass }: { subjects: Subject[], currentClass:String }) => (
  <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="px-4 py-3 text-left font-semibold">Subject</th>
          <th className="px-4 py-3 text-left font-semibold">Code</th>
          <th className="px-4 py-3 text-left font-semibold">Teacher</th>
          <th className="px-4 py-3 text-left font-semibold">Class</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {subjects.map((subject) => (
          <tr
            key={subject._id}
            className="hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3 font-medium">
              {subject.name}
            </td>
            <td className="px-4 py-3 text-gray-500">
              {subject.code ?? "—"}
            </td>
            <td className="px-4 py-3">
              {subject.teacher?.fullName ?? "Unassigned"}
            </td>
            <td className="px-4 py-3">
              {currentClass ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SubjectsTable