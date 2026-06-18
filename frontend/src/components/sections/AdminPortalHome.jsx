// FILE: frontend/src/components/sections/AdminPortalHome.jsx
// Shown to admin users on the home page instead of the marketing Hero.
// Same color theme — no signup/get-started CTAs.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { contactAPI, usersAPI } from '../../utils/api';

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AdminPortalHome() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [stats, setStats]   = useState({ users: '—', inquiries: '—', pending: '—' });
  const [loading, setLoading] = useState(true);

  // Fetch quick stats
  useEffect(() => {
    (async () => {
      try {
        const [uData, cData] = await Promise.all([
          usersAPI.getAll({ limit: 1 }),
          contactAPI.getAll({ limit: 100 }),
        ]);
        const total   = uData.pagination?.total || uData.count || 0;
        const pending = cData.data?.filter(c => c.status === 'new' || c.status === 'pending').length || 0;
        const contacts = cData.pagination?.total || cData.count || cData.data?.length || 0;
        setStats({ users: total, inquiries: contacts, pending });
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const quickLinks = [
    { icon: '📊', label: 'Admin Dashboard',   sub: 'Full control panel',          path: '/admin?tab=overview',   color: '#3b82f6' },
    { icon: '📧', label: 'Contact Inquiries',  sub: `${stats.pending} pending`,    path: '/admin?tab=inquiries',  color: '#f59e0b' },
    { icon: '👥', label: 'User Management',    sub: `${stats.users} total users`,  path: '/admin?tab=users',      color: '#10b981' },
    { icon: '⚙️', label: 'Manage Services',    sub: 'Edit service catalogue',      path: '/admin?tab=services',   color: '#8b5cf6' },
    { icon: '💳', label: 'Paid Users',          sub: 'View payment records',        path: '/admin?tab=payments',   color: '#06b6d4' },
    { icon: '👨‍💼', label: 'Experts Panel',     sub: 'Manage expert roster',        path: '/admin?tab=experts',    color: '#ec4899' },
  ];

  const statCards = [
    { label: 'Total Users',    value: stats.users,    icon: '👥', color: '#3b82f6' },
    { label: 'Total Inquiries',value: stats.inquiries, icon: '📧', color: '#10b981' },
    { label: 'Pending Items',  value: stats.pending,  icon: '⏳', color: '#f59e0b' },
  ];

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <section style={{
      minHeight: '92vh',
      background: 'var(--bg-primary)',
      padding: '60px 5%',
      transition: 'background 0.3s',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible" style={{ marginBottom: 48 }}>
          <motion.div variants={fadeUp} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--accent-color)',
            background: 'rgba(59,130,246,0.08)', padding: '6px 16px',
            borderRadius: 20, marginBottom: 20,
          }}>
            <span style={{ width: 20, height: 1, background: 'var(--accent-color)', display: 'block' }} />
            Admin Portal
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(34px,4.5vw,58px)',
            fontWeight: 700, lineHeight: 1.1,
            color: 'var(--text-primary)',
            letterSpacing: '-1.5px', marginBottom: 12,
          }}>
            Welcome back,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>{firstName}.</em>
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: 16, color: 'var(--text-secondary)',
            lineHeight: 1.7, maxWidth: 520,
          }}>
            You're signed in as <strong style={{ color: 'var(--text-primary)' }}>Admin</strong>.
            Manage the platform, review inquiries, and track payments from your dashboard.
          </motion.p>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 40 }}
        >
          {statCards.map(card => (
            <motion.div key={card.label} variants={fadeUp} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 14, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${card.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${card.color}15`, fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{card.icon}</div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 500 }}>{card.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: card.color, margin: 0, lineHeight: 1 }}>
                  {loading ? '—' : card.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Quick Links Grid ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h2 variants={fadeUp} style={{
            fontSize: 18, fontWeight: 700, color: 'var(--text-primary)',
            marginBottom: 20, letterSpacing: '-0.3px',
          }}>
            Quick Navigation
          </motion.h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))',
            gap: 16,
          }}>
            {quickLinks.map(link => (
              <motion.button
                key={link.label}
                variants={fadeUp}
                onClick={() => navigate(link.path)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 14, padding: '20px 24px',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s', display: 'flex',
                  alignItems: 'center', gap: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = link.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px ${link.color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${link.color}15`, fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{link.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                    {link.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{link.sub}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 16 }}>→</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Admin badge ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{
            marginTop: 48, padding: '18px 24px',
            background: 'rgba(59,130,246,0.05)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <span style={{ fontSize: 18 }}>🔐</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            You have <strong style={{ color: 'var(--text-primary)' }}>full admin access</strong>.
            Changes you make are live immediately. Use admin tools responsibly.
          </span>
        </motion.div>

      </div>
    </section>
  );
}
