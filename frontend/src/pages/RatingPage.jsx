// FILE: frontend/src/pages/RatingPage.jsx
// Interactive Rating Feedback page for TechHelp IT Solutions

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RatingPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editTestimonial = location.state?.editTestimonial;

  const [rating, setRating] = useState(editTestimonial ? editTestimonial.rating : 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({
    name: editTestimonial ? editTestimonial.name : (user?.name || ''),
    role: editTestimonial ? editTestimonial.role : (user?.role === 'admin' ? 'Admin, TechHelp' : ''),
    project: editTestimonial ? editTestimonial.project : '',
    text: editTestimonial ? editTestimonial.text : '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-redirect to testimonials page after submission
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/testimonials');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = editTestimonial ? `/api/testimonials/${editTestimonial._id}` : '/api/testimonials';
      const method = editTestimonial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          project: form.project,
          rating: rating,
          text: form.text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Server error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 3, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'DM Sans, sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
    marginTop: 8,
  };

  return (
    <div style={{ paddingBottom: 80, background: 'var(--bg-primary)', minHeight: '90vh', transition: 'background 0.3s' }}>
      {/* Back to Home Link */}
      <div style={{ padding: '32px 5% 0', maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 500,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-color)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ← Back to Home
        </Link>
      </div>

      <div style={{
        maxWidth: 600,
        margin: '40px auto 0',
        padding: '0 20px',
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          padding: '48px 44px',
          boxShadow: '0 20px 45px rgba(0,0,0,0.05)',
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'rgba(39, 201, 63, 0.1)',
                color: '#27c93f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, margin: '0 auto 24px',
                border: '1px solid rgba(39, 201, 63, 0.2)'
              }}>
                ✓
              </div>
              <h2 style={{
                fontFamily: 'Fraunces, serif', fontSize: 26,
                color: 'var(--text-primary)', marginBottom: 12,
              }}>{editTestimonial ? 'Feedback Updated!' : 'Feedback Submitted!'}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
                {editTestimonial
                  ? 'Your rating and feedback have been successfully updated.'
                  : 'Thank you for rating your experience with TechHelp IT Solutions. Your feedback is extremely valuable as we continuously refine our engineering standards.'}
              </p>
              <Link to="/testimonials" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                View Testimonials
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <h1 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 32, fontWeight: 700, color: 'var(--text-primary)',
                  letterSpacing: '-0.5px', marginBottom: 10,
                }}>
                  {editTestimonial ? 'Edit Your Rating' : 'Rate Our Work'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                  {editTestimonial
                    ? 'Update your rating, project details, and review message below.'
                    : 'We constantly strive to deliver high-performance IT solutions. Let us know about your project experience.'}
                </p>
              </div>

              {/* Star Selection Rating */}
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Your Overall Rating
                </label>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map(star => {
                    const isActive = hoverRating ? star <= hoverRating : star <= rating;
                    return (
                      <span
                        key={star}
                        style={{
                          fontSize: 36,
                          cursor: 'pointer',
                          color: isActive ? 'var(--gold)' : 'var(--border-color)',
                          transition: 'color 0.1s, transform 0.1s',
                          transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="rating-form-grid">
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Full Name
                  </label>
                  <input
                    name="name" type="text" required
                    placeholder="Arjun Mehta"
                    value={form.name} onChange={handleChange}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Role / Position
                  </label>
                  <input
                    name="role" type="text" required
                    placeholder="CEO, LaunchBridge"
                    value={form.role} onChange={handleChange}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Project Name / Scope
                </label>
                <input
                  name="project" type="text" required
                  placeholder="E-Commerce API Migration"
                  value={form.project} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Your Review Message
                </label>
                <textarea
                  name="text" required rows={4}
                  placeholder="Describe your experience collaborating with our engineering team..."
                  value={form.text} onChange={handleChange}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 6,
                  padding: '11px 16px',
                  color: '#ef4444',
                  fontSize: 13,
                  marginBottom: 20,
                  textAlign: 'left'
                }}>
                  ⚠️ {error}
                </div>
              )}

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
                {loading
                  ? (editTestimonial ? 'Updating Feedback...' : 'Submitting Feedback...')
                  : (editTestimonial ? 'Update Rating & Feedback →' : 'Submit Rating & Feedback →')}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .rating-form-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
