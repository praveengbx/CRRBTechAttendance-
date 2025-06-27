import React, { useState } from 'react';
import { User } from './types';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import StudentDashboard from './components/student/StudentDashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      
      {user.role === 'Admin' && <AdminDashboard user={user} />}
      {user.role === 'Faculty' && <FacultyDashboard user={user} />}
      {user.role === 'Student' && <StudentDashboard user={user} />}
    </div>
  );
}

export default App;