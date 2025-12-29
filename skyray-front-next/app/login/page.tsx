"use client"; // Required for state management and framer-motion

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Standard Next.js import
import { Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Next.js router
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In Next.js, you would typically call an Auth Context or an API Route here.
    // For now, we simulate the logic from your App.tsx:
    const mockUser = {
      name: email.split('@')[0],
      email: email,
    };
    
    console.log("Logged in user:", mockUser);
    
    // Navigate to the home page after login
    router.push('/');
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#0a0a14] via-[#1a1a2e] to-[#0a0a14] flex items-center justify-center px-4">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,21,56,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,21,56,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-[#8B1538] to-[#D4AF37] p-8 text-white">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]"
            />
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Zap className="w-full h-full" />
              </motion.div>
              <h2 className="text-3xl text-center mb-2 font-bold">Welcome Back</h2>
              <p className="text-center text-white/80">Customer Login Portal</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-gray-700 font-medium">
                  Email Address
                </label>
                <motion.div
                  animate={{
                    boxShadow:
                      focusedField === 'email'
                        ? '0 0 0 3px rgba(139, 21, 56, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)'
                        : '0 0 0 0px rgba(139, 21, 56, 0)',
                  }}
                  className="relative rounded-lg"
                >
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538] transition-colors text-gray-900"
                    placeholder="your.email@example.com"
                    required
                  />
                </motion.div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-gray-700 font-medium">
                  Password
                </label>
                <motion.div
                  animate={{
                    boxShadow:
                      focusedField === 'password'
                        ? '0 0 0 3px rgba(139, 21, 56, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)'
                        : '0 0 0 0px rgba(139, 21, 56, 0)',
                  }}
                  className="relative rounded-lg"
                >
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538] transition-colors text-gray-900"
                    placeholder="••••••••"
                    required
                  />
                </motion.div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#8B1538] hover:text-[#D4AF37] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                className="group relative w-full py-3 bg-gradient-to-r from-[#8B1538] to-[#D4AF37] text-white rounded-lg overflow-hidden font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#8B1538]"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                New customer?{' '}
                <Link
                  href="/register"
                  className="text-[#8B1538] hover:text-[#D4AF37] transition-colors font-medium"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 w-full text-center">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}