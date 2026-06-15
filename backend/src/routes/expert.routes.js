import express from 'express';
import {
  getAllExperts,
  createExpert,
  updateExpert,
  deleteExpert,
  getMyExpertInquiries,
  updateExpertInquiryStatus,
  approveExpert,
} from '../controllers/expertController.js';
import { protect, admin, expert } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllExperts);
router.post('/', protect, admin, createExpert);
router.put('/:id', protect, admin, updateExpert);
router.put('/:id/approve', protect, admin, approveExpert);
router.delete('/:id', protect, admin, deleteExpert);

router.get('/my-inquiries', protect, expert, getMyExpertInquiries);
router.put('/inquiries/:id/status', protect, expert, updateExpertInquiryStatus);

export default router;
