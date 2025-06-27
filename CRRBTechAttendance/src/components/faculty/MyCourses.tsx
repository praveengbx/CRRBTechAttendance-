import React from 'react';
import { BookOpen, Users } from 'lucide-react';
import { courses, faculty, students, attendance } from '../../data/mockData';

interface MyCoursesProps {
  facultyEmail: string;
}

export default function MyCourses({ facultyEmail }: MyCoursesProps) {
  const facultyMember = faculty.find(f => f.email === facultyEmail);
  const myCourses = courses.filter(c => c.facultyId === facultyMember?.id);

  const getCourseStats = (courseId: string) => {
    const courseStudents = students.filter(s => 
      s.branch === courses.find(c => c.id === courseId)?.branch &&
      s.year === courses.find(c => c.id === courseId)?.year
    );
    
    const courseAttendance = attendance.filter(a => a.courseId === courseId);
    const uniqueStudents = new Set(courseAttendance.map(a => a.studentId)).size;
    const totalClasses = new Set(courseAttendance.map(a => a.date)).size;
    
    return {
      totalStudents: courseStudents.length,
      attendedStudents: uniqueStudents,
      totalClasses
    };
  };

  const getBranchColor = (branch: string) => {
    const colors: Record<string, string> = {
      'CSE': 'bg-blue-100 text-blue-800',
      'CSE (Data Science)': 'bg-green-100 text-green-800',
      'CSE (AI & ML)': 'bg-purple-100 text-purple-800',
      'CS & AM': 'bg-orange-100 text-orange-800',
    };
    return colors[branch] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
        <span className="text-sm text-gray-600">{myCourses.length} courses assigned</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course) => {
          const stats = getCourseStats(course.id);
          return (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{course.courseName}</h3>
                    <p className="text-sm text-gray-500">Course ID: {course.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Branch:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBranchColor(course.branch)}`}>
                    {course.branch}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Year:</span>
                  <span className="text-sm font-medium text-gray-900">{course.year}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Students:</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{stats.totalStudents}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Classes Conducted:</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalClasses}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Students:</span>
                  <span className="text-sm font-medium text-gray-900">{stats.attendedStudents}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {myCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses assigned</h3>
          <p className="text-gray-600">You haven't been assigned any courses yet. Contact the admin to get courses assigned.</p>
        </div>
      )}
    </div>
  );
}