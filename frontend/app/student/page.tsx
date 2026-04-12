'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { loginStudent } from '@/services/auth.api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginStudent({
        username: email,
        password,
      });

      console.log('Login success:', res);


      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('user_role', res.role);
      localStorage.setItem('username', res.username);
      localStorage.setItem('user_id', res.userID);

      router.push('/student/sections');

      // alert('Đăng nhập thành công');
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error?.response?.data?.detail || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#7AB2B2] flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center mb-10">
        <div className="mb-4">
          <img
            src="/img/paper-plane.png"
            alt="paper plane"
            className="w-32 h-32 mx-auto"
          />
        </div>

        <h1 className="text-4xl font-bold text-white tracking-wide">AttenLink</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <div className="mb-6">
          <label
            htmlFor="email"
            className="text-white text-sm font-medium mb-2 flex items-center gap-2"
          >
            <FiUser className="text-white/80" />
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type username or email"
            required
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          />
        </div>

        <div className="mb-8 relative">
          <label
            htmlFor="password"
            className="text-white text-sm font-medium mb-2 flex items-center gap-2"
          >
            <FiLock className="text-white/80" />
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition pr-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 flex items-center text-white/80 hover:text-white transition"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#088395] hover:bg-teal-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}