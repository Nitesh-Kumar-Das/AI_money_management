'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WelcomeLoader } from '@/components';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // Show loader for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WelcomeLoader />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-100 text-gray-800 px-6 py-12">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-blue-700"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI Expense Tracker + Smart Budget Advisor
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your intelligent assistant for tracking expenses, reducing overspending,
          and building smart financial habits — powered by AI.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex justify-center space-x-6 mb-16">
          <Link
            href="/auth?mode=login"
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/auth?mode=signup"
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transition"
          >
            Get Started
          </Link>
        </div>

        {/* AI Features Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            🤖 How Our AI Helps You
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Analyzes your past spending patterns using AI models</li>
            <li>Predicts overspending categories and alerts you in advance</li>
            <li>Suggests budget plans based on your lifestyle and habits</li>
            <li>Recommends saving opportunities using intelligent insights</li>
            <li>Works as your personal financial assistant — anytime, anywhere</li>
          </ul>
        </motion.div>

        {/* Footer */}
        <p className="mt-16 text-sm text-gray-500">
          Built by Nitesh Kumar Das
        </p>
      </div>
    </main>
  );
}
