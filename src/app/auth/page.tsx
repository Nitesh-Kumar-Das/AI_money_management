'use client';

import './auth.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');

  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    fullName: '', 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsFlipped(mode === 'signup');
    setError('');
  }, [mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
      }

      router.push(`/welcome?name=${encodeURIComponent(data.user.name)}`);
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
      }

      router.push(`/welcome?name=${encodeURIComponent(data.user.name)}`);
    } catch (error: unknown) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className={`flip-container ${isFlipped ? 'flip' : ''}`}>
        <div className="flipper w-[360px] min-h-[460px] relative">
          {/* Login Side */}
          <div className="front bg-white/70 backdrop-blur-xl shadow-2xl rounded-xl px-8 py-10">
            <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Welcome Back</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="text-sm text-center mt-4 text-gray-700">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => {
                  setIsFlipped(true);
                  setError('');
                }}
                className="text-blue-600 underline"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Signup Side */}
          <div className="back bg-white/70 backdrop-blur-xl shadow-2xl rounded-xl px-8 py-10">
            <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Create Account</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.fullName}
                onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Signup'}
              </button>
            </form>
            <p className="text-sm text-center mt-4 text-gray-700">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setError('');
                }}
                className="text-blue-600 underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
