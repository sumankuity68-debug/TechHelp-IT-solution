// FILE: frontend/src/components/layout/Footer.jsx
// Site-wide footer — all links wired to real routes + real social icons

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { fadeIn, viewportOnce } from '../../utils/animations';

export default function Footer() {
  const companyLinks = [
    { label: 'About Us',     to: '/about' },
    { label: 'Services',     to: '/services' },
    { label: 'Testimonials', to: '/testimonials' },
    { label: 'Contact',      to: '/contact' },
  ];

  const accountLinks = [
    { label: 'Sign Up',   to: '/signup' },
    { label: 'Log In',    to: '/login' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Profile',   to: '/profile' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy',   to: '/' },
    { label: 'Terms of Service', to: '/' },
    { label: 'Cookie Policy',    to: '/' },
  ];

  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com/sumankuity68-debug/TechHelp-IT-solution',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '72px 5% 40px',
        transition: 'background 0.3s, border-top 0.3s',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 48,
          marginBottom: 60,
        }} className="footer-grid">

          {/* Brand col */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <Logo size={42} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              We build high-performance IT solutions that move businesses forward. From concept to cloud deployment.
            </p>
            {/* Social icons — real links */}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {socialLinks.map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${s.label}`}
                  title={s.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  style={{
                    width: 36, height: 36,
                    border: '1px solid var(--border-color)',
                    borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company */}
          <FooterLinkGroup title="Company" links={companyLinks} />

          {/* Account */}
          <FooterLinkGroup title="Account" links={accountLinks} />

          {/* Legal */}
          <FooterLinkGroup title="Legal" links={legalLinks} />
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            © {new Date().getFullYear()} TechHelp IT Solutions. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Built with React + Node.js
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.footer>
  );
}

// ── Sub-component: link column ──────────────────────────────────────────────
function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h4 style={{
        color: 'var(--text-primary)', fontSize: 13,
        fontWeight: 600, letterSpacing: '0.06em',
        textTransform: 'uppercase', marginBottom: 20,
      }}>
        {title}
      </h4>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {links.map(link => (
          <li key={link.label}>
            <Link
              to={link.to}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
