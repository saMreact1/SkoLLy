import { useQuery } from "@tanstack/react-query";
import {
  fetchStudentProfile,
  getAllTestForClass,
  getClasses,
  getCurrentTerm,
  getNotification,
  getSchoolInfo,
  getSubjects,
  getTestById,
  getTimeTable,
} from "../api/students";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: getSchoolInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTimeTable(classId: string, options = {}) {
  return useQuery({
    queryKey: ["timetables", classId],
    queryFn: () => getTimeTable(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotification,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function useProfileUpdate(data: any){
//     return useQuery({
//         queryKey: ['profileUpdate', data],
//         queryFn: () => updateUserProfile(data),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//     });
// }
export function useTerm() {
  return useQuery({
    queryKey: ["term"],
    queryFn: getCurrentTerm,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTestsForClass(className: String) {
  return useQuery({
    queryKey: ["testsForClass", className],
    queryFn: () => getAllTestForClass(className),
    enabled: !!className,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
export function useTestById(testId: String) {
  return useQuery({
    queryKey: ["testById", testId],
    queryFn: () => getTestById(testId),
    enabled: !!testId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
