'use client';

import { useEffect, useState } from 'react';

export default function About() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Gratitude Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Thank You{userName ? `, ${userName}` : ''}!
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Thank you for choosing our AI Expense Tracker! Your trust in our application means the world to us. 
            We&apos;re committed to helping you achieve your financial goals and build better spending habits.
          </p>
        </div>

        {/* About the Application */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">💰</div>
            <h2 className="text-3xl font-bold text-gray-800">About This Application</h2>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            <strong className="text-blue-600">AI Expense Tracker + Smart Budget Advisor</strong> is a modern, 
            intuitive web application designed to empower individuals, especially students, to take control of 
            their finances. We believe that financial literacy and smart money management should be accessible to everyone.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                <span className="text-2xl mr-2">✨</span>
                Core Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Smart expense tracking</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Beautiful data visualization</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>AI-powered insights</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Secure user authentication</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Personalized recommendations</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <span className="text-2xl mr-2">🛠️</span>
                Built With
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>Next.js 14 + TypeScript</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>Tailwind CSS</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>Framer Motion</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>MongoDB Database</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>Machine Learning Integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Developer Information */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">👨‍💻</div>
            <h2 className="text-3xl font-bold text-gray-800">Meet the Developer</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Developer Profile */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">Hello, I&apos;m the Creator! 👋</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I&apos;m a passionate full-stack developer dedicated to creating meaningful applications that solve real-world problems. 
                  This expense tracker was born from my own need to better manage finances as a student, and I wanted to share 
                  this solution with others who face similar challenges.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  My goal is to make financial management accessible, intuitive, and even enjoyable. Every feature in this 
                  application has been carefully crafted with the user experience in mind.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                  <span className="text-xl mr-2">🎯</span>
                  My Mission
                </h4>
                <p className="text-gray-700">
                  To empower individuals with the tools and insights they need to achieve financial wellness and build a secure future. 
                  I believe technology should make our lives better, not more complicated.
                </p>
              </div>
            </div>

            {/* Contact & Skills */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">🚀</div>
                <h4 className="text-lg font-semibold text-orange-700 mb-2">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">React</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Node.js</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">TypeScript</span>
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">MongoDB</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">AI/ML</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">UI/UX</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">💝</div>
                <h4 className="text-lg font-semibold text-cyan-700 mb-2">Special Thanks</h4>
                <p className="text-sm text-gray-600">
                  To everyone who uses this app and provides feedback. Your support motivates me to keep improving and building better solutions!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connect with Developer */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Connect with the Developer</h2>
            <p className="text-gray-600 text-lg">
              Have questions, suggestions, or just want to say hi? I&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Email */}
            <a 
              href="mailto:developer@expensetracker.com" 
              className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📧</div>
              <h4 className="text-lg font-semibold text-red-700 mb-2">Email</h4>
              <p className="text-sm text-gray-600 break-all">developer@expensetracker.com</p>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/expense-tracker-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💼</div>
              <h4 className="text-lg font-semibold text-blue-700 mb-2">LinkedIn</h4>
              <p className="text-sm text-gray-600">Professional Network</p>
            </a>

            {/* GitHub */}
            <a 
              href="https://github.com/expense-tracker-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💻</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">GitHub</h4>
              <p className="text-sm text-gray-600">Code & Projects</p>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/expense_tracker_dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📸</div>
              <h4 className="text-lg font-semibold text-purple-700 mb-2">Instagram</h4>
              <p className="text-sm text-gray-600">Behind the Scenes</p>
            </a>
          </div>

          {/* Additional Social Links */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Twitter */}
            <a 
              href="https://twitter.com/ExpenseTrackerDev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🐦</div>
              <h4 className="text-md font-semibold text-sky-700 mb-1">Twitter</h4>
              <p className="text-xs text-gray-600">Updates & Thoughts</p>
            </a>

            {/* Portfolio */}
            <a 
              href="https://developer-portfolio.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌐</div>
              <h4 className="text-md font-semibold text-emerald-700 mb-1">Portfolio</h4>
              <p className="text-xs text-gray-600">My Other Work</p>
            </a>

            {/* Discord */}
            <a 
              href="https://discord.gg/expense-tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎮</div>
              <h4 className="text-md font-semibold text-indigo-700 mb-1">Discord</h4>
              <p className="text-xs text-gray-600">Community Chat</p>
            </a>
          </div>

          {/* Contact Message */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-l-4 border-yellow-400">
            <div className="flex items-start">
              <div className="text-2xl mr-3 mt-1">💡</div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-700 mb-2">Let&apos;s Connect!</h4>
                <p className="text-gray-700 leading-relaxed">
                  Whether you have feedback about the app, want to collaborate on a project, need help with your own development journey, 
                  or just want to chat about tech and finance, I&apos;m always excited to connect with fellow developers and users. 
                  Don&apos;t hesitate to reach out through any of the channels above!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-white text-center">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-2xl font-bold mb-4">Ready to Take Control of Your Finances?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Start tracking your expenses today and discover insights that will transform your financial future!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur rounded-2xl px-6 py-3">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm">Track Expenses</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl px-6 py-3">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm">Set Goals</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl px-6 py-3">
              <div className="text-2xl mb-1">💡</div>
              <div className="text-sm">Get Insights</div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            Made with ❤️ for everyone who wants to build better financial habits
          </p>
        </div>
      </div>
    </div>
  );
}
