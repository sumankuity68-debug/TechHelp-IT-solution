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

        {/* Animated Spaceship Illustration */}
        <div style={{ position: 'relative', width: 280, height: 200, margin: '0 auto 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Rotating Constellations Background */}
          <motion.svg
            width="280"
            height="200"
            viewBox="0 0 280 200"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          >
            {/* Blinking Stars */}
            {[
              { cx: 30, cy: 40, r: 1.5, delay: 0.2 },
              { cx: 240, cy: 30, r: 2, delay: 0.6 },
              { cx: 50, cy: 150, r: 1, delay: 0.4 },
              { cx: 220, cy: 160, r: 1.5, delay: 0.8 },
              { cx: 140, cy: 20, r: 1.2, delay: 0 },
              { cx: 90, cy: 80, r: 2, delay: 1 },
              { cx: 200, cy: 90, r: 1, delay: 0.3 }
            ].map((star, i) => (
              <motion.circle
                key={i}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="var(--accent-color)"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Blinking constellation paths */}
            <motion.path
              d="M 30 40 L 90 80 L 50 150"
              stroke="var(--border-color)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="4 4"
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 240 30 L 200 90 L 220 160"
              stroke="var(--border-color)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="4 4"
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
            />
          </motion.svg>

          {/* Floating Spaceship */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
            style={{ zIndex: 1, width: 140, height: 140 }}
          >
            <svg width="140" height="140" viewBox="0 0 100 100">
              {/* Outer Glow Shield */}
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="1.5"
                strokeDasharray="5 15"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                style={{ opacity: 0.6 }}
              />

              {/* Spaceship Main Body */}
              {/* Cockpit Dome */}
              <path d="M 32 46 C 32 24, 68 24, 68 46 Z" fill="rgba(147, 197, 253, 0.35)" stroke="var(--accent-color)" strokeWidth="2" />
              
              {/* Little Astronaut Alien Inside */}
              <motion.circle
                cx="50"
                cy="38"
                r="6"
                fill="var(--accent-color)"
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
              <motion.path
                d="M 46 44 Q 50 42 54 44"
                stroke="var(--accent-color)"
                strokeWidth="2"
                fill="none"
              />

              {/* Saucer Body */}
              <ellipse cx="50" cy="52" rx="34" ry="12" fill="var(--bg-secondary)" stroke="var(--text-primary)" strokeWidth="2" />
              
              {/* Lights under the Saucer */}
              {[30, 40, 50, 60, 70].map((cx, idx) => (
                <motion.circle
                  key={cx}
                  cx={cx}
                  cy="52"
                  r="2"
                  fill="var(--accent-color)"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.9, 1.2, 0.9]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: idx * 0.25,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Thruster Flames / Beam */}
              <motion.path
                d="M 42 63 L 50 85 L 58 63 Z"
                fill="linear-gradient(to bottom, var(--accent-color), transparent)"
                animate={{
                  opacity: [0.4, 0.9, 0.4],
                  scaleY: [0.85, 1.15, 0.85]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.15,
                  ease: "easeInOut"
                }}
                style={{
                  fill: 'var(--accent-color)',
                  opacity: 0.7,
                  transformOrigin: '50% 63px'
                }}
              />
              
              {/* Small landing antennas */}
              <line x1="30" y1="58" x2="25" y2="68" stroke="var(--text-primary)" strokeWidth="2" />
              <circle cx="25" cy="68" r="1.5" fill="var(--text-primary)" />
              <line x1="70" y1="58" x2="75" y2="68" stroke="var(--text-primary)" strokeWidth="2" />
              <circle cx="75" cy="68" r="1.5" fill="var(--text-primary)" />
            </svg>
          </motion.div>
        </div>

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
