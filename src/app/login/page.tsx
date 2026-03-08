'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Invalid credentials');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#1A1712]">
      <Toaster position="top-right" />
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 border border-[#E5E5E0] shadow-sm rounded">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#E8540A]">WKP Admin</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none transition-colors"
            />
          </div>
          <button type="submit" className="w-full bg-[#E8540A] text-white p-2 rounded hover:bg-[#c94607] transition-colors focus:border-[#E8540A] border-2 border-transparent outline-none">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
