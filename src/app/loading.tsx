'use client';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Welcome Text */}
      <motion.h1
        className="text-3xl md:text-5xl font-extrabold mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        Welcome to <span className="text-blue-700">Money Management</span>
      </motion.h1>

      {/* Rotating Loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full shadow-lg"
      />
    </motion.div>
  );
}
