
import express from 'express';
import {
  submitContact,
  getAllContacts,
  getMyContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import validators from '../middleware/validate.js';

const router = express.Router();

// Public: contact form submission (rate limited + validated)
router.post('/', contactLimiter,
  validate(
    validators.required(['name', 'email', 'service', 'message']),
    validators.isEmail('email'),
    validators.minLength('name', 2),
    validators.maxLength('message', 2000),
  ),
  submitContact
);

// Authenticated user: see their own submissions
router.get('/mine', protect, getMyContacts);

// Admin only routes
router.get('/', protect, admin, getAllContacts);
router.put('/:id', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContact);

export default router;