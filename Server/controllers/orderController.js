import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { userId, products, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      res.status(400);
      throw new Error('No products in this order');
    }

    // Double-check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to create this order');
    }

    // Verify stock and update product quantities
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }
    }

    // Deduct stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create the order
    const order = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderStatus: 'pending',
    });

    // Clear user's cart
    await Cart.deleteMany({ userId });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin gets all, customer gets only their own)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({}).populate('userId', 'name email').populate('products.productId', 'title price image');
    } else {
      orders = await Order.find({ userId: req.user.id }).populate('products.productId', 'title price image');
    }
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('products.productId', 'title price image');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Authorize owner or admin
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
