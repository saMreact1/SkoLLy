/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useClasses, useSubjects } from "../hooks/useStudents";
import { useClassesStore, useSubjectStore } from "../store/authStore";
import toast from "react-hot-toast";
import Loader from "../components/shared/Loader";
import Card from "../components/shared/Card";

const Tests = () => {
  const { data, isLoading, error } = useSubjects();
  const takentest = false
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
    <div className="w-full h-full flex flex-col space-y-2">
      <div className="flex flex-col mb-4 py-0">
        <h1 className="font-bold text-2xl">Take Tests</h1>
        {/* Cards */}
        <div className="w-full mt-4">
          <div className="grid grid-cols-4 gap-4">
             {[1,2,3,4,5].map((value, index) => (
                 <Card
                 key={index} 
                  subject="Mathematics"
                  description="lorem ispumsahja"
              />
             ))}
          </div>
        </div>
      </div>

      {/* Test Results for each term */}
      <hr className="mt-0"/>
     <div className="">
       <h1 className="md:hidden lg:block font-bold text-xl">Test Results</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse ">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Created By</th>
              <th className="px-4 py-2 text-left">Score</th>
            </tr>
          </thead>

          {subjects?.length === 0 || !takentest && (
            <div className="w-full flex justify-start items-center py-10">
              <p className="text-gray-500">
                No test results are available at the moment
              </p>
            </div>
          )}

          <tbody>
            {/* Table rows go here */}

            {subjects && takentest &&
              subjects.map((subject: any) => (
                <tr key={subject?._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{subject?.name}</td>
                  <td className="px-4 py-2">{subject?.code || "null"}</td>
                  <td className="px-4 py-2">{subject.teacher?.fullName}</td>
                  <td className="px-4 py-2">90%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
     </div>
    </div>
  );
};

export default Tests;
