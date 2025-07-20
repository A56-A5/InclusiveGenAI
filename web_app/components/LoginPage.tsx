
import React, { useState } from 'react';
import { login, signup } from '../services/authService';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'signup';

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let user: User | null = null;
      if (mode === 'login') {
        user = await login(username, password);
        if (!user) throw new Error('Invalid username or password.');
      } else {
        user = await signup(username, password);
      }
      onLoginSuccess(user!);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-md">
          <h1 className="text-4xl font-serif italic font-semibold text-center mb-6">sensora.ai</h1>
          <div className="flex border-b mb-6">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-center font-semibold ${mode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-center font-semibold ${mode === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-cyan-700 disabled:bg-cyan-300 flex justify-center items-center"
            >
              {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (mode === 'login' ? 'Log In' : 'Sign Up')}
            </button>
          </form>
        </div>
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>Try logging in with: <code className="bg-gray-200 p-1 rounded">alex_codes</code> / <code className="bg-gray-200 p-1 rounded">password1</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
