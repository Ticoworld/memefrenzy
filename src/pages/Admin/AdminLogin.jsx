import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CONFIG } from '../../config';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please try again.');
      }

      // Success handling
      toast.success('Login successful! Redirecting...', {
        icon: '✅',
        style: {
          background: '#2d3748',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px'
        }
      });

      // Redirect after short delay
      setTimeout(() => navigate('/admin/dashboard'), 1500);

    } catch (error) {
      // Error handling
      const errorMessage = error.message || 'Connection error. Please try again later.';
      
      toast.error(errorMessage, {
        icon: '❌',
        style: {
          background: '#2d3748',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px'
        },
        position: 'bottom-center'
      });

      // Clear password field on error
      setFormData(prev => ({ ...prev, password: '' }));

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Admin Portal
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter admin username"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter admin password"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          Secure admin access only. Unauthorized attempts will be logged.
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;