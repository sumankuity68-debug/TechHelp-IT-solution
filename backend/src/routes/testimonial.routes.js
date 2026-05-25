import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  likeTestimonial,
  dislikeTestimonial,
  replyTestimonial,
  voteTestimonial,
  deleteTestimonial,
  deleteReply,
} from '../controllers/testimonialController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', createTestimonial);
router.put('/:id/like', likeTestimonial);
router.put('/:id/dislike', dislikeTestimonial);
router.put('/:id/vote', voteTestimonial);
router.post('/:id/reply', replyTestimonial);
router.delete('/:id', protect, admin, deleteTestimonial);
router.delete('/:id/reply/:replyId', protect, admin, deleteReply);

export default router;
