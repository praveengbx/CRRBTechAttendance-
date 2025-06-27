import React from 'react';
import { Calendar, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { User } from '../../types';
import { students, courses, attendance, faculty } from '../../data/mockData';

interface StudentDashboardProps {
  user: User;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const student = students.find(s => s.email === user.email);
  const myAttendance = attendance.filter(a => a.studentId === student?.id);
  
  // Get courses for this student's branch and year
  const myCourses = courses.filter(c => 
    c.branch === student?.branch && c.year === student?.year
  );

  const getAttendanceStats = () => {
    const total = myAttendance.length;
    const present = myAttendance.filter(a => a.status === 'Present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';
    
    return { total, present, absent: total - present, percentage };
  };

  const getCourseAttendance = (courseId: string) => {
    const courseAttendance = myAttendance.filter(a => a.courseId === courseId);
    const present = courseAttendance.filter(a => a.status === 'Present').length;
    const total = courseAttendance.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';
    
    return { present, total, percentage };
  };

  const getFacultyName = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    return facultyMember?.name || 'Unknown';
  };

  const stats = getAttendanceStats();

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
        {student && (
          <div className="mt-2 flex items-center space-x-4 text-gray-600">
            <span>Roll Number: {student.rollNumber}</span>
            <span>•</span>
            <span>{student.branch}</span>
            <span>•</span>
            <span>Year {student.year}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{myCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes Attended</p>
              <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes Missed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${getAttendanceBg(parseFloat(stats.percentage))}`}>
              <TrendingUp className={`h-6 w-6 ${getAttendanceColor(parseFloat(stats.percentage))}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className={`text-2xl font-bold ${getAttendanceColor(parseFloat(stats.percentage))}`}>
                {stats.percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course-wise Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Course-wise Attendance</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCourses.map((course) => {
              const courseStats = getCourseAttendance(course.id);
              const percentage = parseFloat(courseStats.percentage);
              
              return (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                      <p className="text-sm text-gray-600">Faculty: {getFacultyName(course.facultyId)}</p>
                    </div>
                    <span className={`text-lg font-bold ${getAttendanceColor(percentage)}`}>
                      {courseStats.percentage}%
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Attendance Progress</span>
                      <span>{courseStats.present}/{courseStats.total} classes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          percentage >= 80 ? 'bg-green-600' :
                          percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">
                      Present: {courseStats.present}
                    </span>
                    <span className="text-red-600 font-medium">
                      Absent: {courseStats.total - courseStats.present}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Attendance Records</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myAttendance.slice(-10).reverse().map((record) => {
                const course = courses.find(c => c.id === record.courseId);
                const facultyMember = faculty.find(f => f.email === record.markedBy);
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course?.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{facultyMember?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'Present' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Goal */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Attendance Goal</h3>
            <p className="text-sm text-gray-600 mt-1">
              {parseFloat(stats.percentage) >= 75 
                ? "Great job! You're meeting the minimum attendance requirement."
                : "You need to improve your attendance to meet the 75% requirement."
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{stats.percentage}%</p>
            <p className="text-sm text-gray-600">of 75% required</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(parseFloat(stats.percentage) / 75 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}