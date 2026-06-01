// FILE: frontend/src/components/sections/Contact.jsx
// Contact section with REAL API integration (Week 2)
// Used in: pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  fadeInUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  cardReveal,
  viewportOnce,
} from '../../utils/animations';

export default function Contact() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapUrl, setMapUrl] = useState(
    "https://maps.google.com/maps?q=Kolkata,West%20Bengal,India&t=&z=14&ie=UTF8&iwloc=&output=embed"
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapUrl(`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
        },
        (err) => {
          console.log("Geolocation error or permission denied, using default Kolkata location.", err);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit form');

      setSubmitted(true);
      setForm({ name: user?.name || '', email: user?.email || '', service: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-primary)', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: 80, alignItems: 'start',
        }} className="contact-grid-layout">

          {/* Left — Info: slides in from left */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="section-label">Get In Touch</div>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 700, color: 'var(--text-primary)',
              letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 24,
            }}>
              Let's build something <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>great.</em>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, marginBottom: 40 }}>
              Tell us about your project. We respond to every inquiry within 24 hours.
            </p>

            {/* Contact details — stagger in */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {[
                { label: 'Email',     value: 'contact@techhelpit.com', href: 'mailto:contact@techhelpit.com' },
                { label: 'Phone',     value: '+91 98765 43210', href: 'tel:+919876543210' },
                { label: 'Location',  value: 'Kolkata, West Bengal, IN' },
                { label: 'LinkedIn',  value: 'linkedin.com/company/techhelp-it-solutions', href: 'https://linkedin.com/company/techhelp-it-solutions' },
                { label: 'Facebook',  value: 'facebook.com/techhelp.it.solutions', href: 'https://facebook.com/techhelp.it.solutions' },
                { label: 'Instagram', value: 'instagram.com/techhelp.it.solutions', href: 'https://instagram.com/techhelp.it.solutions' },
              ].map(item => (
                <motion.div key={item.label} variants={fadeInUp} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--accent-color)', marginTop: 6, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {item.label}
                    </div>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{
                        fontSize: 15, color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.2s'
                      }}
                      onMouseEnter={e => e.target.style.color = 'var(--accent-color)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div style={{ fontSize: 15, color: 'var(--text-primary)' }}>{item.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Map embed */}
            <div style={{
              marginTop: 40, height: 220,
              border: '1px solid var(--border-color)',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <iframe
                title="Office Location Map"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Right — Form: slides in from right */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 4, padding: '44px 40px',
            }}
          >
            {/* ── AUTH GATE: not logged in ── */}
            {!user ? (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: 52, marginBottom: 20 }}>🔒</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Sign in to send a request
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
                  Create a free account or log in to submit an inquiry.<br />
                  We'll be able to track and respond to your message faster.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/signup" style={{
                    padding: '12px 28px', background: 'var(--accent-color)',
                    color: '#fff', borderRadius: 4, textDecoration: 'none',
                    fontSize: 14, fontWeight: 500,
                  }}>Create Free Account</Link>
                  <Link to="/login" style={{
                    padding: '12px 28px', background: 'transparent',
                    color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                    borderRadius: 4, textDecoration: 'none', fontSize: 14, fontWeight: 500,
                  }}>Sign In</Link>
                </div>
              </div>
            ) : submitted ? (

              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 40, color: 'var(--accent-color)', marginBottom: 16 }}>✓</div>
                <h3 style={{
                  fontFamily: 'Fraunces, serif', fontSize: 24,
                  color: 'var(--text-primary)', marginBottom: 12,
                }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 20 }}>
                  We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: '10px 24px',
                    background: 'var(--accent-color)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 3,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* ✅ Error message display */}
                {error && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 4,
                    padding: '11px 14px',
                    color: '#ef4444',
                    fontSize: 13,
                    marginBottom: 22,
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="form-name-email">
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Full Name
                    </label>
                    <input
                      name="name" type="text" required
                      placeholder="Rahul Das"
                      value={form.name} onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Email Address
                    </label>
                    <input
                      name="email" type="email" required
                      placeholder="rahul@startup.com"
                      value={form.email} onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Service Needed
                  </label>
                  <select
                    name="service" value={form.service} onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  >
                    <option value="" style={{ background: 'var(--bg-secondary)' }}>Select a service...</option>
                    <option value="web" style={{ background: 'var(--bg-secondary)' }}>Web Development</option>
                    <option value="app" style={{ background: 'var(--bg-secondary)' }}>App Development</option>
                    <option value="design" style={{ background: 'var(--bg-secondary)' }}>UI/UX Design</option>
                    <option value="marketing" style={{ background: 'var(--bg-secondary)' }}>Digital Marketing</option>
                  </select>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Your Message
                  </label>
                  <textarea
                    name="message" required rows={5}
                    placeholder="Tell us about your project..."
                    value={form.message} onChange={handleChange}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px',
                    background: loading ? 'var(--text-muted)' : 'var(--accent-color)',
                    color: '#fff', border: 'none', borderRadius: 3,
                    fontSize: 15, fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if(!loading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
                  onMouseLeave={e => { if(!loading) e.currentTarget.style.background = 'var(--accent-color)'; }}
                >
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .form-name-email {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}