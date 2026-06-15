import express from 'express';
import { register, login, getMe, updateProfile, forgotPassword, resetPassword, resetPasswordOTP, findAccount, verifyEmail, resendVerification, changePassword, googleAuth, googleTokenAuth, googleSignupAuth, verifyExpertLogin } from '../controllers/authcontroller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import validators from '../middleware/validate.js';

const router = express.Router();

// ── Public routes (rate limited) ─────────────────────────────────────────
router.post('/register', authLimiter,
  validate(
    validators.required(['name', 'email', 'phone', 'password']),
    validators.isEmail('email'),
    validators.minLength('password', 6),
    validators.maxLength('password', 128),
    validators.isPhone('phone'),
  ),
  register
);

router.post('/login', authLimiter,
  validate(
    validators.required(['email', 'password']),
    validators.isEmail('email'),
    validators.minLength('password', 1),
  ),
  login
);

router.post('/verify-expert-login', authLimiter,
  validate(
    validators.required(['email', 'otp']),
    validators.isEmail('email'),
  ),
  verifyExpertLogin
);

router.post('/google', authLimiter, googleAuth);
router.post('/google-token', authLimiter, googleTokenAuth);
router.post('/google-signup', authLimiter, googleSignupAuth);

router.post('/forgot-password', passwordResetLimiter,
  validate(
    validators.required(['email']),
    validators.isEmail('email'),
  ),
  forgotPassword
);

router.put('/reset-password/:token', passwordResetLimiter,
  validate(
    validators.required(['password']),
    validators.minLength('password', 6),
  ),
  resetPassword
);

router.post('/reset-password-otp', passwordResetLimiter,
  validate(
    validators.required(['email', 'otp', 'password']),
    validators.isEmail('email'),
    validators.minLength('password', 6),
  ),
  resetPasswordOTP
);

router.post('/find-account', authLimiter,
  validate(
    validators.required(['email']),
    validators.isEmail('email'),
  ),
  findAccount
);

router.get('/verify-email/:token', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', authLimiter,
  validate(
    validators.required(['email']),
    validators.isEmail('email'),
  ),
  resendVerification
);

// ── Protected routes ─────────────────────────────────────────────────────
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;