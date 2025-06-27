import React, { useState } from 'react';
import { Users, BookOpen, GraduationCap, Calendar, BarChart3, UserPlus, Key } from 'lucide-react';
import { User } from '../../types';
import { students, faculty, courses, attendance } from '../../data/mockData';
import StudentManagement from './StudentManagement';
import FacultyManagement from './FacultyManagement';
import CourseManagement from './CourseManagement';
import AttendanceReports from './AttendanceReports';
import CredentialsManager from './CredentialsManager';

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'faculty', name: 'Faculty', icon: UserPlus },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'attendance', name: 'Attendance', icon: Calendar },
    { id: 'credentials', name: 'Credentials', icon: Key },
  ];

  const stats = [
    { name: 'Total Students', value: students.length, icon: Users, color: 'blue' },
    { name: 'Faculty Members', value: faculty.filter(f => f.role === 'Faculty').length, icon: UserPlus, color: 'green' },
    { name: 'Active Courses', value: courses.length, icon: BookOpen, color: 'purple' },
    { name: 'Attendance Records', value: attendance.length, icon: Calendar, color: 'orange' },
  ];

  const branchStats = students.reduce((acc, student) => {
    acc[student.branch] = (acc[student.branch] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <p className="mt-2 text-gray-600">Manage your institution's attendance system</p>
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
                    ? 'border-blue-500 text-blue-600'
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

          {/* Branch Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Student Distribution by Branch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(branchStats).map(([branch, count]) => (
                <div key={branch} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">{branch}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{count} students</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
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
                  {attendance.slice(0, 5).map((record) => {
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

      {activeTab === 'students' && <StudentManagement />}
      {activeTab === 'faculty' && <FacultyManagement />}
      {activeTab === 'courses' && <CourseManagement />}
      {activeTab === 'attendance' && <AttendanceReports />}
      {activeTab === 'credentials' && <CredentialsManager />}
    </div>
  );
}