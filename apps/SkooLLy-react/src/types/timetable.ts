type TimetableSlot = {
  id: string;
  subjectName: string;
  color: string;
};

export type TimetableData = Record<string, TimetableSlot[]>;
