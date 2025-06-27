import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, BookOpen, UserCircle } from 'lucide-react';
import { courses, faculty } from '../../data/mockData';
import { Course, Branch, Year } from '../../types';

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const branches: Branch[] = ['CSE', 'CSE (Data Science)', 'CSE (AI & ML)', 'CS & AM'];
  const years: Year[] = ['I', 'II', 'III', 'IV'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !selectedBranch || course.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const getFacultyName = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    return facultyMember?.name || 'Unknown';
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{course.courseName}</h3>
                  <p className="text-sm text-gray-500">Course ID: {course.id}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors duration-200">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200">
                  <Trash2 className="h-4 w-4" />
                </button>
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
                <span className="text-sm text-gray-600">Faculty:</span>
                <div className="flex items-center">
                  <UserCircle className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{getFacultyName(course.facultyId)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Course Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {branches.map(branch => {
            const branchCourses = courses.filter(c => c.branch === branch);
            return (
              <div key={branch} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">{branch}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{branchCourses.length} courses</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Add Course */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Course</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Faculty</option>
                  {faculty.filter(f => f.role === 'Faculty').map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </form>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}