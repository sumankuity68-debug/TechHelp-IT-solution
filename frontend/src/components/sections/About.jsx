// FILE: frontend/src/components/sections/About.jsx
// About section with theme variable support + Framer Motion scroll-triggered animations

import { motion } from 'framer-motion';
import {
  fadeInUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerContainerSlow,
  cardReveal,
  viewportOnce,
} from '../../utils/animations';

export default function About() {
  const pillars = [
    {
      icon: '◈',
      title: 'Our Mission',
      text: 'Deliver pixel-perfect, performant web applications that solve real business problems — on time, every time.',
    },
    {
      icon: '◉',
      title: 'Our Vision',
      text: 'Become the go-to digital partner for ambitious startups across South Asia and beyond.',
    },
    {
      icon: '◎',
      title: 'Our Process',
      text: 'Discovery → Design → Development → Deployment. We keep you in the loop at every stage.',
    },
  ];

  return (
    <section id="about" className="section" style={{ background: 'var(--bg-primary)', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Layout: left text + right pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80, alignItems: 'start',
        }} className="about-grid">

          {/* Left — slides in from left */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="section-label">Who We Are</div>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(32px, 4vw, 50px)',
              fontWeight: 700, lineHeight: 1.1,
              color: 'var(--text-primary)', letterSpacing: '-1px',
              marginBottom: 24,
            }}>
              A studio that treats <em style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>your product</em>{' '}
              like our own.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
              TechHelp IT Solutions was founded by developers and architects who were tired of seeing great ideas
              fail due to poor execution. We're a lean team of systems engineers, developers, and designers
              who care deeply about craft, performance, stability, and business outcomes.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8 }}>
              Whether you're launching your first product or scaling an existing one,
              we bring the technical depth and design sensibility to make it excellent.
            </p>

            {/* Mini badges — stagger in */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 32 }}
            >
              {['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'AWS', 'Figma'].map(tech => (
                <motion.span
                  key={tech}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.06, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    padding: '6px 14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 4, fontSize: 13, color: 'var(--text-secondary)',
                    transition: 'background 0.3s, border 0.3s',
                    cursor: 'default',
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Pillars, stagger in from right */}
          <motion.div
            variants={staggerContainerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                variants={cardReveal}
                whileHover={{ x: 6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderLeft: '3px solid var(--accent-color)',
                  borderRadius: 8,
                  padding: '28px 28px',
                  transition: 'background 0.3s, border 0.3s',
                }}
              >
                <div style={{ fontSize: 22, color: 'var(--accent-color)', marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 18, fontWeight: 600,
                  color: 'var(--text-primary)', marginBottom: 10,
                }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{p.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 48px;
          }
        }
      `}</style>
    </section>
  );
}
