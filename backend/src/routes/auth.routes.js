import express from 'express';
import { register, login, getMe, updateProfile, forgotPassword, resetPassword, resetPasswordOTP, findAccount, verifyEmail, resendVerification, changePassword, googleAuth, googleTokenAuth, googleSignupAuth } from '../controllers/authcontroller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);            // id-token flow (login only)
router.post('/google-token', googleTokenAuth); // access-token login (existing users only)
router.post('/google-signup', googleSignupAuth); // access-token signup (allows new users)
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