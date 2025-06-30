'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const mainLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/add-expense', label: 'Add Expense', icon: '💰' },
    { href: '/budgets', label: 'Smart Budgets', icon: '🎯' },
    { href: '/about', label: 'About', icon: '📋' },
  ];

  const handleSignout = () => {
    localStorage.removeItem('userName');
    
    router.push('/auth');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white px-4 sm:px-8 py-3 sm:py-4 shadow-2xl backdrop-blur-sm border-b border-white/10 relative z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
            <span className="text-lg sm:text-2xl">💸</span>
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ExpenseTracker
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">Smart Budget Advisor</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex space-x-2">
          {mainLinks.map(({ href, label, icon }) => (
            <li key={href} className="relative">
              <Link href={href}>
                <motion.div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                    pathname === href
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg backdrop-blur-sm border border-blue-400/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-base">{icon}</span>
                  <span className="font-medium text-sm">{label}</span>
                </motion.div>
              </Link>
              {pathname === href && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Right Side - User Info & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User Welcome - Desktop Only */}
          {userName && (
            <div className="hidden xl:block bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
              <p className="text-xs text-gray-300">Welcome back,</p>
              <p className="font-semibold text-blue-300 text-sm">{userName}</p>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/20"
          >
            <span className="text-lg">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
          
          {/* Signout Button */}
          <motion.button
            onClick={handleSignout}
            className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base sm:text-lg">🚪</span>
            <span className="font-medium text-xs sm:text-base hidden sm:inline">Signout</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 shadow-xl"
        >
          <div className="px-4 py-4 space-y-2">
            {userName && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 mb-3">
                <p className="text-xs text-gray-300">Welcome back,</p>
                <p className="font-semibold text-blue-300 text-sm">{userName}</p>
              </div>
            )}
            {mainLinks.map(({ href, label, icon }) => (
              <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    pathname === href
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="font-medium">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
