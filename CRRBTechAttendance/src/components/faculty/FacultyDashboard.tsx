import React, { useState } from 'react';
import { BookOpen, Calendar, Users, CheckSquare } from 'lucide-react';
import { User } from '../../types';
import { courses, faculty, students, attendance } from '../../data/mockData';
import AttendanceForm from './AttendanceForm';
import MyCourses from './MyCourses';

interface FacultyDashboardProps {
  user: User;
}

export default function FacultyDashboard({ user }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const facultyMember = faculty.find(f => f.email === user.email);
  const myCourses = courses.filter(c => c.facultyId === facultyMember?.id);
  const myAttendanceRecords = attendance.filter(a => a.markedBy === user.email);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BookOpen },
    { id: 'courses', name: 'My Courses', icon: BookOpen },
    { id: 'attendance', name: 'Take Attendance', icon: CheckSquare },
  ];

  const stats = [
    { name: 'My Courses', value: myCourses.length, icon: BookOpen, color: 'blue' },
    { name: 'Students Taught', value: new Set(myAttendanceRecords.map(a => a.studentId)).size, icon: Users, color: 'green' },
    { name: 'Attendance Records', value: myAttendanceRecords.length, icon: Calendar, color: 'purple' },
    { name: 'Recent Classes', value: new Set(myAttendanceRecords.map(a => a.date)).size, icon: CheckSquare, color: 'orange' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
        <p className="mt-2 text-gray-600">Manage your courses and track attendance</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* My Courses Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">My Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((course) => (
                <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{course.branch} - Year {course.year}</p>
                  <p className="text-xs text-gray-500 mt-2">Course ID: {course.id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Attendance Records</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myAttendanceRecords.slice(0, 5).map((record) => {
                    const student = students.find(s => s.id === record.studentId);
                    const course = courses.find(c => c.id === record.courseId);
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course?.courseName}</td>
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
        </div>
      )}

      {activeTab === 'courses' && <MyCourses facultyEmail={user.email} />}
      {activeTab === 'attendance' && <AttendanceForm facultyEmail={user.email} />}
    </div>
  );
}