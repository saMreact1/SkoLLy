/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  useClasses,
  useSubjects,
  useTestsForClass,
} from "../hooks/useStudents";
import {
  useClassesStore,
  useSubjectStore,
  useTestStore,
} from "../store/authStore";
import toast from "react-hot-toast";
import Loader from "../components/shared/Loader";
import Card from "../components/shared/Card";
import type { TestType } from "../types/testorexam";


const Tests = () => {
  const { data, isLoading, error } = useSubjects();
  const takentest = false;
  if (error) toast.error(error.message);
  const allSubjects = useSubjectStore(
    (state) => (state.subject = data?.subjects)
  ) as [];
  const [subjects, setSubjects] = useState([]);

  const { data: classes } = useClasses();
  const currentClass = useClassesStore((state) => (state.classes = classes));


  const { data: tests, isLoading: allTestLoading } = useTestsForClass(
    currentClass?.name
  );
  const allTest = useTestStore((state) => (state.test = tests?.tests as []));

  useEffect(() => {
    setSubjects(allSubjects);
  }, [allSubjects]);
  if (isLoading || allTestLoading)
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
            {allTest.map((test: TestType) => (
              <Card
                key={test?._id}
                subject={test?.subject}
                description={currentClass?.name}
                testId={test?._id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Test Results for each term */}
      <hr className="mt-0" />
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

            <tbody>
              {(!subjects?.length || !takentest) && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    No test results are available at the moment
                  </td>
                </tr>
              )}

              {takentest &&
                subjects.map((subject: any) => (
                  <tr key={subject?._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{subject?.name}</td>
                    <td className="px-4 py-2">{subject?.code || "—"}</td>
                    <td className="px-4 py-2">
                      {subject?.teacher?.fullName || "—"}
                    </td>
                    <td className="px-4 py-2 font-semibold">90%</td>
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
