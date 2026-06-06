import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import GoogleAuthButton from '../../components/GoogleAuthButton';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    role: 'user',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 1: Submit signup form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    if (!form.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.role === 'admin' && !form.adminCode) {
      setError('Admin verification code is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          adminCode: form.role === 'admin' ? form.adminCode : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setEmail(form.email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit verification code (OTP)
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      showSuccess('Account created and email verified successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend verification code');
      }

      showSuccess('Verification code resent successfully! Please check your inbox.');
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
        maxWidth: 520,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: '48px 44px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
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

        {/* STEP 1: REGISTRATION DETAILS FORM */}
        {step === 1 && (
          <>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 8,
            }}>
              Create an account
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
              Join TechHelp IT Solutions today
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
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

              {/* Email */}
              <div style={{ marginBottom: 20 }}>
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
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                    outline: 'none',
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

              {/* Phone Number */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+1234567890"
                  value={form.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                    outline: 'none',
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

              {/* Password fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: 8,
                  }}>
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      color: '#1a1a1a',
                      fontSize: 14,
                      outline: 'none',
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
                  <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                    Password must be at least 6 characters
                  </p>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: 8,
                  }}>
                    Confirm
                  </label>
                  <input
                    name="confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      color: '#1a1a1a',
                      fontSize: 14,
                      outline: 'none',
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
              </div>

              {/* Role Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Account Type
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: form.role === 'user' ? '2px solid #667eea' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: form.role === 'user' ? '#f0f4ff' : '#f9fafb',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={form.role === 'user'}
                      onChange={handleChange}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 500, color: form.role === 'user' ? '#667eea' : '#374151' }}>
                      User
                    </span>
                  </label>
                  <label style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: form.role === 'admin' ? '2px solid #764ba2' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: form.role === 'admin' ? '#faf5ff' : '#f9fafb',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={form.role === 'admin'}
                      onChange={handleChange}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 500, color: form.role === 'admin' ? '#764ba2' : '#374151' }}>
                      Admin
                    </span>
                  </label>
                </div>
              </div>

              {/* Admin Code (shows only when admin is selected) */}
              {form.role === 'admin' && (
                <div style={{
                  marginBottom: 24,
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  border: '1px solid rgba(118, 75, 162, 0.3)',
                  borderRadius: 8,
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#764ba2',
                    marginBottom: 8,
                  }}>
                    🔐 Admin Verification Code
                  </label>
                  <input
                    name="adminCode"
                    type="text"
                    required
                    placeholder="Enter admin secret code"
                    value={form.adminCode}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#fff',
                      border: '1px solid #764ba2',
                      borderRadius: 8,
                      color: '#1a1a1a',
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'monospace',
                      letterSpacing: '1px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ fontSize: 11, color: '#764ba2', marginTop: 8, fontStyle: 'italic' }}>
                    ⚠️ Only authorized personnel have access to the admin code. Contact your administrator if needed.
                  </p>
                </div>
              )}

              {/* Submit */}
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
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', marginTop: 20 }}>
                By signing up you agree to our{' '}
                <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>Terms</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>Privacy Policy</a>
              </p>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              margin: '24px 0 16px',
              color: '#9ca3af',
              fontSize: 12,
            }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              OR
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {/* Google Sign-Up */}
            <GoogleAuthButton label="Sign up with Google" darkMode={false} mode="signup" />

            <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 20 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </>
        )}

        {/* STEP 2: VERIFICATION OTP CODE FORM */}
        {step === 2 && (
          <>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 8,
            }}>
              Verify Your Email
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: '1.5' }}>
              We have sent a 6-digit verification code to <strong>{email}</strong>. Please enter the code below to complete your registration.
            </p>

            <form onSubmit={handleVerifyOTP}>
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: 8,
                }}>
                  Verification Code (6-Digits)
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
                {loading ? 'Verifying...' : 'Verify Code & Sign Up →'}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleResendOTP}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  outline: 'none',
                }}
              >
                Didn't receive the code? Resend Code
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setOtp('');
                }}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4b5563',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  outline: 'none',
                }}
              >
                ← Back to Details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}