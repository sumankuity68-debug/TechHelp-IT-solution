// FILE: backend/src/routes/auth.routes.js
// ────────────────────────────────────────────────────────────────────────
// Authentication routes — register, login, getMe.
// ────────────────────────────────────────────────────────────────────────
import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authcontroller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── Public routes ──
router.post('/register', register);
router.post('/login', login);

// ── Protected routes ──
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;