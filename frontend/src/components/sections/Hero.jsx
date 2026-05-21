// FILE: frontend/src/components/sections/Hero.jsx
// Landing page hero section with 3D Parallax graphics and Theme support

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatStatNum = (numStr) => {
    const match = numStr.match(/^(\d+)(.*)$/);
    if (match) {
      const [_, numberPart, suffixPart] = match;
      return (
        <>
          <span style={{ color: 'var(--accent-color)' }}>{numberPart}</span>
          <span style={{ color: 'var(--text-primary)' }}>{suffixPart}</span>
        </>
      );
    }
    return <span style={{ color: 'var(--text-primary)' }}>{numStr}</span>;
  };

  return (
    <section style={{
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      padding: '60px 5%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
      transition: 'background 0.3s ease',
    }}>



      {/* Right Glow (adapted to Blue accent) */}
      <div style={{
        position: 'absolute', right: '-10%', top: '10%',
        width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0, 123, 255, 0.06) 0%, transparent 70%)',
      }} />

      {/* Left Glow */}
      <div style={{
        position: 'absolute', left: '-5%', bottom: '10%',
        width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0, 123, 255, 0.04) 0%, transparent 70%)',
      }} />

      {/* Content Wrapper */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 60,
        alignItems: 'center',
      }} className="hero-grid">

        {/* Left Column */}
        <div style={{ zIndex: 2 }}>
          {/* Eyebrow label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
            color: 'var(--accent-color)', textTransform: 'uppercase', marginBottom: 28,
          }}>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--accent-color)' }} />
            TechHelp IT Solutions
          </div>

          {/* Main heading */}
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(40px, 5.5vw, 68px)',
            fontWeight: 700, lineHeight: 1.08,
            color: 'var(--text-primary)', letterSpacing: '-1.5px',
            marginBottom: 24,
          }}>
            Next-Gen IT Solutions<br />
            Architected for <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>Scale.</em>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 16, color: 'var(--text-secondary)',
            maxWidth: 540, lineHeight: 1.75,
            marginBottom: 40,
          }}>
            We build robust custom software, secure cloud infrastructure, and modern digital architectures.
            Empowering businesses with enterprise-grade technology that accelerates growth.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link to="/contact" className="btn-primary">Start a Project</Link>
            <Link to="/services" className="btn-outline">Our Solutions</Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 48, flexWrap: 'wrap',
            paddingTop: 36,
            borderTop: '1px solid var(--border-color)',
          }}>
            {[
              { num: '120+', label: 'Deployments Delivered'  },
              { num: '98%',  label: 'Client retention' },
              { num: '5yr',  label: 'Industry Expertise' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 34, fontWeight: 700,
                  color: 'var(--text-primary)', letterSpacing: '-1px',
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {formatStatNum(stat.num)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Parallax Visuals */}
        <div style={{
          position: 'relative',
          height: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
        }} className="hide-mobile">
          
          {/* Main 3D Card */}
          <div style={{
            width: 340,
            height: 240,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            transform: `rotateY(${mousePos.x * 25}deg) rotateX(${-mousePos.y * 25}deg) translateZ(50px)`,
            transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), background 0.3s, border 0.3s',
            position: 'absolute',
            zIndex: 3,
          }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc3545' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffc107' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28a745' }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 6, fontFamily: 'monospace' }}>techhelp-node-service</span>
            </div>
            
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div style={{ color: 'var(--accent-color)' }}>$ npm run build:prod</div>
              <div>&gt; Bundling assets... (1.4s)</div>
              <div style={{ color: '#28a745' }}>&gt; Cluster initialized on port 8080</div>
              <div style={{ color: 'var(--accent-color)' }}>&gt; DB cluster status: [CONNECTED]</div>
              <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                <span className="pulse-light" /> Real-time telemetry active
              </div>
            </div>
          </div>

          {/* Secondary 3D Card */}
          <div style={{
            width: 200,
            height: 140,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: 16,
            transform: `rotateY(${mousePos.x * 40}deg) rotateX(${-mousePos.y * 40}deg) translate3d(-100px, 120px, 80px)`,
            transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), background 0.3s, border 0.3s',
            position: 'absolute',
            zIndex: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-color)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cloud Network
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Fraunces, serif' }}>
              99.99%
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              Uptime SLA Guaranteed
            </div>
            <div style={{
              width: '100%', height: 4, background: 'var(--border-color)', borderRadius: 2, marginTop: 16, overflow: 'hidden'
            }}>
              <div style={{ width: '92%', height: '100%', background: 'var(--accent-color)', borderRadius: 2 }} />
            </div>
          </div>

          {/* Third 3D Card */}
          <div style={{
            width: 180,
            height: 120,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: 16,
            transform: `rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg) translate3d(120px, -110px, 20px)`,
            transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), background 0.3s, border 0.3s',
            position: 'absolute',
            zIndex: 2,
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Pipelines
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              14 <span style={{ fontSize: 11, color: '#28a745', fontWeight: 400 }}>+3 running</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ flex: 1, height: 12, background: i <= 4 ? 'var(--accent-color)' : 'var(--border-color)', borderRadius: 1 }} />
              ))}
            </div>
          </div>

          {/* Floating Spheres */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(0, 123, 255, 0.1) 0%, transparent 80%)',
            filter: 'blur(8px)',
            transform: `translate3d(${mousePos.x * -60}px, ${mousePos.y * -60}px, -100px)`,
            transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
            position: 'absolute',
            top: '15%',
            left: '10%',
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(0, 123, 255, 0.05) 0%, transparent 80%)',
            filter: 'blur(12px)',
            transform: `translate3d(${mousePos.x * -30}px, ${mousePos.y * -30}px, -50px)`,
            transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            pointerEvents: 'none',
          }} />

        </div>

      </div>

      <style>{`
        .pulse-light {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #28a745;
          box-shadow: 0 0 8px #28a745;
          animation: pulse 1.6s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }

        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid > div {
            margin: 0 auto;
          }
          .hero-grid div {
            justify-content: center;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
