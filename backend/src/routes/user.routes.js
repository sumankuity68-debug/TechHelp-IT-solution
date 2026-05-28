import express from 'express';
import { getAllUsers, deleteUser, updateUserRole, updateUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);
router.put('/:id', protect, admin, updateUser);

export default router;