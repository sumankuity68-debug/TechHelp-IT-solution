// FILE: backend/src/routes/contact.routes.js
// ────────────────────────────────────────────────────────────────────────
// Contact routes — submit form (public), get/update/delete (admin).
// ────────────────────────────────────────────────────────────────────────
import express from 'express';
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// ── Public route ──
router.post('/', submitContact);

// ── Admin routes (protected) ──
router.get('/', protect, admin, getAllContacts);
router.put('/:id', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContact);

export default router;