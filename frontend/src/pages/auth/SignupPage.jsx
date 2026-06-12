import { useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import GoogleAuthButton from '../../components/GoogleAuthButton';

const initialState = {
  step: 1,
  email: '',
  otp: '',
  form: {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    role: 'user',
    adminCode: ''
  },
  error: '',
  loading: false
};

function signupReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value }
      };
    case 'SET_OTP':
      return {
        ...state,
        otp: action.value
      };
    case 'SET_STEP':
      return {
        ...state,
        step: action.value
      };
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.value
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.value
      };
    case 'START_LOADING':
      return {
        ...state,
        loading: true,
        error: ''
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false
      };
    case 'REGISTRATION_SUCCESS':
      return {
        ...state,
        loading: false,
        email: action.email,
        step: 2,
        error: ''
      };
    default:
      return state;
  }
}

export default function SignupPage() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const { step, email, otp, form, error, loading } = state;

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });
  };

  // Step 1: Submit signup form
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ERROR', value: '' });

    if (form.password !== form.confirm) {
      dispatch({ type: 'SET_ERROR', value: 'Passwords do not match' });
      return;
    }

    if (!form.phone.trim()) {
      dispatch({ type: 'SET_ERROR', value: 'Phone number is required' });
      return;
    }

    if (form.password.length < 6) {
      dispatch({ type: 'SET_ERROR', value: 'Password must be at least 6 characters' });
      return;
    }

    if (form.role === 'admin' && !form.adminCode) {
      dispatch({ type: 'SET_ERROR', value: 'Admin verification code is required' });
      return;
    }

    dispatch({ type: 'START_LOADING' });

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

      dispatch({ type: 'REGISTRATION_SUCCESS', email: form.email });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', value: err.message });
    } finally {
      dispatch({ type: 'STOP_LOADING' });
    }
  };

  // Step 2: Verify 6-digit verification code (OTP)
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ERROR', value: '' });
    dispatch({ type: 'START_LOADING' });

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
      dispatch({ type: 'SET_ERROR', value: err.message });
    } finally {
      dispatch({ type: 'STOP_LOADING' });
    }
  };

  // Step 2: Resend OTP
  const handleResendOTP = async () => {
    dispatch({ type: 'SET_ERROR', value: '' });
    dispatch({ type: 'START_LOADING' });

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
      dispatch({ type: 'SET_ERROR', value: err.message });
    } finally {
      dispatch({ type: 'STOP_LOADING' });
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
      position: 'relative',
      overflow: 'hidden',
    }}>
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

      <div style={{
        width: '100%',
        maxWidth: 520,
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: 24,
        padding: '48px 44px',
        boxShadow: '0 8px 48px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255,255,255,0.3) inset',
        position: 'relative',
        zIndex: 1,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            color: 'white',
            marginBottom: 36,
            letterSpacing: '-0.5px',
          }}>
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

        {error && (
          <div style={{
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
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: REGISTRATION DETAILS FORM */}
        {step === 1 && (
          <>
            <h2 style={{
              fontSize: 30,
              fontWeight: 700,
              color: 'white',
              marginBottom: 8,
              letterSpacing: '-0.5px',
            }}>
              Create an account
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 14, marginBottom: 32 }}>
              Join TechHelp IT Solutions today
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
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
                    padding: '13px 15px',
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

              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
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
                    padding: '13px 15px',
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

              {/* Phone Number */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
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
                    padding: '13px 15px',
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

              {/* Password fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
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
                      padding: '13px 15px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: 12,
                      color: 'white',
                      fontSize: 14,
                      outline: 'none',
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
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                    Password must be at least 6 characters
                  </p>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
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
                      padding: '13px 15px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: 12,
                      color: 'white',
                      fontSize: 14,
                      outline: 'none',
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

              {/* Role Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}>
                  Account Type
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: form.role === 'user' ? '2px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    background: form.role === 'user' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
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
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>
                      User
                    </span>
                  </label>
                  <label style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: form.role === 'admin' ? '2px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    background: form.role === 'admin' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
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
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>
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
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 12,
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
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
                      padding: '13px 15px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: 12,
                      color: 'white',
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'monospace',
                      letterSpacing: '1px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.6)', marginTop: 8, fontStyle: 'italic' }}>
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
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 20 }}>
                By signing up you agree to our{' '}
                <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>Terms</a>
                {' '}and{' '}
                <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>Privacy Policy</a>
              </p>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              margin: '24px 0 16px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 12,
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              OR
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Google Sign-Up */}
            <GoogleAuthButton label="Sign up with Google" darkMode={true} mode="signup" />

            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 24 }}>
              Already have an account?{' '}
              <Link
                to="/login"
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
                Sign in
              </Link>
            </p>
          </>
        )}

        {/* STEP 2: VERIFICATION OTP CODE FORM */}
        {step === 2 && (
          <>
            <h2 style={{
              fontSize: 30,
              fontWeight: 700,
              color: 'white',
              marginBottom: 8,
              letterSpacing: '-0.5px',
            }}>
              Verify Your Email
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 14, marginBottom: 24, lineHeight: '1.5' }}>
              We have sent a 6-digit verification code to <strong>{email}</strong>. Please enter the code below to complete your registration.
            </p>

            <form onSubmit={handleVerifyOTP}>
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}>
                  Verification Code (6-Digits)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => dispatch({ type: 'SET_OTP', value: e.target.value.replace(/\D/g, '') })}
                  style={{
                    width: '100%',
                    padding: '13px 15px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                    letterSpacing: '4px',
                    textAlign: 'center',
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
                  color: 'rgba(255, 255, 255, 0.85)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  outline: 'none',
                }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                Didn't receive the code? Resend Code
              </button>

              <button
                onClick={() => {
                  dispatch({ type: 'SET_STEP', value: 1 });
                  dispatch({ type: 'SET_OTP', value: '' });
                }}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  outline: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                ← Back to Details
              </button>
            </div>
          </>
        )}
      </div>

      {/* Input placeholder color override */}
      <style>{`
        input::placeholder { color: rgba(255, 255, 255, 0.45) !important; }
      `}</style>
    </div>
  );
}