'use client';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        className="text-3xl md:text-5xl font-bold mb-8 tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        Loading...
      </motion.h1>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="h-12 w-12 border-2 border-gray-300 border-t-gray-900 rounded-full"
      />
    </motion.div>
  );
}
