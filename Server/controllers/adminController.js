import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Admin from '../models/Admin.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrdersCount = await Order.countDocuments();
    const totalProductsCount = await Product.countDocuments();
    const totalCustomersCount = await User.countDocuments({ role: 'customer' });

    // Calculate total sales (sum of totalAmount for non-cancelled orders)
    const salesAggregate = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = salesAggregate.length > 0 ? salesAggregate[0].totalSales : 0;

    // Get order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Recent orders (last 5)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Simple default config if not found
    let adminConfig = await Admin.findOne();
    if (!adminConfig) {
      adminConfig = await Admin.create({
        bannerImage: [
          'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070'
        ],
        categories: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports']
      });
    }

    res.json({
      stats: {
        totalSales,
        totalOrders: totalOrdersCount,
        totalProducts: totalProductsCount,
        totalCustomers: totalCustomersCount,
      },
      statusBreakdown,
      recentOrders,
      config: adminConfig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Configurations (Banners, Categories)
// @route   GET /api/admin/config
// @access  Public
export const getAdminConfig = async (req, res, next) => {
  try {
    let adminConfig = await Admin.findOne();
    if (!adminConfig) {
      adminConfig = await Admin.create({
        bannerImage: [
          'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070'
        ],
        categories: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports']
      });
    }
    res.json(adminConfig);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Admin Configurations (Add categories, change banner image)
// @route   PUT /api/admin/config
// @access  Private/Admin
export const updateAdminConfig = async (req, res, next) => {
  try {
    const { bannerImage, categories } = req.body;
    let adminConfig = await Admin.findOne();

    if (!adminConfig) {
      adminConfig = new Admin({});
    }

    if (bannerImage !== undefined) adminConfig.bannerImage = bannerImage;
    if (categories !== undefined) adminConfig.categories = categories;

    const updatedConfig = await adminConfig.save();
    res.json(updatedConfig);
  } catch (error) {
    next(error);
  }
};
