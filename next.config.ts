import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: false,
  },
  env: {
    AI_ML_API_URL: process.env.AI_ML_API_URL || process.env.PYTHON_ML_API_URL || 'http://localhost:8000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-expense-tracker',
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
