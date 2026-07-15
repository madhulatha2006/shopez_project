import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Admin from '../models/Admin.js';

dotenv.config();

const sampleProducts = [
  {
    title: 'Precision Pro Wireless ANC Headphones',
    description: 'Immerse yourself in premium studio sound with active noise-cancellation, 40-hour battery life, and plush memory foam ear cushions.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
    price: 189.99,
    discount: 15,
    stock: 25,
    rating: 4.8,
  },
  {
    title: 'Ultralight Ergo Mechanical Keyboard',
    description: 'Hot-swappable custom tactile switches, RGB per-key backlighting, and a compact 75% mechanical layout for programmers and gamers.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600',
    price: 119.99,
    discount: 10,
    stock: 40,
    rating: 4.6,
  },
  {
    title: 'AeroGlide Running Shoes',
    description: 'Designed for marathon runners and casual joggers alike. Features nitrogen-infused foam midsoles and high-grip rubber treads.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
    price: 129.50,
    discount: 20,
    stock: 15,
    rating: 4.7,
  },
  {
    title: 'Vintage Leather Bomber Jacket',
    description: 'Handcrafted from 100% full-grain cowhide leather. Soft satin lining, dual interior pockets, and heavy-duty brass zippers.',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600',
    price: 249.99,
    discount: 5,
    stock: 8,
    rating: 4.9,
  },
  {
    title: 'Smart Barista Espresso Machine',
    description: '15-bar Italian pressure pump with integrated thermal block heating, micro-foam milk texturer, and customizable espresso shot sizes.',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=600',
    price: 349.99,
    discount: 0,
    stock: 12,
    rating: 4.5,
  },
  {
    title: 'Atomic Habits (Paperback)',
    description: 'An easy and proven way to build good habits and break bad ones. The legendary self-help masterpiece by author James Clear.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600',
    price: 16.99,
    discount: 10,
    stock: 100,
    rating: 4.9,
  },
  {
    title: 'Organic Vitamin C Glow Serum',
    description: 'Infused with cold-pressed rosehip seed oil, hyaluronic acid, and 20% stable Vitamin C to brighten and hydrate skin tone.',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600',
    price: 24.50,
    discount: 25,
    stock: 60,
    rating: 4.4,
  },
  {
    title: 'Carbon Fiber Trekking Poles',
    description: 'Extremely lightweight, telescoping hiking poles with ergonomic cork grips and shock-absorption mechanism. Perfect for technical trails.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=600',
    price: 49.99,
    discount: 0,
    stock: 30,
    rating: 4.3,
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Seed: Connected to MongoDB...');

    // Clear previous records
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Admin.deleteMany();
    console.log('Seed: Database cleared of old data.');

    // Seed Admin Config
    await Admin.create({
      bannerImage: [
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070'
      ],
      categories: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports']
    });
    console.log('Seed: Admin settings seeded.');

    // Seed default users
    // Note: The User model pre-save hook will hash the passwords automatically
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'admin123',
      role: 'admin',
      address: '100 Admin HQ Blvd, San Francisco, CA',
      phone: '1-800-555-0199',
    });

    const customerUser = await User.create({
      name: 'Jane Doe',
      email: 'customer@shopez.com',
      password: 'customer123',
      role: 'customer',
      address: '456 Willow Creek Rd, Seattle, WA',
      phone: '1-206-555-0144',
    });

    console.log('Seed: Users seeded.');
    console.log(`  Admin: email: "${adminUser.email}" / pwd: "admin123"`);
    console.log(`  Customer: email: "${customerUser.email}" / pwd: "customer123"`);

    // Seed products
    await Product.insertMany(sampleProducts);
    console.log(`Seed: ${sampleProducts.length} Products seeded successfully.`);

    console.log('Seed: Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Seed Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
