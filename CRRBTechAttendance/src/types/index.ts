export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  year: string;
  email: string;
  password?: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: string;
  password?: string;
}

export interface Course {
  id: string;
  courseName: string;
  branch: string;
  year: string;
  facultyId: string;
}

export interface Attendance {
  id: string;
  date: string;
  studentId: string;
  courseId: string;
  status: 'Present' | 'Absent';
  markedBy: string;
}

export interface User {
  email: string;
  role: 'Admin' | 'Faculty' | 'Student';
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'Admin' | 'Faculty' | 'Student';
  name: string;
  id?: string;
}

export type Branch = 'CSE' | 'CSE (Data Science)' | 'CSE (AI & ML)' | 'CS & AM';
export type Year = 'I' | 'II' | 'III' | 'IV';