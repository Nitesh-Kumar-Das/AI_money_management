'use client';

import { useEffect, useState } from 'react';
import {
  EnvelopeIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function About() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm text-center">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">
            Thank You{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">
            Thank you for choosing our AI Expense Tracker. We&apos;re committed to helping you achieve 
            your financial goals and build better spending habits.
          </p>
        </div>

        {/* About the Application */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Application</h2>
          
          <p className="text-gray-500 mb-6 leading-relaxed">
            <strong className="text-gray-900">AI Expense Tracker + Smart Budget Advisor</strong> is a modern 
            web application designed to empower individuals to take control of their finances. Financial 
            literacy and smart money management should be accessible to everyone.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Core Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Smart expense tracking</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Beautiful data visualization</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>AI-powered insights</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Secure user authentication</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Personalized recommendations</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Built With
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Next.js 15 + TypeScript</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Tailwind CSS</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Framer Motion</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>MongoDB Database</li>
                <li className="flex items-center"><span className="w-1 h-1 bg-gray-400 rounded-full mr-2.5"></span>Machine Learning Integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Developer Information */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About the Developer</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-5">
              <p className="text-gray-500 leading-relaxed mb-3">
                I&apos;m a passionate full-stack developer dedicated to creating meaningful applications that solve real-world problems. 
                This expense tracker was born from my own need to better manage finances, and I wanted to share 
                this solution with others who face similar challenges.
              </p>
              <p className="text-gray-500 leading-relaxed">
                My goal is to make financial management accessible, intuitive, and effective. Every feature 
                has been carefully crafted with the user experience in mind.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Mission</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                To empower individuals with the tools and insights they need to achieve financial wellness 
                and build a secure future. Technology should make our lives better, not more complicated.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'TypeScript', 'MongoDB', 'AI/ML', 'UI/UX'].map(skill => (
                  <span key={skill} className="bg-white text-gray-600 px-3 py-1 rounded-md text-xs font-medium border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Connect */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Connect</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Have questions, suggestions, or just want to say hello?
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a 
              href="mailto:developer@expensetracker.com" 
              className="group bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <EnvelopeIcon className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <h4 className="text-sm font-medium text-gray-700">Email</h4>
            </a>

            <a 
              href="https://linkedin.com/in/expense-tracker-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <BriefcaseIcon className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <h4 className="text-sm font-medium text-gray-700">LinkedIn</h4>
            </a>

            <a 
              href="https://github.com/Nitesh-Kumar-Das" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <CodeBracketIcon className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <h4 className="text-sm font-medium text-gray-700">GitHub</h4>
            </a>

            <a 
              href="https://developer-portfolio.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <GlobeAltIcon className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <h4 className="text-sm font-medium text-gray-700">Portfolio</h4>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-3">Ready to Take Control of Your Finances?</h3>
          <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">
            Start tracking your expenses today and discover insights that will transform your financial future.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span>Track Expenses</span>
            <span className="text-gray-600">|</span>
            <span>Set Goals</span>
            <span className="text-gray-600">|</span>
            <span>Get Insights</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-gray-400 text-sm">
            Built for everyone who wants to build better financial habits.
          </p>
        </div>
      </div>
    </div>
  );
}
