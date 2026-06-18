// FILE: frontend/src/pages/payment/PaymentSuccessPage.jsx
// Shown after successful Stripe payment — fetches order details + shows invoice summary

import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
  const [searchParams]  = useSearchParams();
  const sessionId       = searchParams.get('session_id');
  const navigate        = useNavigate();

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!sessionId) { navigate('/'); return; }

    const fetchSession = async () => {
      try {
        const res  = await fetch(`/api/payment/session/${sessionId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load order');
        // Normalise — backend may return `order` (webhook already ran) or `session`
        setOrder(data.order || data.session);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, navigate]);

  /* ── helpers ── */
  const fmtAmount = (cents, currency = 'usd') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);

  /* ── loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Confirming your payment…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error}</p>
          <Link to="/services" style={{ padding: '10px 24px', background: 'var(--accent-color)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const planName  = order?.planName  || 'Plan';
  const billing   = order?.billing   || 'monthly';
  const amount    = order?.amount    || 0;
  const currency  = order?.currency  || 'usd';
  const custEmail = order?.customerEmail || '';
  const custName  = order?.customerName  || 'Customer';
  const invoiceNo = order?.invoiceNumber || '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 520, width: '100%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        }}
      >
        {/* Green header */}
        <div style={{ background: 'linear-gradient(135deg,#065f46,#10b981)', padding: '40px 40px 32px', textAlign: 'center' }}>
          {/* Checkmark circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 240, damping: 18 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 32,
            }}
          >
            ✓
          </motion.div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 8px', fontFamily: 'Fraunces, serif' }}>
            Payment Successful!
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            A full invoice has been sent to <strong>{custEmail}</strong>
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 40px 36px' }}>

          {/* Order summary rows */}
          <div style={{ marginBottom: 28 }}>
            {[
              { label: 'Plan',      value: `${planName} Plan` },
              { label: 'Billing',   value: billing === 'yearly' ? 'Yearly (20% off)' : 'Monthly' },
              { label: 'Amount',    value: fmtAmount(amount, currency), highlight: true },
              ...(invoiceNo ? [{ label: 'Invoice #', value: invoiceNo }] : []),
              { label: 'Customer',  value: custName },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border-color)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: row.highlight ? '#10b981' : 'var(--text-primary)' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div style={{
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 10, padding: '14px 18px', marginBottom: 28, fontSize: 13,
            color: 'var(--text-secondary)', lineHeight: 1.7,
          }}>
            📧 &nbsp;Check your inbox — your invoice is on the way!<br />
            📋 &nbsp;Our team will contact you within <strong>24 hours</strong> to onboard you.
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <Link to="/dashboard" style={{
              display: 'block', textAlign: 'center',
              padding: '13px', background: 'var(--accent-color)',
              color: '#fff', borderRadius: 10, textDecoration: 'none',
              fontSize: 14, fontWeight: 600,
            }}>
              Go to Dashboard →
            </Link>
            <Link to="/" style={{
              display: 'block', textAlign: 'center',
              padding: '11px', background: 'transparent',
              color: 'var(--text-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 10, textDecoration: 'none', fontSize: 13,
            }}>
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
