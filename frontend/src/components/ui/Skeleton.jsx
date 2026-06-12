import React from 'react';

// Common shimmer styles are handled by the global `.skeleton` CSS class from index.css

/**
 * Skeleton fallback for standard content pages (Home, About, Services, Testimonials, Contact)
 */
export function ContentPageSkeleton() {
  return (
    <div style={{ padding: '40px 5% 80px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Hero Section Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 }}>
        <div className="skeleton" style={{ width: '40%', height: 48 }} />
        <div className="skeleton" style={{ width: '80%', height: 20 }} />
        <div className="skeleton" style={{ width: '60%', height: 20 }} />
      </div>

      {/* Grid Content Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: 24, background: 'var(--bg-secondary)' }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 8, marginBottom: 20 }} />
            <div className="skeleton" style={{ width: '60%', height: 24, marginBottom: 12 }} />
            <div className="skeleton" style={{ width: '100%', height: 16, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '85%', height: 16, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '50%', height: 16 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton fallback for simple standalone form pages (RatingPage)
 */
export function FormPageSkeleton() {
  return (
    <div style={{ padding: '40px 5% 80px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: '48px 44px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div className="skeleton" style={{ width: '50%', height: 36 }} />
          <div className="skeleton" style={{ width: '80%', height: 16 }} />
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="skeleton" style={{ width: '30%', height: 14 }} />
            <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 6 }} />
          </div>
        ))}
        <div className="skeleton" style={{ width: '100%', height: 48, borderRadius: 6, marginTop: 12 }} />
      </div>
    </div>
  );
}

/**
 * Skeleton fallback for standalone authentication pages (Login, Signup, ForgotPassword, ResetPassword, VerifyEmail)
 */
export function AuthPageSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 480, background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: 24, padding: '48px 44px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="skeleton" style={{ width: '40%', height: 32, opacity: 0.3 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ width: '30%', height: 14, opacity: 0.3 }} />
          <div className="skeleton" style={{ width: '100%', height: 48, borderRadius: 12, opacity: 0.3 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ width: '35%', height: 14, opacity: 0.3 }} />
          <div className="skeleton" style={{ width: '100%', height: 48, borderRadius: 12, opacity: 0.3 }} />
        </div>
        <div className="skeleton" style={{ width: '100%', height: 48, borderRadius: 12, marginTop: 12, opacity: 0.3 }} />
      </div>
    </div>
  );
}

/**
 * Skeleton fallback for main dashboards (UserDashboard, AdminDashboard)
 */
export function DashboardPageSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dash-bg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Bar Skeleton */}
      <div style={{ border: 'var(--dash-card-border)', borderRadius: 16, padding: '1.5rem 2rem', background: 'var(--dash-card-bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <div className="skeleton" style={{ width: '35%', height: 28 }} />
            <div className="skeleton" style={{ width: '25%', height: 16 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="skeleton" style={{ width: 80, height: 38, borderRadius: 12 }} />
            <div className="skeleton" style={{ width: 80, height: 38, borderRadius: 12 }} />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ border: 'var(--dash-card-border)', borderRadius: 16, padding: '1.5rem', background: 'var(--dash-card-bg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
            <div className="skeleton" style={{ width: '50%', height: 14 }} />
            <div className="skeleton" style={{ width: '70%', height: 28 }} />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ border: 'var(--dash-card-border)', borderRadius: 16, padding: '1.5rem', background: 'var(--dash-card-bg)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ width: '40%', height: 20 }} />
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: 14, background: 'var(--dash-list-item-bg)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ width: '60%', height: 14 }} />
              <div className="skeleton" style={{ width: '40%', height: 12 }} />
            </div>
          ))}
        </div>
        <div style={{ border: 'var(--dash-card-border)', borderRadius: 16, padding: '1.5rem', background: 'var(--dash-card-bg)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ width: '45%', height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--dash-list-item-bg)', borderRadius: 12 }}>
            <div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <div className="skeleton" style={{ width: '50%', height: 16 }} />
              <div className="skeleton" style={{ width: '40%', height: 12 }} />
            </div>
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div className="skeleton" style={{ width: '30%', height: 14 }} />
              <div className="skeleton" style={{ width: '20%', height: 14 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton fallback for Profile page settings
 */
export function ProfilePageSkeleton() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 5%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: '40%', height: 36 }} />
        <div className="skeleton" style={{ width: '60%', height: 16 }} />
      </div>

      {/* Profile Photo Uploader Skeleton */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '28px 32px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="skeleton" style={{ width: 88, height: 88, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ width: 120, height: 34, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 160, height: 14 }} />
        </div>
      </div>

      {/* Form Fields Skeleton */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: '28px 32px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="skeleton" style={{ width: '30%', height: 20, marginBottom: 8 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="skeleton" style={{ width: '40%', height: 14 }} />
            <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 6 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="skeleton" style={{ width: '40%', height: 14 }} />
            <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 6 }} />
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="skeleton" style={{ width: '20%', height: 14 }} />
            <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
