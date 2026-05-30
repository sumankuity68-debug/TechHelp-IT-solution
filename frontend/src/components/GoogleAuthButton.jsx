import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * GoogleAuthButton
 * @param {string}   label     - Button text
 * @param {boolean}  darkMode  - Use white text / transparent bg (for dark glassmorphism pages)
 * @param {'login'|'signup'} mode
 *   - 'login'  → only existing accounts allowed (blocks new users)
 *   - 'signup' → creates a new account if none exists
 */
export default function GoogleAuthButton({ label = 'Continue with Google', darkMode = false, mode = 'login' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [noAccount, setNoAccount] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    setError('');
    setNoAccount(false);

    try {
      // Fetch Google user profile using the access_token
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const userInfo = await userInfoRes.json();

      // Choose endpoint based on mode
      const endpoint = mode === 'signup'
        ? 'http://localhost:5000/api/auth/google-signup'  // creates new users
        : 'http://localhost:5000/api/auth/google-token';  // existing users only

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // No account found (login mode) — show prompt to sign up
        if (data.requiresSignup) {
          setNoAccount(true);
          return;
        }
        throw new Error(data.message || 'Google authentication failed');
      }

      login(data.user, data.token);

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please try again.');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const baseStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'all 0.2s ease',
    letterSpacing: '0.01em',
    opacity: loading ? 0.7 : 1,
  };

  const darkStyle = {
    ...baseStyle,
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
  };

  const lightStyle = {
    ...baseStyle,
    background: '#ffffff',
    border: '1.5px solid #e5e7eb',
    color: '#1a1a1a',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  };

  return (
    <div>
      {/* No account found — prompt to sign up */}
      {noAccount && (
        <div style={{
          background: darkMode ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.5)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 12,
          textAlign: 'center',
        }}>
          <p style={{
            color: darkMode ? '#fde68a' : '#92400e',
            fontSize: 13,
            fontWeight: 600,
            margin: '0 0 6px 0',
          }}>
            🚫 No account found with this Google email.
          </p>
          <p style={{
            color: darkMode ? 'rgba(253,230,138,0.8)' : '#a16207',
            fontSize: 12,
            margin: '0 0 10px 0',
          }}>
            You must sign up with email first, then you can use Google to sign in.
          </p>
          <Link
            to="/signup"
            style={{
              display: 'inline-block',
              background: '#f59e0b',
              color: 'white',
              padding: '7px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            Sign Up Now →
          </Link>
        </div>
      )}

      {/* Generic error */}
      {error && (
        <div style={{
          background: darkMode ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.35)',
          borderRadius: 8,
          padding: '10px 14px',
          color: darkMode ? '#fca5a5' : '#ef4444',
          fontSize: 13,
          marginBottom: 12,
          textAlign: 'center',
        }}>
          ⚠️ {error}
        </div>
      )}
      <button
        type="button"
        onClick={() => !loading && googleLogin()}
        disabled={loading}
        style={darkMode ? darkStyle : lightStyle}
        onMouseEnter={(e) => {
          if (!loading) {
            if (darkMode) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            } else {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.12)';
            }
          }
        }}
        onMouseLeave={(e) => {
          if (darkMode) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          } else {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
          }
        }}
      >
        {loading ? (
          <>
            <span style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              border: darkMode ? '2px solid rgba(255,255,255,0.3)' : '2px solid #e5e7eb',
              borderTopColor: darkMode ? 'white' : '#667eea',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            Connecting...
          </>
        ) : (
          <>
            {/* Google G Logo SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {label}
          </>
        )}
      </button>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
