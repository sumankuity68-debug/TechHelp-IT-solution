// FILE: frontend/src/utils/animations.js
// Centralized Framer Motion animation variants for consistent, professional animations

// ── Fade in from below (page load / section reveal) ─────────────────────────
export const fadeInUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Fade in only ──────────────────────────────────────────────────────────────
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ── Slide in from left ───────────────────────────────────────────────────────
export const slideInLeft = {
  hidden:  { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Slide in from right ──────────────────────────────────────────────────────
export const slideInRight = {
  hidden:  { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Stagger container — children animate one after another ──────────────────
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// ── Stagger container with a small delay ─────────────────────────────────────
export const staggerContainerSlow = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// ── Card reveal (for service/pillar cards) ───────────────────────────────────
export const cardReveal = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Viewport settings (trigger once when element enters view) ────────────────
export const viewportOnce = { once: true, margin: '-80px' };
