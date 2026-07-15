import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports'],
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
