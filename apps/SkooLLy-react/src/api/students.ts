import { ApiBaseUrl } from "../utils/helper";
const token = localStorage.getItem("authToken");

export async function fetchStudentProfile() {
  const res = await fetch(`${ApiBaseUrl}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch student profile");
  return res.json();
}

export async function getSchoolInfo() {
  const res = await fetch(`${ApiBaseUrl}/schools/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch school info");
  return res.json();
}
export async function getSubjects() {
  const res = await fetch(`${ApiBaseUrl}/subjects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch subjects");
  const data = await res.json();
  return data;
}
export async function getClasses() {
  const res = await fetch(`${ApiBaseUrl}/classes/class`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch subjects");
  const data = await res.json();
  return data;
}

export async function getTimeTable(classId: string) {
  const res = await fetch(`${ApiBaseUrl}/timetable/${classId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch timetable");
  const data = await res.json();
  return data;
}

export async function getNotification() {
  const res = await fetch(`${ApiBaseUrl}/notices`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");
  const data = await res.json();
  return data;
}
