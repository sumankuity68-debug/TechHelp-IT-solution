import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        verifyEmail();
    }, []);

    const verifyEmail = async () => {
        try {
            const res = await fetch(`/api/auth/verify-email/${token}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
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
                textAlign: 'center',
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

                {loading ? (
                    <>
                        <div style={{
                            width: 64,
                            height: 64,
                            border: '4px solid rgba(102, 126, 234, 0.2)',
                            borderTop: '4px solid #667eea',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 24px',
                        }} />
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
                            Verifying your email...
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: 14 }}>
                            Please wait while we verify your email address
                        </p>
                    </>
                ) : success ? (
                    <>
                        <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
                            Email Verified!
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                            Your email has been successfully verified. You can now login to your account and access all features.
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 24 }}>
                            Redirecting to login in 3 seconds...
                        </p>
                        <Link
                            to="/login"
                            style={{
                                display: 'inline-block',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '12px 28px',
                                borderRadius: 8,
                                textDecoration: 'none',
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        >
                            Go to Login →
                        </Link>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: 64, marginBottom: 24 }}>❌</div>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ef4444', marginBottom: 12 }}>
                            Verification Failed
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 24 }}>
                            {error}
                        </p>
                        <Link
                            to="/login"
                            style={{
                                display: 'inline-block',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '12px 28px',
                                borderRadius: 8,
                                textDecoration: 'none',
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        >
                            Back to Login
                        </Link>
                    </>
                )}

                <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        </div>
    );
}