// FILE: backend/src/routes/services.routes.js
// ────────────────────────────────────────────────────────────────────────
// Services routes — get all (public), create/update/delete (admin).
// ────────────────────────────────────────────────────────────────────────
import express from 'express';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// ── Public route ──
router.get('/', getAllServices);

// ── Admin routes (protected) ──
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

export default router;