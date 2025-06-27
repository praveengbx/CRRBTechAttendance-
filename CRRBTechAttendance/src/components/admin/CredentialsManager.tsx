import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Download, Mail } from 'lucide-react';
import { students, faculty, loginCredentials } from '../../data/mockData';

export default function CredentialsManager() {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedCredentials, setCopiedCredentials] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const allCredentials = loginCredentials.filter(cred => {
    if (selectedRole === 'all') return true;
    return cred.role.toLowerCase() === selectedRole;
  });

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyCredentials = async (email: string, password: string, id: string) => {
    const credentials = `Email: ${email}\nPassword: ${password}`;
    try {
      await navigator.clipboard.writeText(credentials);
      setCopiedCredentials(id);
      setTimeout(() => setCopiedCredentials(null), 2000);
    } catch (err) {
      console.error('Failed to copy credentials:', err);
    }
  };

  const exportCredentials = () => {
    const csvContent = [
      ['Name', 'Email', 'Password', 'Role'],
      ...allCredentials.map(cred => [
        cred.name,
        cred.email,
        cred.password,
        cred.role
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login-credentials-${selectedRole}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const sendCredentialsEmail = (email: string, password: string, name: string, role: string) => {
    const subject = encodeURIComponent('Your EduTrack Login Credentials');
    const body = encodeURIComponent(`Dear ${name},

Your login credentials for EduTrack Attendance Management System:

Email: ${email}
Password: ${password}
Role: ${role}

Please keep these credentials secure and do not share them with anyone.

You can access the system at: ${window.location.origin}

Best regards,
EduTrack Admin Team`);

    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Admin': 'bg-purple-100 text-purple-800',
      'Faculty': 'bg-green-100 text-green-800',
      'Student': 'bg-blue-100 text-blue-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Login Credentials Manager</h2>
        <button
          onClick={exportCredentials}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
          <span className="text-sm text-gray-500">
            Showing {allCredentials.length} credentials
          </span>
        </div>
      </div>

      {/* Credentials List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Login Credentials ({allCredentials.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allCredentials.map((cred) => (
                <tr key={cred.id || cred.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cred.name}</div>
                    <div className="text-sm text-gray-500">ID: {cred.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(cred.role)}`}>
                      {cred.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cred.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 font-mono">
                        {showPasswords[cred.id || cred.email] ? cred.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(cred.id || cred.email)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Toggle password visibility"
                      >
                        {showPasswords[cred.id || cred.email] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyCredentials(cred.email, cred.password, cred.id || cred.email)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                        title="Copy credentials"
                      >
                        {copiedCredentials === (cred.id || cred.email) ? 
                          <Check className="h-4 w-4" /> : 
                          <Copy className="h-4 w-4" />
                        }
                      </button>
                      <button
                        onClick={() => sendCredentialsEmail(cred.email, cred.password, cred.name, cred.role)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                        title="Send credentials via email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {loginCredentials.filter(c => c.role === 'Admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faculty Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {loginCredentials.filter(c => c.role === 'Faculty').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Student Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {loginCredentials.filter(c => c.role === 'Student').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">How to Share Credentials</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• <strong>Copy Button:</strong> Click to copy email and password to clipboard</p>
          <p>• <strong>Email Button:</strong> Opens your default email client with pre-filled credentials</p>
          <p>• <strong>Export CSV:</strong> Download all credentials as a spreadsheet file</p>
          <p>• <strong>Security:</strong> Always share credentials through secure channels</p>
        </div>
      </div>
    </div>
  );
}