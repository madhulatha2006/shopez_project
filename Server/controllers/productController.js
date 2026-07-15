import Product from '../models/Product.js';

// @desc    Get all products (with optional filtering, search, and sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;

    let query = {};

    // Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search Query
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Price Filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let apiQuery = Product.find(query);

    // Sorting
    if (sort) {
      if (sort === 'priceAsc') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'priceDesc') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ rating: -1 });
      } else if (sort === 'newest') {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 }); // default sorting
    }

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products (also mapped to /api/admin/product)
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, image, price, discount, stock, rating } = req.body;

    const product = await Product.create({
      title,
      description,
      category,
      image,
      price,
      discount: discount || 0,
      stock: stock || 0,
      rating: rating || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id (also mapped to /api/admin/product/:id)
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { title, description, category, image, price, discount, stock, rating } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.category = category || product.category;
      product.image = image || product.image;
      product.price = price !== undefined ? price : product.price;
      product.discount = discount !== undefined ? discount : product.discount;
      product.stock = stock !== undefined ? stock : product.stock;
      product.rating = rating !== undefined ? rating : product.rating;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id (also mapped to /api/admin/product/:id)
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
