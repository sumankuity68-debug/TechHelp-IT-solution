// FILE: frontend/src/components/sections/Services.jsx
// Services grid with 3D tilt cards + Ask an Expert inquiry modal + Framer Motion animations

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  staggerContainerSlow,
  cardReveal,
  slideInLeft,
  viewportOnce,
} from '../../utils/animations';

const defaultServices = [
  {
    number: '01',
    title: 'Web & Enterprise Systems',
    desc: 'Scalable web applications built with React, Node.js, and MongoDB. Secure architectures, fast load times, and cloud integration.',
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    inquiries: 148,
    expert: { name: 'Prietish Patahk', role: 'Senior Full-Stack Engineer', avatar: 'PP', email: 'prietish12@gmail.com', phone: '91 75950 42847' },
    color: '#3b82f6',
  },
  {
    number: '02',
    title: 'Custom Software & APIs',
    desc: 'High-performance API design, microservices orchestration, and database tuning to drive your core operational needs.',
    tags: ['Microservices', 'GraphQL', 'Express', 'SQL/NoSQL'],
    inquiries: 94,
    expert: { name: 'Soumyadip Dey', role: 'Backend Architecture Lead', avatar: 'SD', email: 'kutidey00677@gmail.com', phone: '9007597461' },
    color: '#8b5cf6',
  },
  {
    number: '03',
    title: 'Cloud & DevOps Solutions',
    desc: 'Reliable cloud migrations, CI/CD pipeline automation, and containerized configurations for uninterrupted operations.',
    tags: ['AWS', 'Docker', 'GitHub Actions', 'Serverless'],
    inquiries: 112,
    expert: { name: 'Aritra Hazra', role: 'Cloud Infrastructure Architect', avatar: 'AH', email: 'aritrahazra701@gmail.com', phone: '90075 06883' },
    color: '#10b981',
  },
  {
    number: '04',
    title: 'Digital Experience & UI',
    desc: 'Intuitive interface designs that map out seamless user flows. Interactive prototypes and stunning visuals designed for conversions.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
    inquiries: 73,
    expert: { name: 'Sneha Das', role: 'Lead UX Designer', avatar: 'SD', email: 'sneha.ux@example.com', phone: '9999988888' },
    color: '#f59e0b',
  },
];

// ── Ask Expert Modal ─────────────────────────────────────────────────────────
function AskExpertModal({ service, onClose }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    service: service.title,
    message: '',
    preferences: '',
  });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) { setError('Please write your question'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          expertId: service.expert._id || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 6, color: 'var(--text-primary)',
    fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Modal box */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'modalIn 0.2s ease',
        }}
      >
        {/* Header bar */}
        <div style={{
          padding: '20px 24px 18px',
          borderBottom: '1px solid var(--border-color)',
          background: `linear-gradient(135deg, ${service.color}18, transparent)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: service.color, textTransform: 'uppercase', marginBottom: 4 }}>
              Ask an Expert · Service {service.number}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {service.title}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{
            width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)', color: 'var(--text-secondary)',
            fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {/* Expert badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 8, padding: '12px 14px', marginBottom: 20,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: service.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{service.expert.avatar}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {service.expert.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {service.expert.role}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {service.expert.email && <span>📧 {service.expert.email}</span>}
                {service.expert.phone && <span>📞 {service.expert.phone}</span>}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 500 }}>Online</span>
            </div>
          </div>

          {/* If not logged in — gate */}
          {!user ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                Please sign in to ask our expert a question.<br />
                We'll reply directly to your email.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Link to="/login" onClick={onClose} style={{
                  padding: '10px 22px', background: service.color,
                  color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 500,
                }}>Sign In</Link>
                <Link to="/signup" onClick={onClose} style={{
                  padding: '10px 22px', background: 'transparent',
                  color: 'var(--text-primary)', border: '1px solid var(--border-color)',
                  borderRadius: 6, textDecoration: 'none', fontSize: 13,
                }}>Create Account</Link>
              </div>
            </div>
          ) : submitted ? (
            // Success state
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(16,185,129,0.12)',
                border: '2px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, margin: '0 auto 16px',
              }}>✓</div>
              <h4 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Question Sent!
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                <strong>{service.expert.name}</strong> will reply to <strong>{form.email}</strong> within 24 hours.
              </p>
              <button onClick={onClose} style={{
                padding: '10px 24px', background: service.color,
                color: '#fff', border: 'none', borderRadius: 6,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>Done</button>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 6, padding: '10px 14px', color: '#ef4444',
                  fontSize: 13, marginBottom: 16,
                }}>{error}</div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Name
                  </label>
                  <input
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required placeholder="Full name" style={inp}
                    onFocus={e => e.target.style.borderColor = service.color}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Reply Email
                  </label>
                  <input
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required type="email" placeholder="you@example.com" style={inp}
                    onFocus={e => e.target.style.borderColor = service.color}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tech Preferences / Frameworks
                </label>
                <input
                  value={form.preferences} onChange={e => setForm(p => ({ ...p, preferences: e.target.value }))}
                  placeholder="e.g. React, Node.js, Python, Figma (optional)"
                  style={inp}
                  onFocus={e => e.target.style.borderColor = service.color}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Question
                </label>
                <textarea
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required rows={4} placeholder={`Ask anything about ${service.title}...`}
                  style={{ ...inp, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = service.color}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px',
                background: loading ? `${service.color}80` : service.color,
                color: '#fff', border: 'none', borderRadius: 6,
                fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}>
                {loading ? 'Sending...' : `📩 Send to ${service.expert.name.split(' ')[0]}`}
              </button>

              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
                Replies within 24 hours · No spam, ever
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ s }) {
  const [tilt,     setTilt]    = useState({ x: 0, y: 0 });
  const [hovered,  setHovered] = useState(false);
  const [showModal, setModal]  = useState(false);

  const handleMouseMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width - 0.5;
    const py = (e.clientY - box.top) / box.height - 0.5;
    setTilt({ x: -py * 12, y: px * 12 });
  };

  return (
    <>
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 8, padding: '40px 36px',
          cursor: 'default', position: 'relative', overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: hovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
          transition: hovered
            ? 'transform 0.1s ease-out, box-shadow 0.3s'
            : 'transform 0.5s ease-out, box-shadow 0.3s',
          boxShadow: hovered
            ? `0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px ${s.color}22`
            : '0 4px 12px rgba(0,0,0,0.05)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      >
        {/* Glow */}
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            background: `radial-gradient(circle at ${tilt.y * 10 + 50}% ${-tilt.x * 10 + 50}%, ${s.color}08 0%, transparent 60%)`,
          }} />
        )}

        {/* Watermark number */}
        <div style={{
          fontFamily: 'Fraunces, serif', fontSize: 88, fontWeight: 700,
          color: `${s.color}06`,
          position: 'absolute', top: 8, right: 16, lineHeight: 1, userSelect: 'none',
          transform: hovered ? `translate3d(${-tilt.y * 1.5}px, ${tilt.x * 1.5}px, 15px)` : 'translate3d(0,0,0)',
          transition: 'transform 0.1s ease-out', zIndex: 0,
        }}>{s.number}</div>

        {/* Content */}
        <div style={{
          transform: hovered ? 'translateZ(30px)' : 'translateZ(0px)',
          transition: 'transform 0.2s ease-out', zIndex: 2, position: 'relative',
        }}>
          {/* Number label */}
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', color: s.color, marginBottom: 20 }}>
            {s.number}
          </div>

          {/* Title */}
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            {s.title}
          </h3>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75, marginBottom: 24 }}>
            {s.desc}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {s.tags.map(tag => (
              <span key={tag} style={{
                padding: '4px 12px', border: '1px solid var(--border-color)',
                borderRadius: 3, fontSize: 12, color: 'var(--text-secondary)',
              }}>{tag}</span>
            ))}
          </div>

          {/* Inquiry count */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: `${s.color}10`, border: `1px solid ${s.color}25`,
            borderRadius: 20, padding: '5px 12px', marginBottom: 20,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0,
              boxShadow: '0 0 0 2px rgba(16,185,129,0.25)', animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              <strong style={{ color: s.color }}>{s.inquiries}</strong> inquiries this month
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 18 }} />

          {/* Expert preview row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{s.expert.avatar}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.expert.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.expert.role.split(' ').slice(0, 2).join(' ')}</div>
              </div>
            </div>

            {/* Ask Expert button */}
            <button
              onClick={() => setModal(true)}
              style={{
                padding: '8px 16px',
                background: s.color,
                color: '#fff', border: 'none', borderRadius: 6,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Ask Expert →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <AskExpertModal service={s} onClose={() => setModal(false)} />}
    </>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────
export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) {
          setItems(data.data);
        } else {
          setItems(defaultServices.map((ds, idx) => ({
            _id: `default-${idx}`,
            num: ds.number,
            title: ds.title,
            description: ds.desc,
            tags: ds.tags,
            isActive: true
          })));
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setItems(defaultServices.map((ds, idx) => ({
          _id: `default-${idx}`,
          num: ds.number,
          title: ds.title,
          description: ds.desc,
          tags: ds.tags,
          isActive: true
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const mapService = (s, index) => {
    const matched = defaultServices.find(ds => ds.number === s.num);
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
    
    // Set default fallback or use populated expert
    let expertInfo = matched ? matched.expert : defaultServices[index % defaultServices.length].expert;
    
    if (s.expert) {
      const initials = s.expert.name ? s.expert.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'EX';
      expertInfo = {
        _id: s.expert._id,
        name: s.expert.name,
        role: s.expert.role,
        avatar: initials,
        email: s.expert.email,
        phone: s.expert.phone
      };
    }

    return {
      _id: s._id,
      number: s.num || `0${index + 1}`,
      title: s.title,
      desc: s.description,
      tags: s.tags || [],
      inquiries: matched ? matched.inquiries : (100 + (index * 15) % 80),
      expert: expertInfo,
      color: matched ? matched.color : colors[index % colors.length],
    };
  };

  if (loading) {
    return (
      <section id="services" className="section" style={{ background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 60 }}>
            <div className="section-label">What We Do</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
              <div className="skeleton" style={{ width: '400px', height: '40px', marginBottom: '10px' }} />
              <div className="skeleton" style={{ width: '300px', height: '20px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '40px 36px', height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="skeleton" style={{ width: '30px', height: '14px', marginBottom: '20px' }} />
                  <div className="skeleton" style={{ width: '70%', height: '22px', marginBottom: '16px' }} />
                  <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '10px' }} />
                  <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '24px' }} />
                  <div style={{ display: 'flex', gap: 8, marginBottom: '20px' }}>
                    <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '50px', height: '20px', borderRadius: '4px' }} />
                  </div>
                </div>
                <div>
                  <div className="skeleton" style={{ width: '100px', height: '24px', borderRadius: '20px', marginBottom: '18px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <div className="skeleton" style={{ width: '80px', height: '14px' }} />
                    </div>
                    <div className="skeleton" style={{ width: '80px', height: '28px', borderRadius: '6px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section" style={{ background: 'var(--bg-primary)', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Animated section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ marginBottom: 60 }}
        >
          <motion.div variants={fadeIn} className="section-label">What We Do</motion.div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <motion.h2
              variants={fadeInUp}
              style={{
                fontFamily: 'Fraunces, serif', fontSize: 'clamp(32px, 4vw, 50px)',
                fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)',
                letterSpacing: '-1px', maxWidth: 480,
              }}
            >
              Enterprise solutions designed for <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>results.</em>
            </motion.h2>
            <motion.p variants={fadeInUp} style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 360, lineHeight: 1.7 }}>
              End-to-end IT services. Click <strong style={{ color: 'var(--accent-color)' }}>Ask Expert</strong> on any card to get answers directly from our specialists.
            </motion.p>
          </div>
        </motion.div>

        {/* Cards — stagger in on scroll */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}
        >
          {items.map((s, i) => (
            <motion.div key={s._id || i} variants={cardReveal}>
              <ServiceCard s={mapService(s, i)} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}
