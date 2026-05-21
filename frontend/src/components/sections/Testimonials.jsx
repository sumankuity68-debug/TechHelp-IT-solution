// FILE: frontend/src/components/sections/Testimonials.jsx
// Client testimonials with 3D Card Tilt effects
// Used in: pages/HomePage.jsx

import { useState } from 'react';

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'CEO, LaunchBridge',
    initial: 'A',
    rating: 5,
    text: 'TechHelp IT Solutions delivered our cloud dashboard in 6 weeks flat. The containerized configuration and API quality were exceptional. Our internal systems run flawlessly now.',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, StyleVault',
    initial: 'P',
    rating: 5,
    text: 'Our analytics throughput increased by 40% and server overhead dropped significantly after TechHelp migrated our architecture. Their team has true enterprise capabilities.',
  },
  {
    name: 'Rahul Banerjee',
    role: 'CTO, FinTrack',
    initial: 'R',
    rating: 5,
    text: 'The distributed transaction API they designed handles high volumes with zero lag. Excellent database tuning, clean microservices interface. These guys understand systems engineering.',
  },
];

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: 'var(--gold)', fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    // Normalized position from -0.5 to 0.5
    const px = (x / box.width) - 0.5;
    const py = (y / box.height) - 0.5;
    
    // Max tilt is 10 degrees
    setTilt({
      x: -py * 10,
      y: px * 10,
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    padding: '36px 32px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    transform: hovered 
      ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` 
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: hovered 
      ? 'transform 0.1s ease-out, background 0.3s, box-shadow 0.3s' 
      : 'transform 0.5s ease-out, background 0.3s, box-shadow 0.3s',
    boxShadow: hovered 
      ? '0 20px 45px rgba(0, 0, 0, 0.15), inset 0 1px 0 var(--border-color)' 
      : '0 4px 15px rgba(0, 0, 0, 0.05)',
  };

  return (
    <div
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reflection effect */}
      {hovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${tilt.y * 10 + 50}% ${-tilt.x * 10 + 50}%, rgba(0, 123, 255, 0.04) 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      {/* Content inside card with 3D translation */}
      <div style={{
        transform: hovered ? 'translateZ(25px)' : 'translateZ(0px)',
        transition: 'transform 0.2s ease-out',
        zIndex: 2,
        position: 'relative',
      }}>
        <Stars count={t.rating} />

        <p style={{
          color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8,
          marginBottom: 32,
          fontStyle: 'italic',
        }}>
          "{t.text}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'var(--accent-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fraunces, serif',
            fontSize: 16, fontWeight: 700, color: '#fff',
            flexShrink: 0,
          }}>
            {t.initial}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>
              {t.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {t.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="section" style={{ background: 'var(--bg-primary)', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Client Stories
          </div>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(30px, 4vw, 48px)',
            fontWeight: 700, color: 'var(--text-primary)',
            letterSpacing: '-1px', lineHeight: 1.1,
          }}>
            Trusted by enterprise <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>builders.</em>
          </h2>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

      </div>
    </section>
  );
}
