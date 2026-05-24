import express from 'express';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllServices);


router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

export default router;