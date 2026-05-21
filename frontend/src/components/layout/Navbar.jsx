// FILE: frontend/src/components/layout/Navbar.jsx
// Sticky top navbar with persistent routing links and Light/Dark Mode switch

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'About',        to: '/about'        },
  { label: 'Services',     to: '/services'     },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact',      to: '/contact'      },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 100,
    background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
    backdropFilter: 'blur(14px)',
    borderBottom: '1px solid var(--nav-border)',
    transition: 'background 0.3s, border-bottom 0.3s',
  };

  return (
    <nav style={navStyle}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 5%',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 22, fontWeight: 700,
            color: 'var(--text-primary)', letterSpacing: '-0.5px',
          }}>
            TechHelp<span style={{ color: 'var(--accent-color)' }}>IT</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul style={{
          display: 'flex', gap: 36,
          listStyle: 'none',
        }} className="hide-mobile">
          {navLinks.map(link => (
            <li key={link.label}>
              <Link to={link.to} style={{
                color: 'var(--text-secondary)', textDecoration: 'none',
                fontSize: 14, fontWeight: 400,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA buttons + Theme Switch */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {/* Mobile-style Toggle Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              userSelect: 'none'
            }}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <button
              onClick={toggleTheme}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: theme === 'dark' ? 'var(--accent-color)' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s ease',
                outline: 'none',
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#ffffff',
                position: 'absolute',
                left: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.28)',
              }} />
            </button>
          </div>

          <Link to="/login" style={{
            color: 'var(--text-secondary)', textDecoration: 'none',
            fontSize: 14, fontWeight: 400,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >
            Login
          </Link>
          <Link to="/signup" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
            Get Started
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </nav>
  );
}
