// FILE: backend/src/middleware/rateLimiter.js
// ─────────────────────────────────────────────────────────────────────────
// Centralized rate limiters for the API.
// Protects against brute-force attacks and abuse.
// ─────────────────────────────────────────────────────────────────────────

import rateLimit from 'express-rate-limit';

// ── General API limiter ──────────────────────────────────────────────────
// Applied globally: 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// ── Auth limiter ─────────────────────────────────────────────────────────
// Applied to: login, register, forgot-password, find-account
// 10 requests per 15 minutes per IP — prevents brute-force login
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
  },
  skipSuccessfulRequests: false, // Count successful requests too
});

// ── Contact form limiter ─────────────────────────────────────────────────
// Applied to: POST /api/contact
// 5 submissions per hour per IP — prevents spam
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact form submissions. Please wait an hour before trying again.',
  },
});

// ── Password reset limiter ───────────────────────────────────────────────
// Applied to: forgot-password, reset-password
// 5 requests per hour — prevents OTP flooding
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset attempts. Please wait an hour before trying again.',
  },
});
