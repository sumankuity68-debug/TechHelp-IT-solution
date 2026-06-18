// FILE: frontend/src/components/sections/ExpertPortalHome.jsx
// Shown to expert users on the home page instead of the marketing Hero.
// Same color theme — focused on their work portal.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { expertsAPI } from '../../utils/api';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ExpertPortalHome() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await expertsAPI.getMyInquiries();
        setInquiries(data.data || []);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const newCount      = inquiries.filter(i => i.status === 'new').length;
  const reviewCount   = inquiries.filter(i => i.status === 'read').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved').length;
  const firstName     = user?.name?.split(' ')[0] || 'Expert';

  const statCards = [
    { label: 'New Queries',    value: newCount,      icon: '⚡', color: '#3b82f6', accent: newCount > 0 },
    { label: 'In Review',      value: reviewCount,   icon: '⏳', color: '#f59e0b', accent: false },
    { label: 'Resolved',       value: resolvedCount, icon: '✅', color: '#10b981', accent: false },
    { label: 'Total Assigned', value: inquiries.length, icon: '📬', color: '#8b5cf6', accent: false },
  ];

  const quickLinks = [
    { icon: '🛠️', label: 'Expert Portal',     sub: 'Manage your assigned cases',  path: '/expert/dashboard', color: '#3b82f6' },
    { icon: '📧', label: 'My Inquiries',       sub: `${inquiries.length} total queries`, path: '/expert/dashboard', color: '#10b981' },
    { icon: '🏠', label: 'Back to Site',       sub: 'View public website',         path: '/services',         color: '#8b5cf6' },
  ];

  return (
    <section style={{
      minHeight: '92vh',
      background: 'var(--bg-primary)',
      padding: '60px 5%',
      transition: 'background 0.3s',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible" style={{ marginBottom: 48 }}>
          <motion.div variants={fadeUp} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#10b981',
            background: 'rgba(16,185,129,0.08)', padding: '6px 16px',
            borderRadius: 20, marginBottom: 20,
          }}>
            <span style={{ width: 20, height: 1, background: '#10b981', display: 'block' }} />
            Expert Portal
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(34px,4.5vw,58px)',
            fontWeight: 700, lineHeight: 1.1,
            color: 'var(--text-primary)',
            letterSpacing: '-1.5px', marginBottom: 12,
          }}>
            Hello,{' '}
            <em style={{ fontStyle: 'italic', color: '#10b981' }}>{firstName}.</em>
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 520,
          }}>
            You're signed in as a <strong style={{ color: 'var(--text-primary)' }}>TechHelp Expert</strong>.
            Head to your portal to review assigned client inquiries and update their status.
          </motion.p>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 40 }}
        >
          {statCards.map(card => (
            <motion.div key={card.label} variants={fadeUp} style={{
              background: 'var(--bg-secondary)',
              border: `1px solid ${card.accent ? card.color + '40' : 'var(--border-color)'}`,
              borderRadius: 14, padding: '20px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: card.accent ? `0 4px 20px ${card.color}20` : '0 2px 12px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${card.color}15`, fontSize: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{card.icon}</div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: card.accent ? card.color : 'var(--text-primary)', margin: 0, lineHeight: 1 }}>
                  {loading ? '—' : card.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Quick Links ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h2 variants={fadeUp} style={{
            fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16,
          }}>
            Quick Access
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
            {quickLinks.map(link => (
              <motion.button
                key={link.label}
                variants={fadeUp}
                onClick={() => navigate(link.path)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 14, padding: '18px 20px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s', display: 'flex',
                  alignItems: 'center', gap: 14,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = link.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 10px 24px ${link.color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `${link.color}15`, fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{link.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{link.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{link.sub}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 16 }}>→</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Expert note ── */}
        {newCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            style={{
              marginTop: 40, padding: '16px 22px',
              background: 'rgba(59,130,246,0.07)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>⚡</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              You have <strong style={{ color: '#3b82f6' }}>{newCount} new {newCount === 1 ? 'inquiry' : 'inquiries'}</strong> waiting for your response.
            </span>
            <button
              onClick={() => navigate('/expert/dashboard')}
              style={{
                marginLeft: 'auto', padding: '8px 16px',
                background: '#3b82f6', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              View Now →
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
