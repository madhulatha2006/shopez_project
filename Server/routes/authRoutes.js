import express from 'express';
import {
  registerUser,
  authUser,
  logoutUser,
  updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, updateUserProfile);

export default router;
