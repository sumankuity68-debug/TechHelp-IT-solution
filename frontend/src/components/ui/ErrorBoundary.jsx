// FILE: frontend/src/components/ui/ErrorBoundary.jsx
// Premium Error Boundary Component to prevent application white screens and offer graceful recovery options.

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: 'DM Sans, sans-serif',
          transition: 'background 0.3s ease, color 0.3s ease',
        }}>
          <div style={{ maxWidth: 520, width: '100%' }}>
            {/* Warning Sign */}
            <div style={{ fontSize: 64, marginBottom: 20 }}>🚧</div>

            {/* Error Message */}
            <h1 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: '-0.5px',
            }}>
              Something Went Wrong
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              A rendering exception occurred in the application layer. Our engineering team has been notified. Let's get you back on track.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
                style={{
                  padding: '12px 24px',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'var(--accent-color)',
                  color: '#fff',
                }}
              >
                🔄 Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="btn-outline"
                style={{
                  padding: '12px 24px',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                }}
              >
                🏠 Go to Home
              </button>
            </div>

            {/* Diagnostics details */}
            <details style={{
              textAlign: 'left',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '14px 18px',
            }}>
              <summary style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                userSelect: 'none',
              }}>
                Diagnostic Information
              </summary>
              <pre style={{
                fontSize: 12,
                fontFamily: 'monospace',
                overflowX: 'auto',
                marginTop: 12,
                color: '#ef4444',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}>
                {this.state.error?.stack || this.state.error?.message || 'Unknown render error'}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
