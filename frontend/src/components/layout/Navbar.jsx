// FILE: frontend/src/components/layout/Navbar.jsx
// Sticky navbar — profile dropdown when logged in, login/signup when not

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'About',        to: '/about'        },
  { label: 'Services',     to: '/services'     },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact',      to: '/contact'      },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [theme, setTheme]           = useState(() => localStorage.getItem('theme') || 'dark');
  const [dropdownOpen, setDropdown] = useState(false);
  const dropRef                     = useRef(null);
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate('/');
  };

  // Avatar: use uploaded image or initial letter
  const avatarContent = user?.avatar
    ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    : <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{user?.name?.charAt(0).toUpperCase()}</span>;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--nav-border)',
      transition: 'background 0.3s, border-bottom 0.3s',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 5%', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            TechHelp<span style={{ color: 'var(--accent-color)' }}>IT</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 36, listStyle: 'none' }} className="hide-mobile">
          {navLinks.map(link => (
            <li key={link.label}>
              <Link to={link.to} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 400, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>

          {/* Theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', userSelect: 'none' }}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'} style={{
              width: 44, height: 24, borderRadius: 12,
              background: theme === 'dark' ? 'var(--accent-color)' : '#cbd5e1',
              border: 'none', cursor: 'pointer', position: 'relative',
              padding: 0, display: 'flex', alignItems: 'center', transition: 'background-color 0.2s', outline: 'none',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#ffffff',
                position: 'absolute', left: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.28)',
              }} />
            </button>
          </div>

          {/* ── Logged IN: Profile avatar + dropdown ── */}
          {user ? (
            <div ref={dropRef} style={{ position: 'relative' }}>
              {/* Avatar button */}
              <button
                onClick={() => setDropdown(prev => !prev)}
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

              {/* Dropdown */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 220,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  overflow: 'hidden',
                  zIndex: 200,
                  animation: 'fadeSlideDown 0.15s ease',
                }}>
                  {/* User info header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </div>
                    <div style={{
                      display: 'inline-block', marginTop: 6,
                      padding: '2px 8px', background: 'rgba(59,130,246,0.12)',
                      borderRadius: 3, fontSize: 11, color: 'var(--accent-color)', fontWeight: 500,
                    }}>{user.role}</div>
                  </div>

                  {/* Menu items */}
                  {[
                    { label: '👤  My Profile', to: '/profile' },
                    { label: '📊  Dashboard',  to: '/dashboard' },
                    { label: '📬  My Inquiries', to: '/dashboard' },
                  ].map(item => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setDropdown(false)}
                      style={{
                        display: 'block', padding: '10px 16px',
                        fontSize: 13, color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{item.label}</Link>
                  ))}

                  <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block', width: '100%', padding: '10px 16px',
                      textAlign: 'left', fontSize: 13, color: '#ef4444',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >🚪  Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            /* ── NOT logged in: Login + Get Started ── */
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
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
