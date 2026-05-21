// FILE: frontend/src/pages/auth/LoginPage.jsx
// Login page — JWT auth will be wired in Week 2
// Route: /login

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // TODO Week 2: replace with real API call
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    alert('Login API — connect in Week 2');
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
    marginTop: 8,
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      transition: 'background 0.3s',
    }}>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 6, padding: '48px 44px',
        boxShadow: '0 20px 45px rgba(0,0,0,0.05)',
      }}>

        {/* Logo link */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 20, fontWeight: 700, color: 'var(--text-primary)',
            marginBottom: 36,
          }}>
            TechHelp<span style={{ color: 'var(--accent-color)' }}>IT</span>
          </div>
        </Link>

        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 28, fontWeight: 700, color: 'var(--text-primary)',
          letterSpacing: '-0.5px', marginBottom: 8,
        }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 36 }}>
          Sign in to your account to continue.
        </p>

        {error && (
          <div style={{
            background: 'rgba(220,53,69,0.1)',
            border: '1px solid rgba(220,53,69,0.3)',
            borderRadius: 3, padding: '12px 16px',
            color: '#dc3545', fontSize: 13, marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <input
              name="email" type="email" required
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              name="password" type="password" required
              placeholder="••••••••"
              value={form.password} onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 28 }}>
            <a href="#" style={{ fontSize: 13, color: 'var(--accent-color)', textDecoration: 'none' }}
               onMouseEnter={e => e.target.style.color = 'var(--accent-hover)'}
               onMouseLeave={e => e.target.style.color = 'var(--accent-color)'}
            >
              Forgot password?
            </a>
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
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          margin: '28px 0', color: 'var(--text-muted)', fontSize: 12,
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
          OR
          <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = 'var(--accent-hover)'}
                onMouseLeave={e => e.target.style.color = 'var(--accent-color)'}
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
