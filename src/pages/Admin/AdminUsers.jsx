// src/pages/Admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CONFIG } from '../../config';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/admins`, {
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error('Failed to load admins');
        
        const data = await res.json();
        setAdmins(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to create admin');
      
      const createdAdmin = await res.json();
      setAdmins([...admins, createdAdmin]);
      toast.success('Admin created successfully');
      setNewAdmin({ username: '', email: '', password: '', role: 'admin' });
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Users</h1>
        
        {/* Create Admin Form */}
        <form onSubmit={handleCreateAdmin} className="mb-8 bg-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Username"
              className="bg-gray-700 text-white px-4 py-2 rounded"
              value={newAdmin.username}
              onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-700 text-white px-4 py-2 rounded"
              value={newAdmin.email}
              onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-700 text-white px-4 py-2 rounded"
              value={newAdmin.password}
              onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
              required
            />
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded"
              value={newAdmin.role}
              onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
          >
            Create Admin
          </button>
        </form>

        {/* Admins List */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden text-gray-200">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">Username</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {admins.map(admin => (
                  <tr key={admin._id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">{admin.username}</td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full ${
                        admin.role === 'superadmin' 
                          ? 'bg-purple-700 text-purple-300' 
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full ${
                        admin.isActive
                          ? 'bg-green-700 text-green-300'
                          : 'bg-red-700 text-red-300'
                      }`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;