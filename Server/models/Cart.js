import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

// Compounding unique index so a user cannot have duplicate cart rows for the same product
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
