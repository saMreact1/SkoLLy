export type UserProps = {
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
  };
};

export type ProfileProps = {
  fullName: string;
    email: string;
    phone: string;
    gender: string;
    bio: string;
    tenantId: string;
}

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type Notification = { title: string; content: string };
