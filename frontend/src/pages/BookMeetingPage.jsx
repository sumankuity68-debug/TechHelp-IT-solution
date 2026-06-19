import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { meetingsAPI } from '../utils/api';

export default function BookMeetingPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    topic: '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topic || !formData.date || !formData.time) {
      addToast('Please fill out all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await meetingsAPI.create(formData);
      if (data.success) {
        addToast('Meeting requested successfully! Check your dashboard for status updates.', 'success');
        setFormData({ topic: '', date: '', time: '' });
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to request meeting', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors flex items-center justify-center relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row relative z-10"
      >
        {/* Left Side: Information & Branding */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
                Expert Consultation
              </span>
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                Let's Build Something Great.
              </h2>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Schedule a 1-on-1 strategy session with our technical experts to discuss your vision, architecture, and roadmap.
              </p>
            </motion.div>

            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {[
                { icon: "💡", title: "Project Scoping", desc: "Define your requirements and goals" },
                { icon: "🛠️", title: "Technical Review", desc: "Evaluate stack and architecture choices" },
                { icon: "🚀", title: "Actionable Plan", desc: "Get a clear roadmap for execution" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-blue-100/80 text-sm mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-blue-100 italic">
              "The initial consultation saved us weeks of development time by steering us towards the right architecture immediately."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm">JS</div>
              <span className="text-sm font-medium">Jordan Smith, CTO</span>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="md:w-7/12 p-10 lg:p-14 bg-white dark:bg-gray-800 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Your Slot</h3>
            <p className="text-gray-500 dark:text-gray-400">Fill in the details below and we'll confirm your meeting shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Topic Input */}
            <div className="relative group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                Meeting Topic / Reason
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. E-commerce Website Architecture"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-500/30 text-gray-900 dark:text-white outline-none transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Date Input */}
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                  Select Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-500/30 text-gray-900 dark:text-white outline-none transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              {/* Time Input */}
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                  Preferred Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-500/30 text-gray-900 dark:text-white outline-none transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* User Info Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start space-x-3 border border-blue-100 dark:border-blue-800/50 mt-4">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p>We'll send a confirmation email to <strong>{user?.email}</strong> once your meeting is scheduled.</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 flex justify-center items-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
                {loading ? (
                  <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span className="flex items-center space-x-2 text-lg">
                    <span>Confirm Meeting Request</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </motion.button>
            </div>
            
          </form>
        </div>
      </motion.div>
    </div>
  );
}
