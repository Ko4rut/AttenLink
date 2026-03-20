// app/login/page.tsx (hoặc component Login)
'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API login (NextAuth, Clerk, Firebase, Supabase, v.v.)
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#088395] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo + App Name */}
      <div className="flex flex-col items-center mb-10">
        {/* Logo máy bay giấy cam */}
        <div className="mb-4">
  <img 
    src="/img/paper-plane.png"
    alt="paper plane"
    className="w-32 h-32 mx-auto"
  />
</div>

        {/* Hoặc dùng image: <Image src="/paper-plane-orange.svg" alt="AttenLink Logo" width={120} height={120} /> */}
        
        <h1 className="text-4xl font-bold text-white tracking-wide">AttenLink</h1>
      </div>

      {/* Form Login */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Email Field */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
            <FiUser className="text-white/80" />
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dangthaitu2005@gmail.com"
            required
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          />
        </div>

        {/* Password Field */}
        <div className="mb-8 relative">
          <label htmlFor="password" className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
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

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#088395] hover:bg-teal-800 text-white font-semibold py-3.5 rounded-lg transition shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}