/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface AuthState {
    user: any;
    token: string | null;
    setuser: (user: any) => void;
    logout: () => void;
}

interface SchoolState {
    school: any;
    setSchool: (school: any) => void;
}

interface SubjectStore {
    subject: any;
    setSubject: (subject: any) => void;
}
interface ClassesStore {
    classes: any;
    setClasses: (classes: any) => void;
}
interface TimetableStore {
    timetable: any;
    setTimetable: (timetable: any) => void;
}
interface NotificationStore {
    notification: any;
    setNotification : (notification: any) => void;
}
// interface UpdateProfileStore {
//     updateProfile: any;
//     setUpdateProfile : (updateProfile: any) => void;
// }


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setuser: (user) => set({ user }),
    logout: () => set({ user: null, token: null }),
}));

export const useSchoolStore = create<SchoolState>((set) => ({
    school: null,
    setSchool: (school) => set({ school }),
}));

export const useSubjectStore = create<SubjectStore>((set) => ({
    subject: null,
    setSubject: (subject) => set({subject}) 
}));

export const useClassesStore = create<ClassesStore>((set) => ({
    classes: null,
    setClasses: (classes) => set({classes}) 
}));

export const useTimetableStore = create<TimetableStore>((set) => ({
    timetable: null,
    setTimetable: (timetable) => set({timetable}) 
}));
export const useNotificationStore = create<NotificationStore>((set) => ({
    notification: null,
    setNotification: (notification) => set({notification}) 
}));
// export const useUpdateProfileStore = create<UpdateProfileStore>((set) => ({
//     updateProfile: null,
//     setUpdateProfile: (updateProfile) => set({updateProfile}) 
// }));


