// FILE: frontend/src/pages/auth/ForgotPasswordPage.jsx
// ────────────────────────────────────────────────────────────────────────
// Forgot Password page - Facebook-style 3-Step Wizard:
// Step 1: Find Account (by email)
// Step 2: Confirm Account (displays profile details & masked email)
// Step 3: Enter OTP & Reset Password
// Route: /forgot-password
// ────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  
  // Wizard state: 1 (Find), 2 (Confirm), 3 (Verify & Reset)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Search for user account
  const handleFindAccount = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/find-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'No account found with that email address');
      }

      setFoundUser(data.user);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm profile and request OTP
  const handleSendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP code');
      }

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP and set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      showSuccess('Password reset successful! You can now login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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
        {/* Logo */}
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

        {/* STEP 1: FIND ACCOUNT */}
        {step === 1 && (
          <>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 8,
            }}>
              Find Your Account
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
              Please enter your registered email address to search for your account.
            </p>

            <form onSubmit={handleFindAccount}>
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
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
                {loading ? 'Searching...' : 'Search Account →'}
              </button>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              margin: '28px 0',
              color: '#9ca3af',
              fontSize: 12,
            }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              OR
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </>
        )}

        {/* STEP 2: CONFIRM ACCOUNT */}
        {step === 2 && foundUser && (
          <>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 8,
            }}>
              Is this your account?
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>
              We found a matching account. Confirm your identity to receive a verification code.
            </p>

            {/* Profile Confirmation Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '24px',
              textAlign: 'center',
              marginBottom: 28,
            }}>
              {/* Avatar circle */}
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: 24,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 4px 10px rgba(102, 126, 234, 0.25)',
              }}>
                {foundUser.avatar ? (
                  <img 
                    src={foundUser.avatar} 
                    alt={foundUser.name} 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  getInitials(foundUser.name)
                )}
              </div>

              {/* User Name */}
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: 6,
              }}>
                {foundUser.name}
              </h3>

              {/* Masked Email */}
              <p style={{
                fontSize: 14,
                color: '#475569',
                marginBottom: 16,
              }}>
                {foundUser.maskedEmail}
              </p>

              {/* Delivery Select Method */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                textAlign: 'left',
              }}>
                <span style={{ fontSize: 16 }}>✉️</span>
                <label style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>
                  Send OTP Code via email
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button
                onClick={() => {
                  setStep(1);
                  setFoundUser(null);
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Not You?
              </button>

              <button
                onClick={handleSendOTP}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: '14px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </div>
          </>
        )}

        {/* STEP 3: VERIFY OTP & RESET PASSWORD */}
        {step === 3 && foundUser && (
          <>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 8,
            }}>
              Verify OTP
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
              We've sent a 6-digit code to your email: <strong>{foundUser.maskedEmail}</strong>.
            </p>

            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 18,
                    fontWeight: 'bold',
                    letterSpacing: '4px',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
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
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
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
                {loading ? 'Resetting Password...' : 'Reset Password →'}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                ← Back to Account Details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}