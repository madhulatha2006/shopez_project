import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get cart items for a user
// @route   GET /api/cart/:userId
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Ensure user is only accessing their own cart (unless admin)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to access this cart');
    }

    const cartItems = await Cart.find({ userId }).populate('productId');
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Ensure authorized user is modifying their own cart
    if (req.user.id !== userId && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to modify this cart');
    }

    // Verify product exists and check stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const requestedQuantity = Number(quantity) || 1;

    // Check if cart item already exists for this user and product
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += requestedQuantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity: requestedQuantity,
      });
    }

    const populatedItem = await Cart.findById(cartItem._id).populate('productId');
    res.status(201).json(populatedItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCart = async (req, res, next) => {
  try {
    const { cartItemId, userId, productId, quantity } = req.body;
    const updateQty = Number(quantity);

    if (updateQty < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    let cartItem;

    if (cartItemId) {
      cartItem = await Cart.findById(cartItemId);
    } else if (userId && productId) {
      cartItem = await Cart.findOne({ userId, productId });
    }

    if (!cartItem) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    // Ensure authorization
    if (req.user.id !== cartItem.userId.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to modify this cart');
    }

    cartItem.quantity = updateQty;
    await cartItem.save();

    const populatedItem = await Cart.findById(cartItem._id).populate('productId');
    res.json(populatedItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    // Ensure authorization
    if (req.user.id !== cartItem.userId.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to modify this cart');
    }

    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart', cartItemId: req.params.id });
  } catch (error) {
    next(error);
  }
};
