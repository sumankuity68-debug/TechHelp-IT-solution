// FILE: backend/src/routes/visitor.routes.js

import express from 'express';
import { pingVisitor, getVisitorStats } from '../controllers/visitorController.js';
import { protect, admin } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limit the ping: max 10 pings per IP per hour (1 per session is the intent)
const pingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many pings' },
  skip: () => process.env.NODE_ENV === 'test',
});

// Public — ping to count a visit
router.post('/ping', pingLimiter, pingVisitor);

// Admin only — get last 14 days of stats
router.get('/stats', protect, admin, getVisitorStats);

export default router;
