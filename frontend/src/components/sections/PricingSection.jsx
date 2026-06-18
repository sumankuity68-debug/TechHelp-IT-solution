// FILE: frontend/src/components/sections/PricingSection.jsx
// Pricing section for ServicesPage — 3 tiers with monthly/yearly toggle

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  fadeIn,
  fadeInUp,
  staggerContainerSlow,
  cardReveal,
  viewportOnce,
} from '../../utils/animations';

// ── Pricing data ─────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small businesses & individuals.',
    monthlyPrice: 29,
    yearlyPrice: 23,
    color: '#3b82f6',
    popular: false,
    features: [
      { text: '1 Web Application / Site',       included: true },
      { text: 'Responsive UI Design',            included: true },
      { text: 'REST API Integration',            included: true },
      { text: 'MongoDB Database Setup',          included: true },
      { text: 'JWT Authentication',              included: true },
      { text: 'Email Support (48h response)',    included: true },
      { text: 'Custom Admin Dashboard',          included: false },
      { text: 'Google OAuth & 2FA',              included: false },
      { text: 'Priority Support',                included: false },
      { text: 'Dedicated Expert Assigned',       included: false },
    ],
    cta: 'Get Started',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For growing startups & teams.',
    monthlyPrice: 79,
    yearlyPrice: 63,
    color: '#8b5cf6',
    popular: true,
    features: [
      { text: 'Up to 5 Web Applications',       included: true },
      { text: 'Responsive UI Design',            included: true },
      { text: 'REST API + GraphQL Integration',  included: true },
      { text: 'MongoDB + Redis Cache',           included: true },
      { text: 'JWT + Google OAuth + 2FA',        included: true },
      { text: 'Email Support (24h response)',    included: true },
      { text: 'Custom Admin Dashboard',          included: true },
      { text: 'CI/CD Pipeline Setup',            included: true },
      { text: 'Priority Support',                included: false },
      { text: 'Dedicated Expert Assigned',       included: false },
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Full-scale solutions for large teams.',
    monthlyPrice: 199,
    yearlyPrice: 159,
    color: '#10b981',
    popular: false,
    features: [
      { text: 'Unlimited Web Applications',     included: true },
      { text: 'Premium UI/UX Design System',    included: true },
      { text: 'Full API Architecture',           included: true },
      { text: 'Multi-DB + Cloud Storage',        included: true },
      { text: 'Full Auth Suite + Role Access',   included: true },
      { text: 'Slack / Live Support',            included: true },
      { text: 'Custom Admin Dashboard',          included: true },
      { text: 'CI/CD + Docker + AWS Deploy',     included: true },
      { text: 'Priority Support (2h response)',  included: true },
      { text: 'Dedicated Expert Assigned',       included: true },
    ],
    cta: 'Contact Sales',
  },
];

// ── Check / Cross icons ───────────────────────────────────────────────────────
function CheckIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.15" />
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="8" fill="rgba(148,163,184,0.1)" />
      <path d="M10 6l-4 4M6 6l4 4" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Single Pricing Card ───────────────────────────────────────────────────────
function PricingCard({ plan, yearly, onSelect, isLoading = false }) {
  const [hovered, setHovered] = useState(false);
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <motion.div
      variants={cardReveal}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: plan.popular
          ? `linear-gradient(160deg, ${plan.color}18 0%, var(--bg-secondary) 40%)`
          : 'var(--bg-secondary)',
        border: plan.popular
          ? `1px solid ${plan.color}50`
          : hovered
          ? `1px solid ${plan.color}30`
          : '1px solid var(--border-color)',
        borderRadius: 16,
        padding: '36px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        transform: plan.popular
          ? 'scale(1.04)'
          : hovered
          ? 'translateY(-6px)'
          : 'translateY(0)',
        boxShadow: plan.popular
          ? `0 20px 60px ${plan.color}20, 0 4px 20px rgba(0,0,0,0.12)`
          : hovered
          ? `0 16px 40px rgba(0,0,0,0.10)`
          : '0 4px 12px rgba(0,0,0,0.05)',
        zIndex: plan.popular ? 2 : 1,
      }}
    >
      {/* Most Popular badge */}
      {plan.popular && (
        <div style={{
          position: 'absolute',
          top: -14,
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(90deg, ${plan.color}, ${plan.color}cc)`,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          padding: '5px 18px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 16px ${plan.color}40`,
        }}>
          ✦ Most Popular
        </div>
      )}

      {/* Plan name + tagline */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'inline-block',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: plan.color,
          background: `${plan.color}12`,
          padding: '4px 12px', borderRadius: 20, marginBottom: 12,
        }}>
          {plan.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {plan.tagline}
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)', alignSelf: 'flex-start', marginTop: 10 }}>$</span>
          <span style={{
            fontSize: 56, fontWeight: 800, lineHeight: 1,
            color: 'var(--text-primary)',
            fontFamily: 'Fraunces, serif',
            transition: 'all 0.3s ease',
          }}>
            {price}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
            / mo{yearly && <span style={{ color: plan.color, fontWeight: 600 }}> (billed yearly)</span>}
          </span>
        </div>
        {yearly && (
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 6 }}>
            🎉 Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan)}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '13px',
          background: plan.popular ? plan.color : 'transparent',
          color: plan.popular ? '#fff' : plan.color,
          border: `1.5px solid ${plan.color}`,
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: 28,
          transition: 'all 0.2s ease',
          letterSpacing: '0.02em',
          opacity: isLoading ? 0.7 : 1,
        }}
        onMouseEnter={e => {
          if (isLoading) return;
          e.currentTarget.style.background = plan.color;
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = `0 6px 20px ${plan.color}40`;
        }}
        onMouseLeave={e => {
          if (isLoading) return;
          e.currentTarget.style.background = plan.popular ? plan.color : 'transparent';
          e.currentTarget.style.color = plan.popular ? '#fff' : plan.color;
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isLoading ? 'Redirecting...' : `${plan.cta} →`}
      </button>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 24 }} />

      {/* Feature list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            opacity: f.included ? 1 : 0.4,
          }}>
            {f.included ? <CheckIcon color={plan.color} /> : <CrossIcon />}
            <span style={{
              fontSize: 13,
              color: f.included ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration: f.included ? 'none' : 'none',
            }}>
              {f.text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null); // which button is loading
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleSelect = async (plan) => {
    // Enterprise → contact page
    if (plan.id === 'enterprise') {
      navigate('/contact');
      return;
    }

    // Must be logged in to pay
    if (!user) {
      navigate('/login');
      return;
    }

    setLoadingPlanId(plan.id);
    try {
      const res = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId:  plan.id,
          billing: yearly ? 'yearly' : 'monthly',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not create session');
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      alert(`Payment error: ${err.message}`);
      setLoadingPlanId(null);
    }
  };

  return (
    <section
      id="pricing"
      style={{
        background: 'var(--bg-primary)',
        padding: '96px 5%',
        transition: 'background 0.3s',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <motion.div variants={fadeIn} style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--accent-color)',
            background: 'rgba(59,130,246,0.08)',
            padding: '6px 18px', borderRadius: 20, marginBottom: 20,
          }}>
            Pricing Plans
          </motion.div>

          <motion.h2 variants={fadeInUp} style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            marginBottom: 16,
          }}>
            Simple, transparent{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>pricing.</em>
          </motion.h2>

          <motion.p variants={fadeInUp} style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            maxWidth: 520,
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            No hidden fees. No surprise bills. Pick the plan that fits your team — upgrade anytime.
          </motion.p>

          {/* ── Monthly / Yearly Toggle ── */}
          <motion.div variants={fadeIn} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 50,
            padding: '6px 8px 6px 18px',
          }}>
            <span style={{
              fontSize: 13,
              fontWeight: yearly ? 400 : 600,
              color: yearly ? 'var(--text-muted)' : 'var(--text-primary)',
              transition: 'all 0.2s',
            }}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(y => !y)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: 'none',
                background: yearly ? 'var(--accent-color)' : 'rgba(148,163,184,0.3)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.25s ease',
                padding: 0,
                outline: 'none',
              }}
              aria-label="Toggle billing period"
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: yearly ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
            <span style={{
              fontSize: 13,
              fontWeight: yearly ? 600 : 400,
              color: yearly ? 'var(--text-primary)' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>
              Yearly
            </span>
            {yearly && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#10b981',
                background: 'rgba(16,185,129,0.12)',
                padding: '3px 10px',
                borderRadius: 20,
                marginLeft: 4,
              }}>
                Save 20%
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* ── Pricing Cards Grid ── */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {plans.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              yearly={yearly}
              onSelect={handleSelect}
              isLoading={loadingPlanId === plan.id}
            />
          ))}
        </motion.div>

        {/* ── Footer note ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          style={{
            textAlign: 'center',
            marginTop: 56,
            padding: '28px 32px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: '🔒', text: 'Secure payments via Stripe' },
            { icon: '↩️', text: '30-day money-back guarantee' },
            { icon: '⚡', text: 'Cancel anytime, no questions asked' },
          ].map(item => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
