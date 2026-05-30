// FILE: frontend/src/components/layout/Footer.jsx
// Site-wide footer adapted to Light/Dark Mode theme variables

import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function Footer() {
  const footerLinks = {
    Company:  ['About Us', 'Our Work', 'Careers', 'Blog'],
    Services: ['Web Development', 'App Development', 'UI/UX Design', 'Digital Marketing'],
    Legal:    ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '72px 5% 40px',
      transition: 'background 0.3s, border-top 0.3s',
    }}>
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
            {/* Socials */}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {['Twitter', 'LinkedIn', 'GitHub', 'Dribbble'].map(s => (
                <a key={s} href="#" style={{
                  width: 36, height: 36,
                  border: '1px solid var(--border-color)',
                  borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 style={{
                color: 'var(--text-primary)', fontSize: 13,
                fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', marginBottom: 20,
              }}>
                {group}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      color: 'var(--text-secondary)', textDecoration: 'none',
                      fontSize: 14, transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            © 2026 TechHelp IT Solutions. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Built with React + Node.js
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 36px;
          }
        }
      `}</style>
    </footer>
  );
}
