'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginTeacher } from '@/services/auth.api';
import { saveAuth } from '@/lib/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginTeacher({
        username,
        password,
      });

      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('user_role', res.role);
      localStorage.setItem('username', res.username);
      localStorage.setItem('user_id', res.userID);
      const auth = {
        userID: res.userID,
        access_token: res.access_token,
      };

      saveAuth(auth);

      router.push('/auth/home');
    } catch (error: any) {
      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map((item: any) => item.msg).join("\n"));
      } else {
        alert(detail || "Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 bg-[#09637E] rounded-full mb-4 overflow-hidden">
            <Image
              src="/img/group.png"
              alt="AttenLink Logo"
              fill
              className="object-cover"
              priority
              sizes="64px"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">AttenLink</h1>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-11"
                placeholder="admin123"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#09637E] text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}