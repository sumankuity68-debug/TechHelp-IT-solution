// FILE: frontend/src/components/layout/Navbar.jsx
// Sticky navbar — desktop nav + mobile hamburger menu + profile dropdown

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../ui/Logo';

const navLinks = [
  { label: 'About',        to: '/about'        },
  { label: 'Services',     to: '/services'     },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact',      to: '/contact'      },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [dropdownOpen, setDropdown]   = useState(false);
  const [mobileMenuOpen, setMobileMenu] = useState(false);
  const dropRef                       = useRef(null);
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const location                      = useLocation();
  const { theme, toggleTheme }        = useTheme();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
    setDropdown(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setDropdown(false);
    setMobileMenu(false);
    navigate('/');
  };

  const avatarContent = user?.avatar
    ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    : <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{user?.name?.charAt(0).toUpperCase()}</span>;

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--nav-border)',
          transition: 'background 0.3s, border-bottom 0.3s',
        }}
      >
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 5%', height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo size={36} />
          </Link>

          {/* Desktop links */}
          <ul style={{ display: 'flex', gap: 36, listStyle: 'none' }} className="nav-desktop">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  style={{
                    color: location.pathname === link.to ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: 'none', fontSize: 14, fontWeight: 400,
                    transition: 'color 0.2s',
                    borderBottom: location.pathname === link.to ? '1px solid var(--accent-color)' : '1px solid transparent',
                    paddingBottom: 2,
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = location.pathname === link.to ? 'var(--text-primary)' : 'var(--text-secondary)'}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side — desktop */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }} className="nav-desktop">

            {/* Theme toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', userSelect: 'none' }}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
              <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: theme === 'dark' ? 'var(--accent-color)' : '#cbd5e1',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  padding: 0, display: 'flex', alignItems: 'center', transition: 'background-color 0.2s', outline: 'none',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#ffffff',
                  position: 'absolute', left: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.28)',
                }} />
              </button>
            </div>

            {/* Auth section */}
            {user ? (
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdown(prev => !prev)}
                  aria-label="Open profile menu"
                  title={user.name}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'var(--accent-color)',
                    border: `2px solid ${dropdownOpen ? 'var(--accent-color)' : 'var(--border)'}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', padding: 0, outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: dropdownOpen ? '0 0 0 3px rgba(59,130,246,0.25)' : 'none',
                  }}
                >{avatarContent}</button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                        width: 220,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        overflow: 'hidden',
                        zIndex: 200,
                      }}
                    >
                      {/* User info */}
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        <div style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', background: 'rgba(59,130,246,0.12)', borderRadius: 3, fontSize: 11, color: 'var(--accent-color)', fontWeight: 500 }}>
                          {user.role}
                        </div>
                      </div>

                      {[
                        { label: '👤  My Profile', to: '/profile' },
                        { label: '📊  Dashboard',  to: user.role === 'admin' ? '/admin' : '/dashboard' },
                        { label: user.role === 'admin' ? '📬  All Inquiries' : '📬  My Inquiries', to: user.role === 'admin' ? '/admin' : '/dashboard' },
                      ].map(item => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setDropdown(false)}
                          style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: 'var(--text-primary)', textDecoration: 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.07)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >{item.label}</Link>
                      ))}

                      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                      <button
                        onClick={handleLogout}
                        style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >🚪  Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 400, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >Login</Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger button (mobile only) ── */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileMenu(prev => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 8, color: 'var(--text-primary)',
              flexDirection: 'column', gap: 5, alignItems: 'center',
            }}
          >
            <motion.div
              animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: 22, height: 2, background: 'currentColor', borderRadius: 1 }}
            />
            <motion.div
              animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
              style={{ width: 22, height: 2, background: 'currentColor', borderRadius: 1 }}
            />
            <motion.div
              animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: 22, height: 2, background: 'currentColor', borderRadius: 1 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile slide-out menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenu(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 98,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(2px)',
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 280, zIndex: 99,
                background: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border-color)',
                padding: '24px 0',
                display: 'flex', flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Drawer header */}
              <div style={{ padding: '0 24px 20px', borderBottom: '1px solid var(--border-color)', marginBottom: 8 }}>
                <Logo size={32} />
              </div>

              {/* Nav links */}
              <nav style={{ padding: '0 12px' }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenu(false)}
                      style={{
                        display: 'block', padding: '13px 12px',
                        fontSize: 16, color: location.pathname === link.to ? 'var(--accent-color)' : 'var(--text-primary)',
                        textDecoration: 'none', borderRadius: 8,
                        fontWeight: location.pathname === link.to ? 500 : 400,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border-color)', margin: '12px 24px' }} />

              {/* Auth + theme */}
              <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {user ? (
                  <>
                    {/* User info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {avatarContent}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.role}</div>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setMobileMenu(false)} style={{ padding: '11px 16px', background: 'var(--bg-tertiary)', borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', textDecoration: 'none', textAlign: 'center' }}>
                      My Profile
                    </Link>
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenu(false)} style={{ padding: '11px 16px', background: 'var(--bg-tertiary)', borderRadius: 8, fontSize: 14, color: 'var(--text-primary)', textDecoration: 'none', textAlign: 'center' }}>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} style={{ padding: '11px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 14, color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenu(false)} className="btn-outline" style={{ textAlign: 'center', display: 'block' }}>
                      Log In
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenu(false)} className="btn-primary" style={{ textAlign: 'center', display: 'block' }}>
                      Get Started
                    </Link>
                  </>
                )}

                {/* Theme toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, padding: '12px 0', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    {theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: theme === 'dark' ? 'var(--accent-color)' : '#cbd5e1',
                      border: 'none', cursor: 'pointer', position: 'relative',
                      padding: 0, display: 'flex', alignItems: 'center', outline: 'none',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#ffffff',
                      position: 'absolute', left: 3,
                      transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
                      transition: 'transform 0.2s',
                    }} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}
