'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WelcomeLoader from '@/components/WelcomeLoader';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WelcomeLoader />;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI Expense Tracker
          <span className="block text-2xl md:text-3xl font-medium text-gray-500 mt-3">
            Smart Budget Advisor
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg md:text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your intelligent assistant for tracking expenses, reducing overspending,
          and building smart financial habits — powered by AI.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mb-20">
          <Link
            href="/auth?mode=login"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth?mode=signup"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* AI Features Section */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 p-8 text-left shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            How Our AI Helps You
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Analyzes your past spending patterns using AI models
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Predicts overspending categories and alerts you in advance
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Suggests budget plans based on your lifestyle and habits
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Recommends saving opportunities using intelligent insights
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Works as your personal financial assistant — anytime, anywhere
            </li>
          </ul>
        </motion.div>

        {/* Footer */}
        <p className="mt-16 text-sm text-gray-400">
          Built by Nitesh Kumar Das
        </p>
      </div>
    </main>
  );
}
