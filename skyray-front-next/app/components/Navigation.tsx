"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import Link from 'next/link'; //
import Image from 'next/image'; //
import { usePathname } from 'next/navigation'; //
import logo from '@/public/skyraylogo.jpg';

// In Next.js, we don't pass navigation props manually. 
// These values should eventually come from your Context Providers.
interface NavigationProps {
  user: { name: string } | null;
  onLogout?: () => void; // Now it is optional
  cartCount: number;
}

export default function Navigation({ user, onLogout, cartCount }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Replaces 'currentPage' prop

  const navItems = [
    { label: 'Home', href: '/main' },
    { label: 'About Us', href: '/main/about' },
    { label: 'Our Services', href: '/main/services' },
    { label: 'Projects', href: '/main/projects' },
    { label: 'Gallery', href: '/main/gallery' },
    { label: 'Contact', href: '/main/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo with Next.js Link */}
          <Link href="/main" className="flex items-center cursor-pointer">
            <Image
              src={logo}
              alt="SkyRay Engineering Solutions"
              height={48}
              width={150}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href; // Check active state
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 transition-colors ${
                    isActive ? 'text-[#8B1538]' : 'text-gray-700 hover:text-[#8B1538]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B1538] to-[#D4AF37]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/main/quotation" className="px-4 py-2 text-[#8B1538] hover:text-[#D4AF37]">
                  Request Quote
                </Link>
                <Link href="/main/cart" className="relative p-2 text-gray-700 hover:text-[#8B1538]">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#8B1538] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-[#8B1538]" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
                <button 
                  onClick={() => onLogout?.()} // Added optional chaining to safely call if it exists
                  className="p-2 text-gray-700 hover:text-[#8B1538]"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#D4AF37] text-white rounded-lg"
              >
                Customer Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Content (Simplified) */}
      {mobileMenuOpen && (
         <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
             {navItems.map((item) => (
                 <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2"
                 >
                    {item.label}
                 </Link>
             ))}
         </div>
      )}
    </nav>
  );
}