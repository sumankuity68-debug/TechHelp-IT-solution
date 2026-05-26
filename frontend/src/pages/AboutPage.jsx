
import { Link } from 'react-router-dom';
import About from '../components/sections/About';

export default function AboutPage() {
  return (
    <div>
      <div style={{ padding: '32px 5% 0', maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 500,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-color)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ← Back to Home
        </Link>
      </div>
      <About />
    </div>
  );
}
