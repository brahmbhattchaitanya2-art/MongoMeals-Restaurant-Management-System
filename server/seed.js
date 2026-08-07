const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Reservation = require('./models/Reservation');
const Reward = require('./models/Reward');
const RewardHistory = require('./models/RewardHistory');

// Existing data extracted from src/data/menuData.js
const menuItems = [
  // Starters
  {
    id: 1, name: 'Pav Bhaji', category: 'Starters', type: 'veg',
    price: 250, description: 'Spicy mashed vegetable curry served with soft butter-toasted bread rolls.',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&h=400&fit=crop'
  },
  {
    id: 2, name: 'Tandoori Chicken', category: 'Starters', type: 'non-veg',
    price: 450, description: 'Chicken marinated in yogurt and spices, roasted to perfection in a clay oven.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop'
  },
  {
    id: 3, name: 'Chole Bhature', category: 'Starters', type: 'veg',
    price: 300, description: 'Spicy chickpeas served with fluffy, deep-fried leavened sourdough bread.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'
  },
  // Main Course
  {
    id: 4, name: 'Paneer Butter Masala', category: 'Main Course', type: 'veg',
    price: 380, description: 'Succulent cottage cheese cubes simmered in a rich tomato, butter, and cashew gravy.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop'
  },
  {
    id: 5, name: 'Dal Makhani', category: 'Main Course', type: 'veg',
    price: 320, description: 'Slow-cooked black lentils and kidney beans cooked overnight with butter and cream.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop'
  },
  {
    id: 6, name: 'Butter Chicken', category: 'Main Course', type: 'non-veg',
    price: 480, description: 'Tender tandoori chicken pieces cooked in a velvety tomato and butter cream sauce.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop'
  },
  {
    id: 7, name: 'Chicken Tikka Masala', category: 'Main Course', type: 'non-veg',
    price: 480, description: 'Roasted marinated chicken chunks in a spiced, creamy orange-colored gravy.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop'
  },
  {
    id: 8, name: 'Mutton Rogan Josh', category: 'Main Course', type: 'non-veg',
    price: 580, description: 'A classic Kashmiri lamb curry slow-cooked with aromatic spices and red chili.',
    image: 'https://images.unsplash.com/photo-1544025162-811114bd0a0e?w=600&h=400&fit=crop'
  },
  // Biryani
  {
    id: 9, name: 'Veg Biryani', category: 'Biryani', type: 'veg',
    price: 350, description: 'Fragrant basmati rice layered with assorted vegetables, slow-cooked in a sealed handi.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop'
  },
  {
    id: 10, name: 'Chicken Biryani', category: 'Biryani', type: 'non-veg',
    price: 450, description: 'Classic Hyderabadi chicken biryani cooked on dum with long-grain basmati rice and aromatic spices.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&h=400&fit=crop'
  },
  // South Indian
  {
    id: 11, name: 'Masala Dosa', category: 'South Indian', type: 'veg',
    price: 200, description: 'Thin, crispy rice crepe filled with spiced potato mash, served with sambar and coconut chutney.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&h=400&fit=crop'
  },
  // Desserts
  {
    id: 12, name: 'Gulab Jamun', category: 'Desserts', type: 'veg',
    price: 150, description: 'Soft, golden-brown milk solid dumplings soaked in cardamom-flavored sugar syrup.',
    image: 'https://images.unsplash.com/photo-1589119908995-c6800faecf39?w=600&h=400&fit=crop'
  },
  {
    id: 13, name: 'Rasmalai', category: 'Desserts', type: 'veg',
    price: 185, description: 'Flattened paneer discs soaked in thickened, sweetened milk infused with saffron and pistachios.',
    image: 'https://images.unsplash.com/photo-1589119908995-c6800faecf39?w=600&h=400&fit=crop'
  },
  // Beverages
  {
    id: 14, name: 'Lassi', category: 'Beverages', type: 'veg',
    price: 120, description: 'Traditional sweet yogurt-based drink topped with cream and dry fruits.',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&h=400&fit=crop'
  },
  {
    id: 15, name: 'Masala Chai', category: 'Beverages', type: 'veg',
    price: 80, description: 'Spiced Indian tea brewed with milk, ginger, cardamom, and tea leaves.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop'
  }
];

const categories = ['Starters', 'Main Course', 'Biryani', 'South Indian', 'Desserts', 'Beverages'];

const dashboardOrders = [
  {
    id: 'ORD-2024-001', date: '2024-12-15', status: 'Completed',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 480 },
      { name: 'Paneer Butter Masala', quantity: 1, price: 380 },
      { name: 'Gulab Jamun', quantity: 2, price: 150 },
      { name: 'Lassi', quantity: 2, price: 120 },
    ]
  },
  {
    id: 'ORD-2024-002', date: '2024-11-28', status: 'Completed',
    items: [
      { name: 'Pav Bhaji', quantity: 2, price: 250 },
      { name: 'Mutton Rogan Josh', quantity: 1, price: 580 },
      { name: 'Rasmalai', quantity: 1, price: 185 },
    ]
  },
  {
    id: 'ORD-2025-003', date: '2025-01-10', status: 'Completed',
    items: [
      { name: 'Tandoori Chicken', quantity: 2, price: 450 },
      { name: 'Masala Chai', quantity: 3, price: 80 },
    ]
  },
];

const dashboardReservations = [
  { name: 'Alexander Sterling', phone: '1234567890', date: '2025-07-15', time: '19:30', guests: 4, table: 3, status: 'Confirmed' },
  { name: 'Alexander Sterling', phone: '1234567890', date: '2025-08-02', time: '20:00', guests: 2, table: 1, status: 'Confirmed' },
  { name: 'Alexander Sterling', phone: '1234567890', date: '2025-08-20', time: '19:00', guests: 8, table: 10, status: 'Pending' },
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mongo-meals';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding...');
    
    // Clear existing
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Reservation.deleteMany({});
    await Reward.deleteMany({});
    await RewardHistory.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed Categories
    const categoryDocs = categories.map((name, index) => ({ name, order: index }));
    await Category.insertMany(categoryDocs);
    console.log('Successfully seeded categories!');
    
    // Seed Menu Items
    await MenuItem.insertMany(menuItems);
    console.log('Successfully seeded menu items!');

    // Seed Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@mongomeals.com',
      password: hashedPassword,
      role: 'admin',
      points: 1000,
      tier: 'Platinum'
    });
    console.log('Successfully seeded admin user (admin@mongomeals.com / admin123)!');

    // Seed Orders
    const orderDocs = dashboardOrders.map(o => {
      const subtotal = o.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.05;
      const serviceFee = 50;
      const total = subtotal + tax + serviceFee;
      return {
        userId: adminUser._id,
        items: o.items,
        subtotal,
        tax,
        serviceFee,
        total,
        status: o.status,
        createdAt: new Date(o.date)
      };
    });
    await Order.insertMany(orderDocs);
    console.log('Successfully seeded orders!');

    // Seed Reservations
    const reservationDocs = dashboardReservations.map(r => ({
      userId: adminUser._id,
      name: r.name,
      phone: r.phone,
      date: r.date,
      guests: r.guests,
      table: r.table,
      status: r.status
    }));
    await Reservation.insertMany(reservationDocs);
    console.log('Successfully seeded reservations!');

    // Seed Rewards
    const rewards = [
      { name: 'Free Soft Drink', description: 'Quench your thirst with a complimentary beverage.', pointsCost: 200, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop' },
      { name: 'Dessert', description: 'Enjoy any signature dessert from our menu.', pointsCost: 400, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop' },
      { name: 'Starter', description: 'Choose any fine starter of your choice.', pointsCost: 700, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&h=400&fit=crop' },
      { name: '₹250 Voucher', description: 'Get a flat ₹250 off on your next dining bill.', pointsCost: 1000, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop' }
    ];
    await Reward.insertMany(rewards);
    console.log('Successfully seeded rewards!');

    // Seed Reward History
    const historyDocs = [
      { userId: adminUser._id, type: 'Earned', points: 500, description: 'Welcome Bonus Points', date: new Date('2025-06-01') },
      { userId: adminUser._id, type: 'Earned', points: 700, description: 'Spent on Dining', date: new Date('2025-06-15') },
      { userId: adminUser._id, type: 'Redeemed', points: 200, description: 'Redeemed Free Soft Drink', date: new Date('2025-06-20') }
    ];
    await RewardHistory.insertMany(historyDocs);
    console.log('Successfully seeded reward history!');
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  });
