// FILE: frontend/src/components/sections/Testimonials.jsx
// Client testimonials with 3D Card Tilt effects, dynamic loading, and interactive likes, dislikes, and replies.
// Used in: pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function Stars({ count, compact = false }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: compact ? 12 : 20 }}>
      {Array.from({ length: Number(count) || 5 }).map((_, i) => (
        <span key={i} style={{ color: 'var(--gold)', fontSize: compact ? 12 : 14 }}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ t, onActionComplete, compact = false }) {
  const { user, token } = useAuth();
  const { showSuccess, showError } = useToast();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyName, setReplyName] = useState(user?.name || '');
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [repliesFocused, setRepliesFocused] = useState(false);

  // Sync logged in user name to reply input if they log in later
  useEffect(() => {
    if (user) {
      setReplyName(user.name);
    }
  }, [user]);

  const userVote = localStorage.getItem('vote_' + t._id) || 'none';
  const hasLiked = userVote === 'like';
  const hasDisliked = userVote === 'dislike';

  const handleMouseMove = (e) => {
    if (repliesFocused) return;
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

  const handleVote = async (targetVote) => {
    let nextVote = 'none';

    if (targetVote === 'like') {
      nextVote = hasLiked ? 'none' : 'like';
    } else if (targetVote === 'dislike') {
      nextVote = hasDisliked ? 'none' : 'dislike';
    }

    try {
      const res = await fetch(`/api/testimonials/${t._id}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentVote: nextVote,
          previousVote: userVote,
        }),
      });

      if (res.ok) {
        localStorage.setItem('vote_' + t._id, nextVote);
        onActionComplete();
      }
    } catch (err) {
      console.error('Error updating vote:', err);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const finalName = replyName.trim() || user?.name || 'Anonymous Guest';
    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/testimonials/${t._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: finalName,
          text: replyText,
        }),
      });

      if (res.ok) {
        setReplyText('');
        onActionComplete();
      }
    } catch (err) {
      console.error('Error replying to rating:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    padding: compact ? '20px 20px' : '36px 32px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    transform: (hovered && !repliesFocused)
      ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` 
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: hovered 
      ? 'transform 0.1s ease-out, background 0.3s, box-shadow 0.3s' 
      : 'transform 0.5s ease-out, background 0.3s, box-shadow 0.3s',
    boxShadow: hovered 
      ? '0 20px 45px rgba(0, 0, 0, 0.12), inset 0 1px 0 var(--border-color)' 
      : '0 4px 15px rgba(0, 0, 0, 0.03)',
  };

  const initial = t.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Edit/Delete Actions Panel at Top Right */}
      {(user?.role === 'admin' || (user && t.user && user.id === t.user._id)) && (
        <div style={{
          position: 'absolute',
          top: compact ? 12 : 18,
          right: compact ? 12 : 18,
          display: 'flex',
          gap: 6,
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent card tilt focus/clicks
        >
          {/* Edit button: only for owner */}
          {user && t.user && user.id === t.user._id && (
            <Link
              to="/rate"
              state={{ editTestimonial: t }}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
            >
              ✏️ Edit
            </Link>
          )}

          {/* Delete button: for owner OR admin */}
          {(user?.role === 'admin' || (user && t.user && user.id === t.user._id)) && (
            <button 
              onClick={async (e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this rating?')) {
                  try {
                    const res = await fetch(`/api/testimonials/${t._id}`, {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    if (res.ok) {
                      showSuccess('Rating deleted successfully');
                      onActionComplete();
                    } else {
                      const data = await res.json();
                      showError(data.message || 'Failed to delete rating');
                    }
                  } catch (err) {
                    console.error('Delete error:', err);
                    showError('Failed to delete rating');
                  }
                }
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}

      {/* Reflection effect */}
      {hovered && !repliesFocused && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${tilt.y * 10 + 50}% ${-tilt.x * 10 + 50}%, rgba(0, 123, 255, 0.03) 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      {/* Content inside card */}
      <div style={{
        transform: (hovered && !repliesFocused) ? 'translateZ(20px)' : 'translateZ(0px)',
        transition: 'transform 0.2s ease-out',
        zIndex: 2,
        position: 'relative',
      }}>
        <Stars count={t.rating} compact={compact} />

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: compact ? 14 : 15,
          lineHeight: compact ? 1.6 : 1.8,
          marginBottom: compact ? 16 : 24,
          fontStyle: 'italic',
        }}>
          "{t.text}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Avatar */}
            <div style={{
              width: compact ? 36 : 42,
              height: compact ? 36 : 42,
              borderRadius: '50%',
              background: 'var(--accent-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces, serif',
              fontSize: compact ? 14 : 16, fontWeight: 700, color: '#fff',
              flexShrink: 0,
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
            }}>
              {t.user?.avatar ? (
                <img src={t.user.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initial
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: compact ? 13 : 14, color: 'var(--text-primary)' }}>
                {t.name}
              </div>
              <div style={{ fontSize: compact ? 11 : 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {t.role} {t.project ? `• ${t.project}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons row (Likes, Dislikes, Reply Toggle) */}
        <div 
          style={{ 
            display: 'flex', 
            gap: compact ? 8 : 12, 
            alignItems: 'center', 
            marginTop: compact ? 16 : 20, 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: compact ? 12 : 16 
          }}
          onMouseEnter={() => setRepliesFocused(true)}
          onMouseLeave={() => setRepliesFocused(false)}
        >
          {/* Like */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleVote('like'); }}
            style={{
              background: hasLiked ? 'rgba(39, 201, 63, 0.12)' : 'var(--input-bg)',
              border: `1px solid ${hasLiked ? '#27c93f' : 'var(--border-color)'}`,
              color: hasLiked ? '#27c93f' : 'var(--text-secondary)',
              borderRadius: 6,
              padding: compact ? '5px 10px' : '6px 12px',
              fontSize: compact ? 11 : 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            👍 {t.likes || 0}
          </button>

          {/* Dislike */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleVote('dislike'); }}
            style={{
              background: hasDisliked ? 'rgba(239, 68, 68, 0.12)' : 'var(--input-bg)',
              border: `1px solid ${hasDisliked ? '#ef4444' : 'var(--border-color)'}`,
              color: hasDisliked ? '#ef4444' : 'var(--text-secondary)',
              borderRadius: 6,
              padding: compact ? '5px 10px' : '6px 12px',
              fontSize: compact ? 11 : 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            👎 {t.dislikes || 0}
          </button>

          {/* Reply Toggle */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowReplies(prev => !prev);
            }}
            style={{
              background: showReplies ? 'rgba(59, 130, 246, 0.12)' : 'var(--input-bg)',
              border: `1px solid ${showReplies ? '#3b82f6' : 'var(--border-color)'}`,
              color: showReplies ? '#3b82f6' : 'var(--text-secondary)',
              borderRadius: 6,
              padding: compact ? '5px 10px' : '6px 12px',
              fontSize: compact ? 11 : 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
              marginLeft: 'auto',
            }}
          >
            💬 {t.replies?.length || 0} {showReplies ? 'Hide' : 'Replies'}
          </button>
        </div>

        {/* Expandable replies list */}
        {showReplies && (
          <div 
            style={{ 
              marginTop: 16, 
              background: 'var(--bg-primary)', 
              borderRadius: 8, 
              padding: 16, 
              border: '1px solid var(--border-color)',
              maxHeight: 300,
              overflowY: 'auto',
              textAlign: 'left',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent card clicks
            onMouseEnter={() => setRepliesFocused(true)}
            onMouseLeave={() => setRepliesFocused(false)}
          >
            {/* List replies */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {t.replies && t.replies.length > 0 ? (
                t.replies.map((reply, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: '10px 12px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: 6, 
                      border: '1px solid var(--border-color)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, paddingRight: user?.role === 'admin' ? 30 : 0 }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>{reply.name}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{reply.text}</p>
                    
                    {user?.role === 'admin' && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this reply?')) {
                            try {
                              const res = await fetch(`/api/testimonials/${t._id}/reply/${reply._id}`, {
                                method: 'DELETE',
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              });
                              if (res.ok) {
                                showSuccess('Reply deleted successfully');
                                onActionComplete();
                              } else {
                                showError('Failed to delete reply');
                              }
                            } catch (err) {
                              console.error('Delete reply error:', err);
                              showError('Failed to delete reply');
                            }
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: 11,
                          cursor: 'pointer',
                          opacity: 0.6,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                        title="Delete Reply"
                      >
                        🗑️
                      </button>
                    )}
                    </div>
                ))
              ) : (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', margin: '10px 0' }}>
                  No replies yet.
                </p>
              )}
            </div>

            {/* Add reply form */}
            <form onSubmit={handleAddReply} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!user && (
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={replyName} 
                  onChange={e => setReplyName(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  placeholder="Type a reply..." 
                  value={replyText} 
                  onChange={e => setReplyText(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
                <button 
                  type="submit" 
                  disabled={submittingReply}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    background: 'var(--accent-color)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: submittingReply ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {submittingReply ? '...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}export default function Testimonials({ showStickyHeader = false, compactCards = false }) {
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.success) {
        setTestimonialsList(data.data);
      } else {
        setError(data.message || 'Failed to load testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Could not connect to database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section 
      id="testimonials" 
      className="section" 
      style={{ 
        background: 'var(--bg-primary)', 
        transition: 'background 0.3s',
        paddingTop: showStickyHeader ? 0 : undefined,
      }}
    >
      {showStickyHeader && (
        <div style={{
          position: 'sticky',
          top: 68,
          zIndex: 95,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 5%',
          marginBottom: 40,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          transition: 'background 0.3s, border-color 0.3s',
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Back to Home Link */}
            <div>
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

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: '1 1 600px' }}>
                <h3 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 'clamp(18px, 2.5vw, 22px)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}>
                  Have we completed work for you?
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.4, margin: 0 }}>
                  We'd love to hear your feedback. Submit a rating and tell us about your experience collaborating with TechHelp IT Solutions.
                </p>
              </div>
              <div>
                <Link to="/rate" className="btn-primary" style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                  padding: '11px 24px',
                  fontSize: 14,
                  borderRadius: 4,
                  boxShadow: '0 4px 14px rgba(0, 123, 255, 0.25)',
                  whiteSpace: 'nowrap',
                }}>
                  Rate Our Work →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>

        {/* Header - Only render when showStickyHeader is FALSE */}
        {!showStickyHeader && (
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
        )}

        {/* Loading & Error States */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: compactCards ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: compactCards ? 20 : 24,
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: compactCards ? '20px' : '36px 32px', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: 3, marginBottom: compactCards ? 12 : 20 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className="skeleton" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                    ))}
                  </div>
                  <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '70%', height: '14px' }} />
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: compactCards ? '36px' : '42px', height: compactCards ? '36px' : '42px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '100px', height: '12px', marginBottom: '6px' }} />
                    <div className="skeleton" style={{ width: '150px', height: '10px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '28px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 8,
            color: '#ef4444',
            maxWidth: 500,
            margin: '0 auto 40px',
            fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: compactCards ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: compactCards ? 20 : 24,
          }}>
            {testimonialsList.map((t) => (
              <TestimonialCard 
                key={t._id} 
                t={t} 
                onActionComplete={fetchTestimonials} 
                compact={compactCards}
              />
            ))}
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
