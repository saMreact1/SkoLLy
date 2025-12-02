import { useEffect, useState } from "react";
import { useClasses, useSubjects } from "../hooks/useStudents";
import { useClassesStore, useSubjectStore } from "../store/authStore";
import toast from "react-hot-toast";
import Loader from "../components/shared/Loader";

const Subjects = () => {
  const { data, isLoading, error } = useSubjects();
  if (error) toast.error(error.message);
  const allSubjects = useSubjectStore((state) => (state.subject = data?.subjects)) as [];  
  const [subjects, setSubjects] = useState([]);

  const { data: classes } = useClasses();
  const allClass = useClassesStore((state) => state.classes = classes)


  useEffect(() => {
    setSubjects(allSubjects);
  }, [allSubjects])
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
    
  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <h1 className="md:hidden lg:block font-bold text-xl">All Subjects</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse ">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Teacher</th>
              <th className="px-4 py-2 text-left">Class</th>
            </tr>
          </thead>

          {subjects?.length === 0 && (
            <div className="w-full flex justify-start items-center py-10">
              <p className="text-gray-500">
                No subjects available at the moment
              </p>
            </div>
          )}

          <tbody>
            {/* Table rows go here */}

            {subjects &&
              subjects.map((subject: any) => (
                <tr key={subject?._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{subject?.name}</td>
                  <td className="px-4 py-2">{subject?.code || "null"}</td>
                  <td className="px-4 py-2">{subject.teacher?.fullName}</td>
                  <td className="px-4 py-2">{allClass?.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subjects;
