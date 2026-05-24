// FILE: frontend/src/pages/dashboard/UserDashboard.jsx
// ────────────────────────────────────────────────────────────────────────
// User Dashboard — shown after successful login.
// Displays: welcome message, user profile card, logout button.
// Route: /dashboard (protected)
// ────────────────────────────────────────────────────────────────────────
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top navbar */}
      <nav
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '0 6%',
          height: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Tech<span style={{ color: 'var(--accent-color)' }}>Help</span>
        </h1>

        <button
          onClick={handleLogout}
          style={{
            padding: '9px 20px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 4,
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--accent-color)';
            e.target.style.color = 'var(--accent-color)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.color = 'var(--text-primary)';
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '60px 6%',
        }}
      >
        {/* Welcome section */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 12,
            }}
          >
            Welcome back, <span style={{ color: 'var(--accent-color)' }}>{user?.name}</span>!
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
            Here's your account overview and recent activity.
          </p>
        </div>

        {/* Dashboard grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {/* Profile Card */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '32px 28px',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--accent-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 20,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <h3
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              {user?.name}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
              {user?.email}
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--accent-color)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {user?.role || 'User'}
            </div>
          </div>

          {/* Stats Card 1 */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '32px 28px',
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Account Status
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#10b981',
                marginBottom: 8,
              }}
            >
              Active
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Your account is in good standing
            </p>
          </div>

          {/* Stats Card 2 */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '32px 28px',
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Member Since
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Thank you for being with us!
            </p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div style={{ marginTop: 48 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}
          >
            Recent Activity
          </h3>

          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
              No recent activity to display.
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
              Your interactions and project updates will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}