import React from 'react';

/**
 * Custom Logo component for TechHelp IT Solutions.
 * Renders the custom shield icon and adaptive text branding.
 *
 * @param {boolean} iconOnly - If true, only the SVG shield icon will be rendered.
 * @param {number} size - The width/height of the shield icon in pixels.
 * @param {string} className - Optional className for the wrapper container.
 * @param {object} style - Optional inline styles for the wrapper container.
 */
export default function Logo({
  iconOnly = false,
  size = 38,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        userSelect: 'none',
        ...style
      }}
    >
      {/* SVG Shield Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          flexShrink: 0,
          transition: 'transform 0.3s ease'
        }}
        className="logo-shield-svg"
      >
        <defs>
          {/* Deep blue gradient for T/shield-left */}
          <linearGradient id="logo_blue_grad" x1="20" y1="20" x2="120" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--logo-blue-start)" />
            <stop offset="50%" stopColor="var(--logo-blue-mid)" />
            <stop offset="100%" stopColor="var(--logo-blue-end)" />
          </linearGradient>
          
          {/* Teal/cyan gradient for H/shield-right */}
          <linearGradient id="logo_teal_grad" x1="180" y1="40" x2="60" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--logo-teal-start)" />
            <stop offset="50%" stopColor="var(--logo-teal-mid)" />
            <stop offset="100%" stopColor="var(--logo-teal-end)" />
          </linearGradient>

          {/* Drop shadow for professional volume */}
          <filter id="logo_shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter="url(#logo_shadow)">
          {/* Left Blue Element (The 'T' / Shield Left) */}
          <path
            d="M 103,42 L 58,56 C 50,86 54,124 103,158 C 95,145 89,125 89,106 C 89,86 97,71 103,64 L 103,42 Z"
            fill="url(#logo_blue_grad)"
          />
          
          {/* Top bar left extension of the T */}
          <path
            d="M 103,42 L 78,49 C 78,49 82,59 86,60 L 103,55 Z"
            fill="url(#logo_blue_grad)"
          />

          {/* Right Teal Element (The 'H' / Shield Right & Arrow) */}
          <path
            d="M 103,158 C 152,124 156,86 148,56 L 140,46 L 160,42 L 165,63 L 155,53 L 142,69 C 146,89 142,110 128,124 C 116,136 103,147 103,158 Z"
            fill="url(#logo_teal_grad)"
          />

          {/* Weaving crossbar of H */}
          <path
            d="M 89,106 C 101,106 113,100 123,90 C 127,86 130,82 133,78 C 125,78 117,84 109,90 C 99,100 89,106 89,106 Z"
            fill="url(#logo_teal_grad)"
          />

          {/* Network Circuit Line & Node 1 (Blue Part) */}
          <path
            d="M 93,57 L 108,77"
            stroke="var(--logo-node-blue)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="108" cy="77" r="3.5" fill="var(--logo-node-blue)" />

          {/* Network Circuit Line & Node 2 (Teal Part) */}
          <path
            d="M 119,110 L 109,90"
            stroke="var(--logo-node-teal)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="109" cy="90" r="3.5" fill="var(--logo-node-teal)" />
        </g>
      </svg>

      {/* Brand Text Block */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease'
            }}
          >
            TechHelp
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: 'var(--logo-subtitle-color, #0abdb7)',
              textTransform: 'uppercase',
              marginTop: '1px',
              transition: 'color 0.3s ease'
            }}
          >
            IT Solution
          </span>
        </div>
      )}
    </div>
  );
}
