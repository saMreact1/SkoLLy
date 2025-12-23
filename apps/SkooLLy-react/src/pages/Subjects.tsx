import { useEffect } from "react";
import { useClasses, useSubjects } from "../hooks/useStudents";
import { useClassesStore, useSubjectStore } from "../store/authStore";
import toast from "react-hot-toast";
import Loader from "../components/shared/Loader";
import SubjectsTable from "../components/subjects/SubjectsTable";
import EmptyState from "../components/subjects/EmptyState";

const Subjects = () => {
  const { data, isLoading, error } = useSubjects();
  const { data: classesData } = useClasses();

  const setSubjects = useSubjectStore((state) => state.setSubject);
  const setClasses = useClassesStore((state) => state.setClasses);

  useEffect(() => {
    if (data?.subjects) setSubjects(data.subjects);
  }, [data, setSubjects]);

  useEffect(() => {
    if (classesData) setClasses(classesData);
  }, [classesData, setClasses]);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  const subjects = data?.subjects ?? [];
  const currentClass = classesData?.name ?? "";

  return (
    <div className="w-full h-full space-y-6">
      <h1 className="font-bold text-xl">All Subjects</h1>

      {subjects.length === 0 ? (
        <EmptyState />
      ) : (
        <SubjectsTable subjects={subjects} currentClass={currentClass} />
      )}
    </div>
  );
};

export default Subjects;
