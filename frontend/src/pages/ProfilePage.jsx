// FILE: frontend/src/pages/ProfilePage.jsx
// Full profile page — update avatar, name, phone, address, bio

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
    bio:     user?.bio     || '',
    avatar:  user?.avatar  || '',
  });
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');
  const [preview,  setPreview]  = useState(user?.avatar || '');

  // Change Password states
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Compress & convert uploaded image to base64 via canvas
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB'); return; }
    setError('');

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      // Max dimension 400px to keep base64 small
      const MAX = 400;
      let { width, height } = img;
      if (width > height) { if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; } }
      else                 { if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; } }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);

      // Convert to JPEG at 75% quality — typically <50kb
      const compressed = canvas.toDataURL('image/jpeg', 0.75);
      URL.revokeObjectURL(objectUrl);
      setPreview(compressed);
      setForm(prev => ({ ...prev, avatar: compressed }));
    };
    img.src = objectUrl;
  };


  const handleSecurityChange = e => setSecurityForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendOTP = async () => {
    setSecurityError('');
    setSecuritySuccess('');
    setSecurityLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP code');
      
      const maskEmail = (email) => {
        if (!email) return '';
        const [name, domain] = email.split('@');
        if (!domain) return email;
        if (name.length <= 3) {
          return `${name.slice(0, 1)}***@${domain}`;
        }
        return `${name.slice(0, 2)}***${name.slice(-2)}@${domain}`;
      };

      const masked = maskEmail(user.email);
      setOtpMode(true);
      setOtpSent(true);
      setSecuritySuccess(`Verification code sent to your registered email (${masked})! Please check your inbox.`);
    } catch (err) {
      setSecurityError(err.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (securityForm.newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters');
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError('New passwords do not match');
      return;
    }

    setSecurityLoading(true);

    try {
      let res;
      let data;

      if (otpMode) {
        res = await fetch('/api/auth/reset-password-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            otp: securityForm.otp,
            password: securityForm.newPassword,
          }),
        });
      } else {
        const savedToken = localStorage.getItem('token');
        res = await fetch('/api/auth/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`,
          },
          body: JSON.stringify({
            currentPassword: securityForm.currentPassword,
            newPassword: securityForm.newPassword,
          }),
        });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');

      setSecuritySuccess('Password updated successfully! ✓');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        otp: '',
      });
      setOtpMode(false);
      setOtpSent(false);
    } catch (err) {
      setSecurityError(err.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully! ✓');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 15px',
    background: 'var(--input-bg)',
    border: '1px solid var(--border)',
    borderRadius: 6, color: 'var(--text-primary)',
    fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 5%' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Profile Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 36 }}>
          Update your profile picture, contact info, and personal details.
        </p>

        {/* Form 1: Personal details & Avatar */}
        <form onSubmit={handleSubmit}>
          {/* ── Avatar Upload ─────────────────────────── */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '28px 32px', marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
              Profile Picture
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* Avatar preview */}
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'var(--accent-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
                border: '3px solid var(--border)',
              }}>
                {preview
                  ? <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                }
              </div>
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} style={{
                  padding: '9px 20px', background: 'var(--accent-color)',
                  color: '#fff', border: 'none', borderRadius: 6,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 8, display: 'block',
                }}>
                  Upload Photo
                </button>
                {preview && (
                  <button type="button" onClick={() => { setPreview(''); setForm(p => ({ ...p, avatar: '' })); }} style={{
                    padding: '7px 16px', background: 'transparent',
                    color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  }}>Remove Photo</button>
                )}
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>JPG, PNG or GIF · Max 2 MB</p>
              </div>
              <input
                ref={fileRef} type="file" accept="image/*"
                onChange={handleImageUpload} style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* ── Personal Info ─────────────────────────── */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '28px 32px', marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
              Personal Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Full Name
                </label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email Address
                </label>
                <input value={user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Email cannot be changed</p>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Phone Number
              </label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" type="tel"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Address
              </label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Your city, state, country"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Bio
              </label>
              <textarea name="bio" value={form.bio} onChange={handleChange}
                placeholder="Tell us a bit about yourself..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '11px 16px', color: '#ef4444', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '11px 16px', color: '#10b981', fontSize: 13, marginBottom: 20 }}>
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 16, marginTop: 24, marginBottom: 32 }}>
            <button type="submit" disabled={saving} style={{
              flex: 1, padding: '14px',
              background: saving ? 'rgba(59,130,246,0.6)' : 'var(--accent-color)',
              color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button type="button" onClick={() => navigate('/')} style={{
              flex: 1, padding: '14px',
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Go to Home →
            </button>
          </div>
        </form>

        {/* Form 2: Change Password */}
        <form onSubmit={handleSecuritySubmit}>
          {/* ── Security Settings (Change Password) ─────────────────── */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '28px 32px', marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
              Security Settings (Change Password)
            </h2>

            {securityError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '11px 16px', color: '#ef4444', fontSize: 13, marginBottom: 20 }}>
                {securityError}
              </div>
            )}
            {securitySuccess && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '11px 16px', color: '#10b981', fontSize: 13, marginBottom: 20 }}>
                {securitySuccess}
              </div>
            )}

            {!otpMode ? (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      Current Password
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={securityLoading}
                      style={{
                        background: 'none', border: 'none', color: 'var(--accent-color)',
                        fontSize: 12, cursor: 'pointer', outline: 'none', fontWeight: 600, padding: 0
                      }}
                      onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      {securityLoading ? 'Sending...' : 'Forgot Password?'}
                    </button>
                  </div>
                  <input
                    name="currentPassword" type="password" required={!otpMode}
                    value={securityForm.currentPassword} onChange={handleSecurityChange}
                    placeholder="Enter current password"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => { setOtpMode(false); setOtpSent(false); setSecurityError(''); setSecuritySuccess(''); }}
                      style={{
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        fontSize: 12, cursor: 'pointer', outline: 'none', fontWeight: 600, padding: 0
                      }}
                      onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      ← Back to normal change
                    </button>
                  </div>
                  <input
                    name="otp" type="text" required={otpMode} maxLength={6}
                    value={securityForm.otp} onChange={handleSecurityChange}
                    placeholder="Enter 6-digit code sent to your email"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  New Password
                </label>
                <input
                  name="newPassword" type="password" required
                  value={securityForm.newPassword} onChange={handleSecurityChange}
                  placeholder="At least 6 characters"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Password must be at least 6 characters
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Confirm New Password
                </label>
                <input
                  name="confirmPassword" type="password" required
                  value={securityForm.confirmPassword} onChange={handleSecurityChange}
                  placeholder="Re-type new password"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={securityLoading}
              style={{
                width: '100%', padding: '12px',
                background: securityLoading ? 'rgba(59,130,246,0.6)' : 'var(--text-primary)',
                color: 'var(--bg-primary)', border: 'none', borderRadius: 6,
                fontSize: 14, fontWeight: 600, cursor: securityLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {securityLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
