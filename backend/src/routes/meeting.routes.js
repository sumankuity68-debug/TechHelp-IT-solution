import express from 'express';
import { 
  createMeeting, 
  getMyMeetings, 
  getAllMeetings, 
  updateMeeting 
} from '../controllers/meetingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (User must be logged in)
router.use(protect);

router.post('/', createMeeting);
router.get('/my-meetings', getMyMeetings);

// Admin only routes
router.get('/', authorize('admin'), getAllMeetings);
router.put('/:id', authorize('admin'), updateMeeting);

export default router;
