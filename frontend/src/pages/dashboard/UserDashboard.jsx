// FILE: frontend/src/pages/dashboard/UserDashboard.jsx
// User dashboard — shows REAL data from the API (no hardcoded values)

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { contactAPI } from '../../utils/api';

export default function UserDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const [myContacts, setMyContacts]   = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [fetchError, setFetchError]   = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null);

  const showUpgradeToast = () => {
    showSuccess('Upgrade initiated! TechHelp Pro features are coming soon to your dashboard.');
  };

  // ── Fetch the user's real contact submissions ──────────────────────────
  const fetchMyContacts = useCallback(async () => {
    if (!token) return;
    setLoadingContacts(true);
    setFetchError('');
    try {
      const data = await contactAPI.getMy();
      setMyContacts(data.data);
    } catch (err) {
      setFetchError(err.message || 'Failed to load your inquiries');
    } finally {
      setLoadingContacts(false);
    }
  }, [token]);

  useEffect(() => { fetchMyContacts(); }, [fetchMyContacts]);

  const toggleExpandCard = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ── Compute profile completeness ──────────────────────────────────────
  const profileFields = [
    { label: 'Name',     filled: !!user?.name },
    { label: 'Email',    filled: !!user?.email },
    { label: 'Avatar',   filled: !!user?.avatar },
    { label: 'Verified', filled: !!user?.isVerified },
  ];
  const completedCount = profileFields.filter(f => f.filled).length;
  const completionPct  = Math.round((completedCount / profileFields.length) * 100);

  // ── Status badge styles ───────────────────────────────────────────────
  const statusStyle = (status) => {
    const map = {
      new:      { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6', label: 'New' },
      read:     { bg: 'rgba(251,191,36,0.15)',  color: '#f59e0b', label: 'In Review' },
      resolved: { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', label: 'Resolved' },
    };
    return map[status] || map.new;
  };

  const card = {
    background: 'var(--dash-card-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: 'var(--dash-card-border)',
    borderRadius: 16,
    boxShadow: 'var(--dash-card-shadow)',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dash-bg)',
      padding: '2rem',
      transition: 'background 0.3s ease',
    }}>

      {/* ── Top Bar ── */}
      <div style={{ ...card, padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--dash-text-primary)', margin: '0 0 4px 0' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ fontSize: 14, color: 'var(--dash-text-secondary)', margin: 0 }}>
              Here's your account activity at a glance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', color: 'var(--dash-btn-text)', padding: '10px 20px', borderRadius: 12, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--dash-btn-bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >🏠 Home</button>

            <button
              onClick={handleLogout}
              style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', color: '#ef4444', padding: '10px 20px', borderRadius: 12, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--dash-btn-bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >🚪 Logout</button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards (Real Data) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Total Inquiries (real) */}
        <StatCard
          icon="📬"
          label="Your Inquiries"
          value={loadingContacts ? '—' : myContacts.length}
          sub="Contact forms submitted"
          card={card}
        />

        {/* Pending (real) */}
        <StatCard
          icon="⏳"
          label="Pending"
          value={loadingContacts ? '—' : myContacts.filter(c => c.status === 'new').length}
          sub="Awaiting response"
          card={card}
        />

        {/* Resolved (real) */}
        <StatCard
          icon="✅"
          label="Resolved"
          value={loadingContacts ? '—' : myContacts.filter(c => c.status === 'resolved').length}
          sub="Completed inquiries"
          card={card}
        />

        {/* Profile completion (real) */}
        <StatCard
          icon="👤"
          label="Profile"
          value={`${completionPct}%`}
          sub="Profile completion"
          card={card}
          accent={completionPct < 100}
        />
      </div>

      {/* ── Quick Actions Panel ── */}
      <div style={{ ...card, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--dash-text-primary)', margin: '0 0 1.25rem 0' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* New Inquiry Action */}
          <button
            onClick={() => navigate('/contact')}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '12px 24px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--dash-btn-bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: 18 }}>📬</span>
            New Inquiry
          </button>

          {/* Settings / Profile Action */}
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '12px 24px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--dash-btn-bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: 18 }}>⚙️</span>
            Profile Settings
          </button>

          {/* Scroll to Inquiries Action */}
          <button
            onClick={() => {
              const el = document.getElementById('my-inquiries-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '12px 24px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--dash-btn-bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: 18 }}>📊</span>
            View My Inquiries
          </button>

          {/* Upgrade to Pro Action */}
          <button
            onClick={showUpgradeToast}
            style={{
              background: 'var(--dash-btn-pro-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-pro-text)',
              padding: '12px 24px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <span style={{ fontSize: 18 }}>⭐</span>
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* ── My Inquiries ── */}
        <div id="my-inquiries-section" style={{ ...card, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--dash-text-primary)', margin: 0 }}>
              My Inquiries
            </h2>
            <Link to="/contact" style={{ fontSize: 13, color: 'var(--accent-color)', textDecoration: 'none' }}>
              + New Inquiry
            </Link>
          </div>

          {loadingContacts ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: 'var(--dash-list-item-bg)', borderRadius: 10, padding: '14px 16px' }}>
                  <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '40%', height: 12 }} />
                </div>
              ))}
            </div>
          ) : fetchError ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444', fontSize: 14 }}>
              {fetchError}
              <button onClick={fetchMyContacts} style={{ display: 'block', margin: '12px auto 0', fontSize: 13, color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
            </div>
          ) : myContacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--dash-text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 14, marginBottom: 16 }}>No inquiries yet</p>
              <Link to="/contact" style={{ fontSize: 14, color: 'var(--accent-color)', textDecoration: 'none', background: 'rgba(59,130,246,0.1)', padding: '8px 20px', borderRadius: 8 }}>
                Send your first message →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myContacts.map(c => {
                const st = statusStyle(c.status);
                const isExpanded = expandedCardId === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => toggleExpandCard(c._id)}
                    style={{
                      background: 'var(--dash-list-item-bg)',
                      borderRadius: 10,
                      padding: '14px 16px',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      border: isExpanded ? '1px solid var(--accent-color)' : '1px solid transparent',
                      boxShadow: isExpanded ? '0 4px 12px rgba(79, 70, 229, 0.08)' : 'none'
                    }}
                    onMouseOver={e => {
                      if (!isExpanded) e.currentTarget.style.background = 'var(--dash-list-item-hover)';
                    }}
                    onMouseOut={e => {
                      if (!isExpanded) e.currentTarget.style.background = 'var(--dash-list-item-bg)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--dash-text-primary)', margin: '0 0 4px', textTransform: 'capitalize' }}>
                          {c.service || 'General Inquiry'}
                        </p>
                        <p style={{
                          fontSize: 12,
                          color: isExpanded ? 'var(--dash-text-secondary)' : 'var(--dash-text-muted)',
                          margin: 0,
                          overflow: isExpanded ? 'visible' : 'hidden',
                          textOverflow: isExpanded ? 'clip' : 'ellipsis',
                          whiteSpace: isExpanded ? 'pre-wrap' : 'nowrap',
                          lineHeight: 1.5
                        }}>
                          {c.message}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--dash-text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▼
                        </span>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-color)',
                          fontSize: 12,
                          color: 'var(--dash-text-secondary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div>
                          <strong>From:</strong> {c.name} ({c.email})
                        </div>
                        {c.subject && (
                          <div>
                            <strong>Subject:</strong> {c.subject}
                          </div>
                        )}
                        <div style={{
                          marginTop: '4px',
                          padding: '10px',
                          background: 'rgba(0, 0, 0, 0.02)',
                          borderRadius: '6px',
                          borderLeft: '3px solid var(--accent-color)',
                        }}>
                          <p style={{ fontSize: 12, color: 'var(--dash-text-primary)', whiteSpace: 'pre-wrap', margin: 0 }}>
                            {c.message}
                          </p>
                        </div>
                      </div>
                    )}

                    <p style={{ fontSize: 11, color: 'var(--dash-text-muted)', margin: '8px 0 0' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Account Info ── */}
        <div style={{ ...card, padding: '1.5rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--dash-text-primary)', margin: '0 0 1.25rem 0' }}>
            Account Information
          </h2>

          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem', padding: 16, background: 'var(--dash-list-item-bg)', borderRadius: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--dash-avatar-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'var(--dash-text-primary)', flexShrink: 0, overflow: 'hidden', border: '2px solid var(--border-color)' }}>
              {user?.avatar ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--dash-text-primary)', margin: '0 0 4px' }}>{user?.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--dash-text-secondary)', margin: 0 }}>{user?.email}</p>
            </div>
          </div>

          {/* Detail rows */}
          {[
            { label: 'Account Type', value: user?.role === 'admin' ? '⭐ Admin' : 'User', badge: true },
            { label: 'Member Since', value: new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
            { label: 'Email Status', value: user?.isVerified ? '✅ Verified' : '⚠️ Unverified' },
            { label: 'Status', value: '🟢 Active' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: 14, color: 'var(--dash-text-secondary)' }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)', background: row.badge ? 'var(--dash-avatar-bg)' : 'transparent', padding: row.badge ? '4px 12px' : 0, borderRadius: row.badge ? 8 : 0 }}>
                {row.value}
              </span>
            </div>
          ))}

          {/* Profile completion bar */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--dash-text-secondary)' }}>Profile Completion</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: completionPct === 100 ? '#10b981' : 'var(--accent-color)' }}>{completionPct}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--dash-list-item-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${completionPct}%`, background: completionPct === 100 ? '#10b981' : 'var(--accent-color)', borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>
            {completionPct < 100 && (
              <Link to="/profile" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--accent-color)', textDecoration: 'none' }}>
                Complete your profile →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: Stat Card ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, card, accent }) {
  return (
    <div
      style={{ ...card, padding: '1.5rem' }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ width: 48, height: 48, background: 'var(--dash-btn-bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>
        {icon}
      </div>
      <p style={{ fontSize: 13, color: 'var(--dash-text-secondary)', margin: '0 0 6px', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 700, color: accent ? 'var(--accent-color)' : 'var(--dash-text-primary)', margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: 'var(--dash-text-muted)', margin: 0 }}>{sub}</p>
    </div>
  );
}