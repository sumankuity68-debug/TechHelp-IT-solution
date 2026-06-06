// FILE: frontend/src/components/ui/PageLoader.jsx
// Premium full-screen glassmorphic page loader for React Suspense transitions

export default function PageLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'var(--bg-primary)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      transition: 'background 0.3s ease',
    }}>
      {/* Animated Spinner with Gradient Ring */}
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          boxSizing: 'border-box',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '4px solid var(--border-color)',
        }} />
        <div style={{
          boxSizing: 'border-box',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: 'var(--accent-color)',
          borderRightColor: 'var(--accent-color)',
          animation: 'spin 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite',
        }} />
      </div>

      {/* Loading Label */}
      <div style={{
        fontFamily: 'Fraunces, serif',
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--text-primary)',
        letterSpacing: '0.05em',
        animation: 'pulse 1.8s ease-in-out infinite',
      }}>
        Loading Solutions...
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.97); }
          50%      { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
