// FILE: frontend/src/pages/RatingPage.jsx
// Interactive Rating Feedback page for TechHelp IT Solutions

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RatingPage() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ name: '', role: '', project: '', text: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call (prepared for Week 2 REST endpoints)
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
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
              }}>Feedback Submitted!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
                Thank you for rating your experience with TechHelp IT Solutions. Your feedback is extremely valuable as we continuously refine our engineering standards.
              </p>
              <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Go back to Homepage
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
                  Rate Our Work
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                  We constantly strive to deliver high-performance IT solutions. Let us know about your project experience.
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
                {loading ? 'Submitting Feedback...' : 'Submit Rating & Feedback →'}
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
