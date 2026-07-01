'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  PlusCircleIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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
    { href: '/dashboard', label: 'Dashboard', Icon: ChartBarIcon },
    { href: '/add-expense', label: 'Add Expense', Icon: PlusCircleIcon },
    { href: '/budgets', label: 'Budgets', Icon: AdjustmentsHorizontalIcon },
    { href: '/about', label: 'About', Icon: InformationCircleIcon },
  ];

  const handleSignout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-800 relative z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm sm:text-base">ET</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              ExpenseTracker
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">Smart Budget Advisor</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex space-x-1">
          {mainLinks.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href}>
                <motion.div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    pathname === href
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{label}</span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* User Welcome */}
          {userName && (
            <div className="hidden xl:block text-right">
              <p className="text-xs text-gray-500">Welcome,</p>
              <p className="font-medium text-gray-300 text-sm">{userName}</p>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>
          
          {/* Signout Button */}
          <motion.button
            onClick={handleSignout}
            className="flex items-center space-x-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            <span className="font-medium text-sm hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800"
        >
          <div className="px-4 py-3 space-y-1">
            {userName && (
              <div className="px-3 py-2 mb-2">
                <p className="text-xs text-gray-500">Welcome,</p>
                <p className="font-medium text-gray-300 text-sm">{userName}</p>
              </div>
            )}
            {mainLinks.map(({ href, label, Icon }) => (
              <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    pathname === href
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
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
