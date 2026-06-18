// FILE: frontend/src/pages/payment/PaymentCancelPage.jsx
// Shown when user cancels out of Stripe Checkout

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PaymentCancelPage() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 460, width: '100%', textAlign: 'center',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 20, padding: '48px 40px',
          boxShadow: '0 16px 60px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          border: '2px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 32,
        }}>
          ✕
        </div>

        <h1 style={{
          fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 800,
          color: 'var(--text-primary)', margin: '0 0 12px',
        }}>
          Payment Cancelled
        </h1>

        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
          No worries — you haven't been charged. Your plan selection is still saved.
          Come back whenever you're ready!
        </p>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <Link to="/services" style={{
            display: 'block', padding: '13px',
            background: 'var(--accent-color)', color: '#fff',
            borderRadius: 10, textDecoration: 'none',
            fontSize: 14, fontWeight: 600,
          }}>
            View Plans Again →
          </Link>
          <Link to="/" style={{
            display: 'block', padding: '11px',
            background: 'transparent', color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 10, textDecoration: 'none', fontSize: 13,
          }}>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
