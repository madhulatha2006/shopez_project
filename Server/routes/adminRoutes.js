import express from 'express';
import {
  getDashboardStats,
  getAdminConfig,
  updateAdminConfig,
} from '../controllers/adminController.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { getOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Publicly accessible configurations (e.g. for homepage categories & banner)
router.get('/config', getAdminConfig);

// All other admin routes require login & admin role validation
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getOrders);

router.post('/product', createProduct);
router.route('/product/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.put('/config', updateAdminConfig);

export default router;
