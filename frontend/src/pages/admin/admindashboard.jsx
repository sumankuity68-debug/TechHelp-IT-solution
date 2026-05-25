
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function AdminDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContacts: 0,
    totalServices: 4,
    pendingInquiries: 0,
  });
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
     
      const contactRes = await fetch('http://localhost:5000/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const contactData = await contactRes.json();

      const servicesRes = await fetch('http://localhost:5000/api/services');
      const servicesData = await servicesRes.json();

      if (contactData.success) {
        setContacts(contactData.data);
        setStats(prev => ({
          ...prev,
          totalContacts: contactData.count,
          pendingInquiries: contactData.data.filter(c => c.status === 'pending').length,
        }));
      }

      if (servicesData.success) {
        setServices(servicesData.data);
        setStats(prev => ({ ...prev, totalServices: servicesData.count }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setContacts(contacts.filter(c => c._id !== id));
        setStats(prev => ({ ...prev, totalContacts: prev.totalContacts - 1 }));
        alert('Inquiry deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete inquiry');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setContacts(contacts.map(c => 
          c._id === id ? { ...c, status: newStatus } : c
        ));
        alert('Status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dash-bg)',
      padding: '2rem',
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      <div style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 16,
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        <div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--dash-text-primary)',
            margin: 0,
            transition: 'color 0.3s ease',
          }}>
            Tech<span style={{ color: 'var(--dash-text-secondary)' }}>Help</span> Admin
          </h1>
          <p style={{ fontSize: 13, color: 'var(--dash-text-secondary)', margin: '4px 0 0 0', transition: 'color 0.3s ease' }}>
            Welcome back, {user?.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Go to Home button */}
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--dash-btn-bg)'}
          >
            🏠 Home
          </button>

          {/* Theme Toggle button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: 'var(--dash-btn-text)',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--dash-btn-hover-bg)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--dash-btn-bg)'}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--dash-btn-bg)',
              border: 'var(--dash-btn-border)',
              color: '#ef4444',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--dash-btn-bg)'}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 16,
        padding: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '8px',
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'inquiries', label: 'Inquiries', icon: '📧' },
          { id: 'services', label: 'Services', icon: '⚙️' },
          { id: 'users', label: 'Users', icon: '👥' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: activeTab === tab.id 
                ? 'var(--dash-btn-hover-bg)' 
                : 'var(--dash-btn-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: activeTab === tab.id
                ? 'var(--dash-btn-border)'
                : '1px solid transparent',
              color: activeTab === tab.id
                ? 'var(--dash-text-primary)'
                : 'var(--dash-text-secondary)',
              padding: '12px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 16,
        padding: '2rem',
        minHeight: 400,
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--dash-text-primary)', padding: '4rem' }}>
            <div style={{
              width: 50,
              height: 50,
              border: '4px solid var(--border-color)',
              borderTop: '4px solid var(--accent-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }} />
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, marginBottom: '1.5rem', transition: 'color 0.3s ease' }}>
                  Dashboard Overview
                </h2>
                
                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}>
                  {[
                    { label: 'Total Inquiries', value: stats.totalContacts },
                    { label: 'Pending Inquiries', value: stats.pendingInquiries },
                    { label: 'Total Services', value: stats.totalServices },
                    { label: 'Total Users', value: stats.totalUsers },
                  ].map((s, idx) => (
                    <div key={idx} style={{
                      background: 'var(--dash-btn-bg)',
                      border: 'var(--dash-btn-border)',
                      borderRadius: 12,
                      padding: '1.5rem',
                      transition: 'all 0.3s ease',
                    }}>
                      <p style={{ fontSize: 13, color: 'var(--dash-text-secondary)', margin: '0 0 8px 0', transition: 'color 0.3s ease' }}>
                        {s.label}
                      </p>
                      <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0, transition: 'color 0.3s ease' }}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'var(--dash-list-item-bg)',
                  border: 'var(--dash-card-border)',
                  borderRadius: 12,
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}>
                  <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 16, marginBottom: '1rem', transition: 'color 0.3s ease' }}>
                    Recent Inquiries
                  </h3>
                  {contacts.slice(0, 5).map(contact => (
                    <div
                      key={contact._id}
                      style={{
                        background: 'var(--dash-card-bg)',
                        border: 'var(--dash-card-border)',
                        padding: '12px',
                        borderRadius: 8,
                        marginBottom: '8px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--dash-text-primary)', fontSize: 14, fontWeight: 500, transition: 'color 0.3s ease' }}>
                          {contact.name}
                        </span>
                        <span style={{
                          fontSize: 11,
                          color: 'var(--dash-text-muted)',
                          transition: 'color 0.3s ease',
                        }}>
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: 0, transition: 'color 0.3s ease' }}>
                        {contact.email} • {contact.service}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div>
                <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, marginBottom: '1.5rem', transition: 'color 0.3s ease' }}>
                  Contact Inquiries ({contacts.length})
                </h2>

                {contacts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dash-text-muted)' }}>
                    <p style={{ fontSize: 18, marginBottom: '8px' }}>📭</p>
                    <p>No inquiries yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {contacts.map(contact => (
                      <div
                        key={contact._id}
                        style={{
                          background: 'var(--dash-card-bg)',
                          border: 'var(--dash-card-border)',
                          borderRadius: 12,
                          padding: '1.5rem',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div>
                            <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 16, margin: '0 0 4px 0', transition: 'color 0.3s ease' }}>
                              {contact.name}
                            </h3>
                            <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: 0, transition: 'color 0.3s ease' }}>
                              {contact.email}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select
                              value={contact.status}
                              onChange={(e) => handleUpdateStatus(contact._id, e.target.value)}
                              style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 12,
                                cursor: 'pointer',
                                marginBottom: '8px',
                                outline: 'none',
                              }}
                            >
                              <option value="pending" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Pending</option>
                              <option value="contacted" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Contacted</option>
                              <option value="closed" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Closed</option>
                            </select>
                            <p style={{ fontSize: 11, color: 'var(--dash-text-muted)', margin: 0, transition: 'color 0.3s ease' }}>
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div style={{
                          background: 'var(--dash-list-item-bg)',
                          padding: '12px',
                          borderRadius: 8,
                          marginBottom: '12px',
                          transition: 'all 0.3s ease',
                        }}>
                          <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: '0 0 8px 0', transition: 'color 0.3s ease' }}>
                            <strong style={{ color: 'var(--dash-text-primary)', transition: 'color 0.3s ease' }}>Service:</strong> {contact.service}
                          </p>
                          <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, margin: 0, transition: 'color 0.3s ease' }}>
                            <strong style={{ color: 'var(--dash-text-primary)', transition: 'color 0.3s ease' }}>Message:</strong> {contact.message}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '8px 16px',
                            borderRadius: 6,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, marginBottom: '1.5rem', transition: 'color 0.3s ease' }}>
                  Services Management
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1rem',
                }}>
                  {services.map(service => (
                    <div
                      key={service._id}
                      style={{
                        background: 'var(--dash-card-bg)',
                        border: 'var(--dash-card-border)',
                        borderRadius: 12,
                        padding: '1.5rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{
                        fontSize: 11,
                        color: 'var(--dash-text-muted)',
                        marginBottom: '8px',
                        fontWeight: 600,
                        transition: 'color 0.3s ease',
                      }}>
                        {service.num}
                      </div>
                      <h3 style={{ color: 'var(--dash-text-primary)', fontSize: 18, margin: '0 0 8px 0', transition: 'color 0.3s ease' }}>
                        {service.title}
                      </h3>
                      <p style={{ color: 'var(--dash-text-secondary)', fontSize: 13, marginBottom: '12px', transition: 'color 0.3s ease' }}>
                        {service.description.substring(0, 100)}...
                      </p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {service.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              background: 'var(--dash-avatar-bg)',
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 11,
                              color: 'var(--dash-text-primary)',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: '2rem',
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'var(--dash-list-item-bg)',
                  borderRadius: 12,
                  border: '2px dashed var(--dash-card-border)',
                  transition: 'all 0.3s ease',
                }}>
                  <p style={{ color: 'var(--dash-text-secondary)', fontSize: 14, transition: 'color 0.3s ease' }}>
                    Service creation and editing coming in Week 3
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 style={{ color: 'var(--dash-text-primary)', fontSize: 22, marginBottom: '1.5rem', transition: 'color 0.3s ease' }}>
                  User Management
                </h2>

                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: 'var(--dash-list-item-bg)',
                  borderRadius: 12,
                  border: '2px dashed var(--dash-card-border)',
                  transition: 'all 0.3s ease',
                }}>
                  <p style={{ fontSize: 48, margin: '0 0 1rem 0' }}>👥</p>
                  <p style={{ color: 'var(--dash-text-primary)', fontSize: 18, marginBottom: '8px', transition: 'color 0.3s ease' }}>
                    User Management
                  </p>
                  <p style={{ color: 'var(--dash-text-secondary)', fontSize: 14, transition: 'color 0.3s ease' }}>
                    User listing and management features coming in Week 3
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}