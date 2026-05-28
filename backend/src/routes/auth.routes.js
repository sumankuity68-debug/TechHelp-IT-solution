import express from 'express';
import { register, login, getMe, updateProfile, forgotPassword, resetPassword, resetPasswordOTP, findAccount, verifyEmail, resendVerification, changePassword } from '../controllers/authcontroller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/reset-password-otp', resetPasswordOTP);
router.post('/find-account', findAccount);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;