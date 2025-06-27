import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, UserCircle, Mail, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { faculty, addFaculty, updateFaculty, deleteFaculty } from '../../data/mockData';
import { Faculty, Branch } from '../../types';

export default function FacultyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [showCredentials, setShowCredentials] = useState<string | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    password: ''
  });

  const branches: Branch[] = ['CSE', 'CSE (Data Science)', 'CSE (AI & ML)', 'CS & AM'];

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !selectedBranch || member.branch === selectedBranch;
    return matchesSearch && matchesBranch && member.role === 'Faculty';
  });

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateFacultyId = () => {
    const maxId = Math.max(...faculty.map(f => parseInt(f.id.substring(1))));
    return `F${String(maxId + 1).padStart(3, '0')}`;
  };

  const handleAddFaculty = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      email: '',
      branch: '',
      password: generatePassword()
    });
    setShowModal(true);
  };

  const handleEditFaculty = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember);
    setFormData({
      name: facultyMember.name,
      email: facultyMember.email,
      branch: facultyMember.branch,
      password: facultyMember.password || generatePassword()
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingFaculty) {
      // Update existing faculty
      updateFaculty(editingFaculty.id, {
        ...formData,
        id: editingFaculty.id,
        role: 'Faculty'
      });
    } else {
      // Add new faculty
      const newFaculty: Faculty = {
        id: generateFacultyId(),
        ...formData,
        role: 'Faculty'
      };
      addFaculty(newFaculty);
    }
    
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      branch: '',
      password: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      deleteFaculty(id);
    }
  };

  const copyCredentials = async (email: string, password: string, facultyId: string) => {
    const credentials = `Email: ${email}\nPassword: ${password}`;
    try {
      await navigator.clipboard.writeText(credentials);
      setCopiedCredentials(facultyId);
      setTimeout(() => setCopiedCredentials(null), 2000);
    } catch (err) {
      console.error('Failed to copy credentials:', err);
    }
  };

  const getBranchColor = (branch: string) => {
    if (branch === '-') return 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
        <button
          onClick={handleAddFaculty}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Faculty
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Faculty Members ({filteredFaculty.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Credentials</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircle className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBranchColor(member.branch)}`}>
                      {member.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowCredentials(showCredentials === member.id ? null : member.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                        title="Show/Hide Credentials"
                      >
                        {showCredentials === member.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyCredentials(member.email, member.password || '', member.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                        title="Copy Credentials"
                      >
                        {copiedCredentials === member.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    {showCredentials === member.id && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div><strong>Email:</strong> {member.email}</div>
                        <div><strong>Password:</strong> {member.password}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3 courses
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditFaculty(member)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Faculty */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, password: generatePassword()})}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Generate
                  </button>
                </div>
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
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {editingFaculty ? 'Update' : 'Add'} Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}