
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GoogleAuthButton from '../../components/GoogleAuthButton';

export default function LoginPage() {
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = showOtpInput 
        ? '/api/auth/verify-expert-login' 
        : '/api/auth/login';

      const payload = showOtpInput 
        ? { email: form.email, otp } 
        : form;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ Check if it's a verification error
        if (data.requiresVerification) {
          setShowResend(true);
          setResendEmail(form.email);
        }
        throw new Error(data.message || 'Login failed');
      }

      if (data.requiresTwoFactor) {
        setShowOtpInput(true);
        showSuccess(data.message || 'Authorization code required');
        setLoading(false);
        return;
      }

      login(data.user, data.token);

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'expert') {
        navigate('/expert/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResendVerification = async () => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess('Verification email sent! Please check your inbox.');
        setShowResend(false);
      } else {
        showError(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      showError('Failed to resend verification email');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blurred blobs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: 300, height: 300,
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-60px',
        width: 360, height: 360,
        background: 'rgba(118, 75, 162, 0.35)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '15%',
        width: 180, height: 180,
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Glass Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: 24,
          padding: '48px 44px',
          boxShadow: '0 8px 48px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255,255,255,0.3) inset',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'white',
              marginBottom: 36,
              letterSpacing: '-0.5px',
            }}
          >
            Tech<span style={{ color: 'rgba(255,255,255,0.7)' }}>Help</span>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 6,
              padding: '2px 8px',
              marginLeft: 6,
              fontSize: 14,
              fontWeight: 600,
              verticalAlign: 'middle',
              color: 'white',
            }}>IT</span>
          </h1>
        </Link>

        <h2
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: 'white',
            marginBottom: 8,
            letterSpacing: '-0.5px',
          }}
        >
          Welcome back 👋
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 14, marginBottom: 32 }}>
          Sign in to your account to continue.
        </p>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#fca5a5',
              fontSize: 13,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            ⚠️ {error}
          </div>
        )}
        {showResend && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 24,
          }}>
            <p style={{ color: '#3b82f6', fontSize: 13, margin: '0 0 8px 0' }}>
              📧 Your email is not verified yet.
            </p>
            <button
              onClick={handleResendVerification}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', fontSize: 16,
                pointerEvents: 'none',
              }}>✉️</span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '13px 15px 13px 42px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.18)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          {/* Password - only if not showing OTP verification */}
          {!showOtpInput && (
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 16,
                  pointerEvents: 'none',
                }}>🔒</span>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 42px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.18)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {/* Show/hide password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.7)', fontSize: 16, padding: 4,
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {/* OTP Input - only if showing OTP verification */}
          {showOtpInput && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}
              >
                Secret Authorization Code
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 16,
                  pointerEvents: 'none',
                }}>🔑</span>
                <input
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '13px 15px 13px 42px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    letterSpacing: '4px',
                    fontWeight: 700,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.18)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Forgot password link - only if not showing OTP verification */}
          {!showOtpInput && (
            <div style={{ textAlign: 'right', marginBottom: 28 }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 13,
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
              >
                Forgot password?
              </Link>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading
                ? 'rgba(255, 255, 255, 0.25)'
                : 'rgba(255, 255, 255, 0.95)',
              color: loading ? 'rgba(255,255,255,0.7)' : '#667eea',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.02em',
              marginTop: showOtpInput ? 12 : 0,
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.25)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            }}
          >
            {loading ? 'Verifying...' : showOtpInput ? 'Confirm Authorization Code →' : 'Sign In →'}
          </button>

          {/* Back to Login helper button */}
          {showOtpInput && (
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp('');
                setError('');
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 12,
                fontSize: 14,
                cursor: 'pointer',
                marginTop: 12,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              ← Back to Login
            </button>
          )}
        </form>

        {/* Divider & Google sign-in & Signup link - only if not showing OTP verification */}
        {!showOtpInput && (
          <>
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    margin: '28px 0 20px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: 12,
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                  OR
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                </div>

                <GoogleAuthButton label="Sign in with Google" darkMode={true} mode="login" />
              </>
            )}

            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 24 }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 700,
                  borderBottom: '1px solid rgba(255,255,255,0.4)',
                  paddingBottom: 1,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
              >
                Sign up free
              </Link>
            </p>
          </>
        )}

        {/* Back to home */}
        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link
            to="/"
            style={{
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            ← Back to Home
          </Link>
        </p>
      </div>

      {/* Input placeholder color override */}
      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.45) !important; }
      `}</style>
    </div>
  );
}