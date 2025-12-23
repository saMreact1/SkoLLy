export type Subject = {
  _id: string;
  name: string;
  code?: string;
  teacher?: { fullName: string };
  class?: { name: string };
};