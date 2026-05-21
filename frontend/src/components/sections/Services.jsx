// FILE: frontend/src/components/sections/Services.jsx
// Services grid with interactive 3D Card Tilt effects
// Used in: pages/HomePage.jsx

import { useState } from 'react';

const services = [
  {
    number: '01',
    title: 'Web & Enterprise Systems',
    desc: 'Scalable web applications built with React, Node.js, and MongoDB. Secure architectures, fast load times, and cloud integration.',
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
  },
  {
    number: '02',
    title: 'Custom Software & APIs',
    desc: 'High-performance API design, microservices orchestration, and database tuning to drive your core operational needs.',
    tags: ['Microservices', 'GraphQL', 'Express', 'SQL/NoSQL'],
  },
  {
    number: '03',
    title: 'Cloud & DevOps Solutions',
    desc: 'Reliable cloud migrations, CI/CD pipeline automation, and containerized configurations for uninterrupted operations.',
    tags: ['AWS', 'Docker', 'GitHub Actions', 'Serverless'],
  },
  {
    number: '04',
    title: 'Digital Experience & UI',
    desc: 'Intuitive interface designs that map out seamless user flows. Interactive prototypes and stunning visuals designed for conversions.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
  },
];

function ServiceCard({ s }) {
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
    
    // Max tilt is 12 degrees
    setTilt({
      x: -py * 12,
      y: px * 12,
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
    padding: '40px 36px',
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
      ? '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 var(--border-color)' 
      : '0 4px 12px rgba(0, 0, 0, 0.05)',
  };

  return (
    <div
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Parallax Reflection/Glow */}
      {hovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${tilt.y * 10 + 50}% ${-tilt.x * 10 + 50}%, rgba(0, 123, 255, 0.04) 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      {/* Large number watermark (moves counter to tilt to exaggerate 3D depth) */}
      <div style={{
        fontFamily: 'Fraunces, serif',
        fontSize: 88, fontWeight: 700,
        color: 'rgba(0, 123, 255, 0.03)',
        position: 'absolute', top: 8, right: 16,
        lineHeight: 1, userSelect: 'none',
        transform: hovered 
          ? `translate3d(${-tilt.y * 1.5}px, ${tilt.x * 1.5}px, 15px)` 
          : 'translate3d(0, 0, 0)',
        transition: 'transform 0.1s ease-out',
        zIndex: 0,
      }}>
        {s.number}
      </div>

      {/* Floating inner content block */}
      <div style={{
        transform: hovered ? 'translateZ(30px)' : 'translateZ(0px)',
        transition: 'transform 0.2s ease-out',
        zIndex: 2,
        position: 'relative',
      }}>
        {/* Number */}
        <div style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
          color: 'var(--accent-color)', marginBottom: 20,
        }}>
          {s.number}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 22, fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: 16,
        }}>
          {s.title}
        </h3>

        {/* Description */}
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75, marginBottom: 28 }}>
          {s.desc}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {s.tags.map(tag => (
            <span key={tag} style={{
              padding: '4px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: 3,
              fontSize: 12, color: 'var(--text-secondary)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Arrow (shifts horizontally on hover) */}
        <div style={{
          marginTop: 32, fontSize: 18,
          color: 'var(--accent-color)',
          transform: hovered ? 'translateX(6px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
        }}>
          →
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section" style={{ background: 'var(--bg-primary)', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div className="section-label">What We Do</div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', flexWrap: 'wrap', gap: 20,
          }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(32px, 4vw, 50px)',
              fontWeight: 700, lineHeight: 1.1,
              color: 'var(--text-primary)', letterSpacing: '-1px',
              maxWidth: 480,
            }}>
              Enterprise solutions designed for <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>results.</em>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 360, lineHeight: 1.7 }}>
              End-to-end IT services. We cover modern cloud architecture, backend systems, and responsive designs.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} />
          ))}
        </div>

      </div>
    </section>
  );
}
