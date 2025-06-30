import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    PYTHON_ML_API_URL: process.env.PYTHON_ML_API_URL || 'http://localhost:8000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-expense-tracker',
  },
};

export default nextConfig;
