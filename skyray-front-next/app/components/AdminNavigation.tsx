'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  FolderOpen,
  Users,
  ImageIcon,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import logo from '@/public/skyraylogo.jpg';

interface AdminNavigationProps {
  onLogout?: () => void;
}

export default function AdminNavigation({ onLogout }: AdminNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for nav bar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Quotation', href: '/admin/quotation', icon: Zap },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-lg'
          : 'bg-white/95 backdrop-blur-sm shadow-sm'
      } border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0"
          >
            <Link href="/admin" className="flex items-center">
              <Image
                src={logo}
                alt="SkyRay Admin"
                height={48}
                width={150}
                className="h-10 md:h-12 w-auto transition-all duration-300"
              />
              <span className="ml-2 text-xs md:text-sm font-bold text-gray-900 hidden sm:inline">Admin</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.div key={item.href} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link href={item.href} className="relative group w-full">
                    <motion.div
                      className={`relative px-4 py-3 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 rounded-lg whitespace-nowrap ${
                        active
                          ? 'text-[#8B1538] bg-gradient-to-r from-[#8B1538]/10 to-[#D4AF37]/10'
                          : 'text-gray-600 group-hover:text-[#8B1538] group-hover:bg-gray-50'
                      }`}
                      whileHover={!active ? { x: 4 } : {}}
                    >
                      {/* Active Left Border Indicator */}
                      {active && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#8B1538] to-[#D4AF37] rounded-l-lg"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          style={{ originY: 0.5 }}
                        />
                      )}

                      <Icon className={`w-4 h-4 transition-all duration-300 ${active ? 'scale-110' : ''}`} />
                      {item.label}

                      {/* Active Indicator Dot */}
                      {active && (
                        <motion.div
                          className="ml-auto"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#8B1538] to-[#D4AF37]" />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLogout?.()}
              className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium hidden xl:inline">Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Nav Items */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                          active
                            ? 'text-[#8B1538] bg-gradient-to-r from-[#8B1538]/10 to-[#D4AF37]/10'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        whileHover={!active ? { x: 4 } : {}}
                      >
                        {/* Active Icon Glow */}
                        {active && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#8B1538] to-[#D4AF37] rounded-r-lg"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            style={{ originY: 0.5 }}
                          />
                        )}
                        <Icon className={`w-5 h-5 transition-all duration-300 ${active ? 'scale-110' : ''}`} />
                        {item.label}
                        {active && (
                          <motion.div
                            className="ml-auto"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          >
                            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#8B1538] to-[#D4AF37]" />
                          </motion.div>
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              {/* Mobile Logout */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 + 0.1, duration: 0.3 }}
                onClick={() => {
                  onLogout?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
