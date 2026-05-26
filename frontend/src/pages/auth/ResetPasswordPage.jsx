// FILE: frontend/src/pages/auth/ResetPasswordPage.jsx
// ────────────────────────────────────────────────────────────────────────
// Reset Password page - user enters new password using token from email
// Route: /reset-password/:token
// ────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      // Success - redirect to login
      alert('Password reset successful! You can now login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: '48px 44px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#667eea',
            marginBottom: 36,
          }}>
            Tech<span style={{ color: '#764ba2' }}>Help</span>
          </h1>
        </Link>

        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: 8,
        }}>
          Reset Password
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
          Enter your new password below
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            padding: '12px 16px',
            color: '#ef4444',
            fontSize: 13,
            marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              marginBottom: 8,
            }}>
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 15px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                color: '#1a1a1a',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = '#f9fafb';
              }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              marginBottom: 8,
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm(p => ({ ...p, confirm: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 15px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                color: '#1a1a1a',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = '#f9fafb';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password →'}
          </button>
        </form>
      </div>
    </div>
  );
}