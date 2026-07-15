import express from 'express';
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require user authentication
router.use(protect);

router.get('/:userId', getCart);
router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/remove/:id', removeFromCart);

export default router;
