import { useQuery } from "@tanstack/react-query";
import { fetchStudentProfile, getClasses, getNotification, getSchoolInfo, getSubjects, getTimeTable } from "../api/students";


export function useStudents() {
    return useQuery({
        queryKey: ['students'],
        queryFn: fetchStudentProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useSchools(){
    return useQuery({
        queryKey: ['schools'],
        queryFn: getSchoolInfo,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
export function useSubjects(){
    return useQuery({
        queryKey: ['subjects'],
        queryFn: getSubjects,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
export function useClasses(){
    return useQuery({
        queryKey: ['classes'],
        queryFn: getClasses,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useTimeTable(classId: string, options={}){
    return useQuery({
        queryKey: ['timetables', classId],
        queryFn: () => getTimeTable(classId),
        enabled: !!classId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
}

export function useNotifications(){
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotification(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

