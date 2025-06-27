import React, { useState } from 'react';
import { Calendar, CheckSquare, Users, Save } from 'lucide-react';
import { courses, faculty, students } from '../../data/mockData';
import { Student } from '../../types';

interface AttendanceFormProps {
  facultyEmail: string;
}

export default function AttendanceForm({ facultyEmail }: AttendanceFormProps) {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [isSaving, setIsSaving] = useState(false);

  const facultyMember = faculty.find(f => f.email === facultyEmail);
  const myCourses = courses.filter(c => c.facultyId === facultyMember?.id);
  
  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const eligibleStudents = selectedCourseData ? students.filter(s => 
    s.branch === selectedCourseData.branch && s.year === selectedCourseData.year
  ) : [];

  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const newAttendanceData: Record<string, 'Present' | 'Absent'> = {};
    eligibleStudents.forEach(student => {
      newAttendanceData[student.id] = status;
    });
    setAttendanceData(newAttendanceData);
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourse || !selectedDate) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically save to your backend
    console.log('Saving attendance:', {
      course: selectedCourse,
      date: selectedDate,
      attendance: attendanceData,
      markedBy: facultyEmail
    });
    
    setIsSaving(false);
    
    // Show success message (you could use a toast library here)
    alert('Attendance saved successfully!');
    
    // Reset form
    setAttendanceData({});
  };

  const getAttendanceStats = () => {
    const marked = Object.keys(attendanceData).length;
    const present = Object.values(attendanceData).filter(status => status === 'Present').length;
    const absent = marked - present;
    
    return { marked, present, absent, total: eligibleStudents.length };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Take Attendance</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Today: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Course and Date Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setAttendanceData({});
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Choose a course...</option>
              {myCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.courseName} ({course.branch} - Year {course.year})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* Stats and Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <CheckSquare className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-lg font-bold text-gray-900">{stats.present}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <CheckSquare className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-lg font-bold text-gray-900">{stats.absent}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <CheckSquare className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Marked</p>
                  <p className="text-lg font-bold text-gray-900">{stats.marked}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMarkAll('Present')}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors duration-200"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('Absent')}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  Mark All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Students ({eligibleStudents.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {eligibleStudents.map((student) => (
                <div key={student.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">Roll: {student.rollNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'Present')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          attendanceData[student.id] === 'Present'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'Absent')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          attendanceData[student.id] === 'Absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveAttendance}
              disabled={stats.marked === 0 || isSaving}
              className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                stats.marked === 0 || isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : `Save Attendance (${stats.marked}/${stats.total})`}
            </button>
          </div>
        </>
      )}

      {myCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses assigned</h3>
          <p className="text-gray-600">You need to have courses assigned to take attendance. Contact the admin.</p>
        </div>
      )}
    </div>
  );
}