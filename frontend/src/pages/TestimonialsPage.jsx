// FILE: frontend/src/pages/TestimonialsPage.jsx
// Dedicated route for the Testimonials section with a link to submit ratings

import { Link } from 'react-router-dom';
import Testimonials from '../components/sections/Testimonials';

export default function TestimonialsPage() {
  return (
    <div>
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

      <Testimonials />

      {/* CTA to submit ratings */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto 80px',
        padding: '0 5%',
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 24,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            Have we completed work for you?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, maxWidth: 580, margin: '0 auto 28px' }}>
            We'd love to hear your feedback. Submit a rating and tell us about your experience collaborating with TechHelp IT Solutions.
          </p>
          <Link to="/rate" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Rate Our Work →
          </Link>
        </div>
      </div>
    </div>
  );
}
