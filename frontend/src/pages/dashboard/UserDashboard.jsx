
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    projects: 12,
    messages: 8,
    tasks: 5,
  });
  
  const [activities, setActivities] = useState([
    { id: 1, type: 'success', text: 'Project "Website Redesign" completed', time: '2 hours ago' },
    { id: 2, type: 'info', text: 'New message from Admin team', time: '5 hours ago' },
    { id: 3, type: 'warning', text: 'Task "Review documentation" is due soon', time: 'Yesterday' },
    { id: 4, type: 'info', text: 'You logged in from new device', time: '2 days ago' },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickActions = [
    { icon: '➕', label: 'New Project', color: 'rgba(102, 126, 234, 0.2)' },
    { icon: '⚙️', label: 'Settings', color: 'rgba(118, 75, 162, 0.2)' },
    { icon: '📊', label: 'View Reports', color: 'rgba(102, 126, 234, 0.2)' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dash-bg)',
      padding: '2rem',
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      {/* Top Bar */}
      <div style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 20,
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: 32,
              fontWeight: 700,
              color: 'var(--dash-text-primary)',
              margin: '0 0 6px 0',
              transition: 'color 0.3s ease',
            }}>
              Welcome Back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{
              fontSize: 14,
              color: 'var(--dash-text-secondary)',
              margin: 0,
              transition: 'color 0.3s ease',
            }}>
              Here's what's happening with your account today
            </p>
          </div>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Go to Home button */}
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'var(--dash-btn-bg)',
                border: 'var(--dash-btn-border)',
                color: 'var(--dash-btn-text)',
                padding: '12px 24px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--dash-btn-hover-bg)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'var(--dash-btn-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🏠 Go to Home
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                background: 'var(--dash-btn-bg)',
                border: 'var(--dash-btn-border)',
                color: '#ef4444',
                padding: '12px 24px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'var(--dash-btn-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        {/* Projects Card */}
        <div style={{
          background: 'var(--dash-card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'var(--dash-card-border)',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: 'var(--dash-card-shadow)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: 48,
              height: 48,
              background: 'var(--dash-btn-bg)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              📁
            </div>
          </div>
          <p style={{
            fontSize: 13,
            color: 'var(--dash-text-secondary)',
            margin: '0 0 8px 0',
            fontWeight: 500,
          }}>
            Projects
          </p>
          <p style={{
            fontSize: 36,
            fontWeight: 700,
            color: 'var(--dash-text-primary)',
            margin: '0 0 6px 0',
          }}>
            {stats.projects}
          </p>
          <p style={{
            fontSize: 12,
            color: 'var(--dash-text-muted)',
            margin: 0,
          }}>
            Active projects
          </p>
        </div>

        {/* Messages Card */}
        <div style={{
          background: 'var(--dash-card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'var(--dash-card-border)',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: 'var(--dash-card-shadow)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: 48,
              height: 48,
              background: 'var(--dash-btn-bg)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              💬
            </div>
          </div>
          <p style={{
            fontSize: 13,
            color: 'var(--dash-text-secondary)',
            margin: '0 0 8px 0',
            fontWeight: 500,
          }}>
            Messages
          </p>
          <p style={{
            fontSize: 36,
            fontWeight: 700,
            color: 'var(--dash-text-primary)',
            margin: '0 0 6px 0',
          }}>
            {stats.messages}
          </p>
          <p style={{
            fontSize: 12,
            color: 'var(--dash-text-muted)',
            margin: 0,
          }}>
            New messages
          </p>
        </div>

        {/* Tasks Card */}
        <div style={{
          background: 'var(--dash-card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'var(--dash-card-border)',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: 'var(--dash-card-shadow)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: 48,
              height: 48,
              background: 'var(--dash-btn-bg)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              ✓
            </div>
          </div>
          <p style={{
            fontSize: 13,
            color: 'var(--dash-text-secondary)',
            margin: '0 0 8px 0',
            fontWeight: 500,
          }}>
            Tasks
          </p>
          <p style={{
            fontSize: 36,
            fontWeight: 700,
            color: 'var(--dash-text-primary)',
            margin: '0 0 6px 0',
          }}>
            {stats.tasks}
          </p>
          <p style={{
            fontSize: 12,
            color: 'var(--dash-text-muted)',
            margin: 0,
          }}>
            Pending tasks
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'var(--dash-card-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'var(--dash-card-border)',
        borderRadius: 16,
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--dash-card-shadow)',
        transition: 'all 0.3s ease',
      }}>
        <h2 style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--dash-text-primary)',
          margin: '0 0 1rem 0',
        }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
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
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--dash-btn-hover-bg)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'var(--dash-btn-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: 18 }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
          
          {/* Special Upgrade Button */}
          <button
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
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: 18 }}>⭐</span>
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Recent Activity */}
        <div style={{
          background: 'var(--dash-card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'var(--dash-card-border)',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: 'var(--dash-card-shadow)',
          transition: 'all 0.3s ease',
        }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--dash-text-primary)',
            margin: '0 0 1rem 0',
          }}>
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map(activity => (
              <div
                key={activity.id}
                style={{
                  background: 'var(--dash-list-item-bg)',
                  padding: '12px 14px',
                  borderRadius: 12,
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--dash-list-item-hover)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--dash-list-item-bg)'}
              >
                <p style={{
                  fontSize: 14,
                  color: 'var(--dash-text-primary)',
                  margin: '0 0 4px 0',
                }}>
                  {activity.text}
                </p>
                <p style={{
                  fontSize: 12,
                  color: 'var(--dash-text-muted)',
                  margin: 0,
                }}>
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div style={{
          background: 'var(--dash-card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'var(--dash-card-border)',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: 'var(--dash-card-shadow)',
          transition: 'all 0.3s ease',
        }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--dash-text-primary)',
            margin: '0 0 1rem 0',
          }}>
            Account Information
          </h2>
          
          {/* Profile Avatar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '1.5rem',
            padding: '16px',
            background: 'var(--dash-list-item-bg)',
            borderRadius: 12,
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--dash-avatar-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--dash-text-primary)',
              flexShrink: 0,
              overflow: 'hidden',
              border: '2px solid var(--border-color)',
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--dash-text-primary)',
                margin: '0 0 4px 0',
              }}>
                {user?.name}
              </h3>
              <p style={{
                fontSize: 14,
                color: 'var(--dash-text-secondary)',
                margin: 0,
              }}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid var(--border-color)',
            }}>
              <span style={{ fontSize: 14, color: 'var(--dash-text-secondary)' }}>
                Account Type
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--dash-text-primary)',
                background: 'var(--dash-avatar-bg)',
                padding: '4px 12px',
                borderRadius: 8,
              }}>
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid var(--border-color)',
            }}>
              <span style={{ fontSize: 14, color: 'var(--dash-text-secondary)' }}>
                Member Since
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dash-text-primary)' }}>
                {new Date(user?.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
            }}>
              <span style={{ fontSize: 14, color: 'var(--dash-text-secondary)' }}>
                Status
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '4px 12px',
                borderRadius: 8,
              }}>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}