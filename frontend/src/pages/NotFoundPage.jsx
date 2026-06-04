// FILE: frontend/src/pages/NotFoundPage.jsx
// 404 Page — shown for any unmatched route

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '40px 5%',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 560 }}
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(80px, 18vw, 160px)',
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--accent-color)',
            opacity: 0.15,
            letterSpacing: '-4px',
            userSelect: 'none',
            marginBottom: -20,
          }}
        >
          404
        </motion.div>

        {/* Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{ fontSize: 64, marginBottom: 24 }}
        >
          🛸
        </motion.div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 'clamp(26px, 4vw, 38px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 16,
          letterSpacing: '-0.5px',
        }}>
          Page Not Found
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 16,
          lineHeight: 1.75,
          marginBottom: 40,
          maxWidth: 400,
          margin: '0 auto 40px',
        }}>
          The page you're looking for has been moved, deleted, or never existed.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary">
            ← Back to Home
          </Link>
          <Link to="/contact" className="btn-outline">
            Contact Support
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Quick links
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Services', to: '/services' },
              { label: 'About',    to: '/about' },
              { label: 'Login',    to: '/login' },
            ].map(link => (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  fontSize: 14,
                  color: 'var(--accent-color)',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.target.style.opacity = '0.7'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
