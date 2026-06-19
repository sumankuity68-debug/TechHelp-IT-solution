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

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'all 0.2s ease',
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '60px 5%',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.3s'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '1100px',
          background: 'var(--bg-primary)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Left Side: Information */}
        <div style={{
          background: 'linear-gradient(135deg, var(--logo-blue-mid), var(--logo-blue-end))',
          padding: '60px 50px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>
              Expert Consultation
            </span>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '36px',
              fontWeight: '700',
              lineHeight: '1.2',
              marginBottom: '20px'
            }}>
              Let's Build Something Great.
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>
              Schedule a 1-on-1 strategy session with our technical experts to discuss your vision, architecture, and roadmap.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { icon: '💡', title: 'Project Scoping', desc: 'Define your requirements and goals' },
                { icon: '🛠️', title: 'Technical Review', desc: 'Evaluate stack and architecture choices' },
                { icon: '🚀', title: 'Actionable Plan', desc: 'Get a clear roadmap for execution' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={{ padding: '60px 50px', background: 'var(--bg-primary)' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Book Your Slot
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              Fill in the details below and we'll confirm your meeting shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label style={labelStyle}>Meeting Topic / Reason</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. E-commerce Website Architecture"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Select Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
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
