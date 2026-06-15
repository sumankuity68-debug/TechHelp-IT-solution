// FILE: frontend/src/pages/dashboard/ExpertDashboard.jsx
// Dedicated expert dashboard to view and manage inquiries assigned to this expert.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { expertsAPI } from '../../utils/api';

export default function ExpertDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchInquiries = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setFetchError('');
    try {
      const data = await expertsAPI.getMyInquiries();
      setInquiries(data.data || []);
    } catch (err) {
      setFetchError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await expertsAPI.updateInquiryStatus(inquiryId, newStatus);
      showSuccess(`Inquiry status updated to ${newStatus}`);
      // Update local state
      setInquiries(prev =>
        prev.map(item => (item._id === inquiryId ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      showError(err.message || 'Failed to update status');
    }
  };

  const toggleExpandCard = (id) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  // ── Status badge colors ───────────────────────────────────────────────
  const statusStyle = (status) => {
    const map = {
      new: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: 'New' },
      read: { bg: 'rgba(251,191,36,0.18)', color: '#f59e0b', label: 'In Review' },
      resolved: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Resolved' },
    };
    return map[status] || { bg: 'rgba(100,116,139,0.15)', color: '#64748b', label: status };
  };

  // ── Filter and Search Logic ──────────────────────────────────────────
  const filteredInquiries = inquiries.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    const searchString = `${item.name || ''} ${item.email || ''} ${item.service || ''} ${item.message || ''} ${item.preferences || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // ── Stats Calculations ───────────────────────────────────────────────
  const totalCount = inquiries.length;
  const newCount = inquiries.filter(item => item.status === 'new').length;
  const reviewCount = inquiries.filter(item => item.status === 'read').length;
  const resolvedCount = inquiries.filter(item => item.status === 'resolved').length;

  const cardStyle = {
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
      <div style={{ ...cardStyle, padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0 }}>
                Expert Portal 🛠️
              </h1>
              <span style={{
                background: 'var(--accent-color)',
                color: 'white',
                borderRadius: 20,
                padding: '2px 10px',
                fontSize: 12,
                fontWeight: 600
              }}>
                Expert
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--dash-text-secondary)', margin: 0 }}>
              Logged in as <strong style={{ color: 'var(--dash-text-primary)' }}>{user?.name}</strong> ({user?.email})
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', color: 'var(--dash-btn-text)', padding: '10px 20px', borderRadius: 12, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--dash-btn-bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              🏠 Home
            </button>
            <button
              onClick={handleLogout}
              style={{ background: 'var(--dash-btn-bg)', border: 'var(--dash-btn-border)', color: '#ef4444', padding: '10px 20px', borderRadius: 12, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--dash-btn-bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <StatCard
          icon="📬"
          label="Total Assigned"
          value={loading ? '—' : totalCount}
          sub="Queries routed to you"
          card={cardStyle}
        />
        <StatCard
          icon="⚡"
          label="New Queries"
          value={loading ? '—' : newCount}
          sub="Requires response"
          card={cardStyle}
          accent={newCount > 0}
        />
        <StatCard
          icon="⏳"
          label="In Review"
          value={loading ? '—' : reviewCount}
          sub="Under investigation"
          card={cardStyle}
        />
        <StatCard
          icon="✅"
          label="Resolved"
          value={loading ? '—' : resolvedCount}
          sub="Successfully closed"
          card={cardStyle}
        />
      </div>

      {/* ── Controls Block ── */}
      <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--dash-text-primary)', margin: '0 0 1rem 0' }}>
          Search & Filters
        </h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search box */}
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by client, email, preferences, message content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 42px',
                background: 'var(--dash-list-item-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                color: 'var(--dash-text-primary)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, background: 'var(--dash-list-item-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--border-color)' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'new', label: 'New' },
              { id: 'read', label: 'In Review' },
              { id: 'resolved', label: 'Resolved' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  background: statusFilter === tab.id ? 'var(--accent-color)' : 'transparent',
                  color: statusFilter === tab.id ? 'white' : 'var(--dash-text-secondary)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchInquiries}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginLeft: 'auto'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ── Inquiries List ── */}
      <div style={{ ...cardStyle, padding: '2rem' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text-primary)', marginBottom: '1.5rem' }}>
          Assigned Queries ({filteredInquiries.length})
        </h2>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--dash-list-item-bg)', borderRadius: 12, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: '30%', height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} className="skeleton" />
                  <div style={{ width: '15%', height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} className="skeleton" />
                </div>
                <div style={{ width: '80%', height: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8 }} className="skeleton" />
                <div style={{ width: '50%', height: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} className="skeleton" />
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
            <p style={{ fontSize: 16, margin: '0 0 16px' }}>⚠️ {fetchError}</p>
            <button
              onClick={fetchInquiries}
              style={{
                background: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 10,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Retry Loading Inquiries
            </button>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--dash-text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>No inquiries match your query</p>
            <p style={{ fontSize: 14, margin: 0 }}>Try clearing filters or checking again later.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredInquiries.map(item => {
              const badge = statusStyle(item.status);
              const isExpanded = expandedCardId === item._id;

              return (
                <div
                  key={item._id}
                  onClick={() => toggleExpandCard(item._id)}
                  style={{
                    background: 'var(--dash-list-item-bg)',
                    borderRadius: 14,
                    padding: '20px',
                    border: isExpanded ? '1px solid var(--accent-color)' : '1px solid transparent',
                    boxShadow: isExpanded ? '0 8px 24px rgba(79, 70, 229, 0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                  }}
                  onMouseOver={e => {
                    if (!isExpanded) e.currentTarget.style.background = 'var(--dash-list-item-hover)';
                  }}
                  onMouseOut={e => {
                    if (!isExpanded) e.currentTarget.style.background = 'var(--dash-list-item-bg)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    {/* Left: Client name, email & service */}
                    <div style={{ minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                          {item.name}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>
                          ({item.email})
                        </span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent-color)', margin: '0 0 8px', textTransform: 'capitalize' }}>
                        💻 Service: {item.service || 'General Inquiry'}
                      </p>
                    </div>

                    {/* Right: Status badge & dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      {/* Status badge */}
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: badge.bg,
                        color: badge.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>
                        {badge.label}
                      </span>

                      {/* Dropdown status update */}
                      <select
                        value={item.status}
                        onChange={e => handleStatusChange(item._id, e.target.value)}
                        style={{
                          background: 'var(--dash-btn-bg)',
                          color: 'var(--dash-text-primary)',
                          border: 'var(--dash-btn-border)',
                          borderRadius: 8,
                          padding: '6px 10px',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        <option value="new">New</option>
                        <option value="read">In Review</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {/* Message snippet or expanded block */}
                  <div style={{ marginTop: 12 }}>
                    <p style={{
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: isExpanded ? 'var(--dash-text-primary)' : 'var(--dash-text-secondary)',
                      margin: 0,
                      whiteSpace: isExpanded ? 'pre-wrap' : 'nowrap',
                      overflow: isExpanded ? 'visible' : 'hidden',
                      textOverflow: isExpanded ? 'clip' : 'ellipsis',
                    }}>
                      {item.message}
                    </p>
                  </div>

                  {/* Preferences indicator */}
                  {item.preferences && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                      <span style={{ fontSize: 13 }}>🛠️</span>
                      <span style={{
                        fontSize: 12,
                        background: 'rgba(102, 126, 234, 0.12)',
                        color: '#667eea',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontWeight: 500
                      }}>
                        Preferences: {item.preferences}
                      </span>
                    </div>
                  )}

                  {/* Expanded detail section */}
                  {isExpanded && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: 13, color: 'var(--dash-text-secondary)' }}>
                        <div>
                          <strong>Client Name:</strong> {item.name}
                        </div>
                        <div>
                          <strong>Client Email:</strong> <a href={`mailto:${item.email}`} style={{ color: 'var(--accent-color)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.textDecoration = 'underline'} onMouseLeave={e => e.target.style.textDecoration = 'none'}>{item.email}</a>
                        </div>
                        <div>
                          <strong>Date Received:</strong> {new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                        {item.subject && (
                          <div>
                            <strong>Subject:</strong> {item.subject}
                          </div>
                        )}
                      </div>

                      <div style={{
                        background: 'rgba(0, 0, 0, 0.02)',
                        padding: 16,
                        borderRadius: 8,
                        borderLeft: '4px solid var(--accent-color)',
                        marginTop: 6
                      }}>
                        <p style={{ margin: 0, fontSize: 14, color: 'var(--dash-text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                          {item.message}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                        <a
                          href={`mailto:${item.email}?subject=Re: CareerNest/TechHelp Inquiry regarding ${item.service || 'services'}`}
                          style={{
                            background: 'var(--accent-color)',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 18px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          ✉️ Reply via Email
                        </a>
                      </div>
                    </div>
                  )}

                  {!isExpanded && (
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--dash-text-muted)' }}>
                        Received: {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--dash-text-muted)' }}>
                        Click to view details ▼
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat Card Subcomponent ───────────────────────────────────────────
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
      <p style={{ fontSize: 32, fontWeight: 700, color: accent ? 'var(--accent-color)' : 'var(--dash-text-primary)', margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: 'var(--dash-text-muted)', margin: 0 }}>{sub}</p>
    </div>
  );
}
