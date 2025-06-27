import { Student, Faculty, Course, Attendance, User, LoginCredentials } from '../types';

export const students: Student[] = [
  { id: 'S001', name: 'Alice Kumar', rollNumber: '101', branch: 'CSE', year: 'I', email: 'alice@demo.com', password: 'alice123' },
  { id: 'S002', name: 'Bob Singh', rollNumber: '102', branch: 'CSE (Data Science)', year: 'II', email: 'bob@demo.com', password: 'bob123' },
  { id: 'S003', name: 'Carol Thomas', rollNumber: '103', branch: 'CSE (AI & ML)', year: 'III', email: 'carol@demo.com', password: 'carol123' },
  { id: 'S004', name: 'David Reddy', rollNumber: '104', branch: 'CS & AM', year: 'IV', email: 'david@demo.com', password: 'david123' },
  { id: 'S005', name: 'Eva Shah', rollNumber: '105', branch: 'CSE', year: 'II', email: 'eva@demo.com', password: 'eva123' },
  { id: 'S006', name: 'Frank Joseph', rollNumber: '106', branch: 'CSE (Data Science)', year: 'III', email: 'frank@demo.com', password: 'frank123' },
  { id: 'S007', name: 'Grace Iyer', rollNumber: '107', branch: 'CSE (AI & ML)', year: 'I', email: 'grace@demo.com', password: 'grace123' },
  { id: 'S008', name: 'Hari Prasad', rollNumber: '108', branch: 'CS & AM', year: 'II', email: 'hari@demo.com', password: 'hari123' },
  { id: 'S009', name: 'Indu Patel', rollNumber: '109', branch: 'CSE', year: 'III', email: 'indu@demo.com', password: 'indu123' },
  { id: 'S010', name: 'John Fernandes', rollNumber: '110', branch: 'CSE (Data Science)', year: 'IV', email: 'john@demo.com', password: 'john123' },
];

export const faculty: Faculty[] = [
  { id: 'F001', name: 'Prof. A Rao', email: 'arao@college.com', branch: 'CSE', role: 'Faculty', password: 'prof123' },
  { id: 'F002', name: 'Prof. B Das', email: 'bdas@college.com', branch: 'CSE (Data Science)', role: 'Faculty', password: 'prof123' },
  { id: 'F003', name: 'Prof. C Singh', email: 'csingh@college.com', branch: 'CSE (AI & ML)', role: 'Faculty', password: 'prof123' },
  { id: 'F004', name: 'Prof. D Khan', email: 'dkhan@college.com', branch: 'CS & AM', role: 'Faculty', password: 'prof123' },
  { id: 'F005', name: 'Dr. Admin', email: 'admin@college.com', branch: '-', role: 'Admin', password: 'admin123' },
];

export const courses: Course[] = [
  { id: 'C101', courseName: 'Data Structures', branch: 'CSE', year: 'I', facultyId: 'F001' },
  { id: 'C102', courseName: 'Machine Learning', branch: 'CSE (AI & ML)', year: 'III', facultyId: 'F003' },
  { id: 'C103', courseName: 'Database Systems', branch: 'CSE (Data Science)', year: 'II', facultyId: 'F002' },
  { id: 'C104', courseName: 'Algorithms', branch: 'CS & AM', year: 'IV', facultyId: 'F004' },
  { id: 'C105', courseName: 'Software Engineering', branch: 'CSE', year: 'II', facultyId: 'F001' },
  { id: 'C106', courseName: 'Deep Learning', branch: 'CSE (AI & ML)', year: 'III', facultyId: 'F003' },
  { id: 'C107', courseName: 'Big Data Analytics', branch: 'CSE (Data Science)', year: 'III', facultyId: 'F002' },
  { id: 'C108', courseName: 'Computer Graphics', branch: 'CS & AM', year: 'II', facultyId: 'F004' },
];

export const attendance: Attendance[] = [
  { id: 'A001', date: '2025-01-15', studentId: 'S001', courseId: 'C101', status: 'Present', markedBy: 'arao@college.com' },
  { id: 'A002', date: '2025-01-15', studentId: 'S005', courseId: 'C105', status: 'Absent', markedBy: 'arao@college.com' },
  { id: 'A003', date: '2025-01-15', studentId: 'S002', courseId: 'C103', status: 'Present', markedBy: 'bdas@college.com' },
  { id: 'A004', date: '2025-01-15', studentId: 'S003', courseId: 'C102', status: 'Present', markedBy: 'csingh@college.com' },
  { id: 'A005', date: '2025-01-15', studentId: 'S004', courseId: 'C104', status: 'Present', markedBy: 'dkhan@college.com' },
  { id: 'A006', date: '2025-01-16', studentId: 'S001', courseId: 'C101', status: 'Present', markedBy: 'arao@college.com' },
  { id: 'A007', date: '2025-01-16', studentId: 'S007', courseId: 'C102', status: 'Absent', markedBy: 'csingh@college.com' },
  { id: 'A008', date: '2025-01-16', studentId: 'S006', courseId: 'C107', status: 'Present', markedBy: 'bdas@college.com' },
];

// Create login credentials from students and faculty
export const loginCredentials: LoginCredentials[] = [
  // Admin
  { email: 'admin@college.com', password: 'admin123', role: 'Admin', name: 'Dr. Admin', id: 'F005' },
  
  // Faculty
  ...faculty.filter(f => f.role === 'Faculty').map(f => ({
    email: f.email,
    password: f.password!,
    role: 'Faculty' as const,
    name: f.name,
    id: f.id
  })),
  
  // Students
  ...students.map(s => ({
    email: s.email,
    password: s.password!,
    role: 'Student' as const,
    name: s.name,
    id: s.id
  }))
];

export const users: User[] = [
  { email: 'admin@college.com', role: 'Admin', name: 'Dr. Admin' },
  { email: 'arao@college.com', role: 'Faculty', name: 'Prof. A Rao' },
  { email: 'bdas@college.com', role: 'Faculty', name: 'Prof. B Das' },
  { email: 'csingh@college.com', role: 'Faculty', name: 'Prof. C Singh' },
  { email: 'dkhan@college.com', role: 'Faculty', name: 'Prof. D Khan' },
  { email: 'alice@demo.com', role: 'Student', name: 'Alice Kumar' },
  { email: 'bob@demo.com', role: 'Student', name: 'Bob Singh' },
  { email: 'carol@demo.com', role: 'Student', name: 'Carol Thomas' },
];

// Helper functions for managing data
export const addStudent = (student: Student) => {
  students.push(student);
  loginCredentials.push({
    email: student.email,
    password: student.password!,
    role: 'Student',
    name: student.name,
    id: student.id
  });
};

export const addFaculty = (facultyMember: Faculty) => {
  faculty.push(facultyMember);
  loginCredentials.push({
    email: facultyMember.email,
    password: facultyMember.password!,
    role: 'Faculty',
    name: facultyMember.name,
    id: facultyMember.id
  });
};

export const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updatedStudent };
    
    // Update login credentials if email or password changed
    const credIndex = loginCredentials.findIndex(c => c.id === id);
    if (credIndex !== -1) {
      loginCredentials[credIndex] = {
        ...loginCredentials[credIndex],
        email: updatedStudent.email || loginCredentials[credIndex].email,
        password: updatedStudent.password || loginCredentials[credIndex].password,
        name: updatedStudent.name || loginCredentials[credIndex].name
      };
    }
  }
};

export const updateFaculty = (id: string, updatedFaculty: Partial<Faculty>) => {
  const index = faculty.findIndex(f => f.id === id);
  if (index !== -1) {
    faculty[index] = { ...faculty[index], ...updatedFaculty };
    
    // Update login credentials if email or password changed
    const credIndex = loginCredentials.findIndex(c => c.id === id);
    if (credIndex !== -1) {
      loginCredentials[credIndex] = {
        ...loginCredentials[credIndex],
        email: updatedFaculty.email || loginCredentials[credIndex].email,
        password: updatedFaculty.password || loginCredentials[credIndex].password,
        name: updatedFaculty.name || loginCredentials[credIndex].name
      };
    }
  }
};

export const deleteStudent = (id: string) => {
  const studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
    const credIndex = loginCredentials.findIndex(c => c.id === id);
    if (credIndex !== -1) {
      loginCredentials.splice(credIndex, 1);
    }
  }
};

export const deleteFaculty = (id: string) => {
  const facultyIndex = faculty.findIndex(f => f.id === id);
  if (facultyIndex !== -1) {
    faculty.splice(facultyIndex, 1);
    const credIndex = loginCredentials.findIndex(c => c.id === id);
    if (credIndex !== -1) {
      loginCredentials.splice(credIndex, 1);
    }
  }
};