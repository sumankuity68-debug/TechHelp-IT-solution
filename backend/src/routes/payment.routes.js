// FILE: backend/src/routes/payment.routes.js
// Stripe payment routes

import express from 'express';
import {
  createCheckoutSession,
  getSessionDetails,
  stripeWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Stripe webhook — MUST come before express.json() is applied (raw body needed)
// This route is registered BEFORE json middleware in index.js
router.post('/webhook', stripeWebhook);

// Create a checkout session (optionally auth — logged-in users get email prefilled)
router.post('/create-checkout-session', protect, createCheckoutSession);

// Public: fetch session details after redirect (success page)
router.get('/session/:sessionId', getSessionDetails);

export default router;
