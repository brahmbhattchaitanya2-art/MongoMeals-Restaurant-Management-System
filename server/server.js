const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mongo-meals';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/seed', async (req, res) => {
  try {
    const MenuItem = require('./models/MenuItem');
    const menuItems = [
      { id: 1, name: 'Truffle Burrata', category: 'Starters', type: 'veg', price: 850, description: 'Creamy burrata draped in black truffle oil, heirloom tomatoes, and aged balsamic pearls.', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&h=400&fit=crop' },
      { id: 2, name: 'Seared Tuna Tataki', category: 'Starters', type: 'non-veg', price: 1200, description: 'Premium yellowfin tuna, lightly seared and served with ponzu gel, wasabi cream, and microgreens.', image: 'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=600&h=400&fit=crop' },
      { id: 3, name: 'Wild Mushroom Velouté', category: 'Starters', type: 'veg', price: 650, description: 'A velvety porcini and chanterelle soup finished with truffle foam and chive oil.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop' },
      { id: 4, name: 'Lobster Bisque', category: 'Starters', type: 'non-veg', price: 1100, description: 'Rich and creamy lobster bisque with cognac cream and fresh dill garnish.', image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=600&h=400&fit=crop' },
      { id: 5, name: 'Wagyu Tenderloin', category: 'Main Course', type: 'non-veg', price: 4500, description: 'A5-grade wagyu beef, sous-vide to perfection, with potato mousseline and red wine jus.', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop' },
      { id: 6, name: 'Pan-Roasted Halibut', category: 'Main Course', type: 'non-veg', price: 2800, description: 'Atlantic halibut on a bed of saffron risotto with beurre blanc and fennel fronds.', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop' },
      { id: 7, name: 'Truffle Risotto Nero', category: 'Main Course', type: 'veg', price: 1800, description: 'Arborio rice slow-cooked in squid ink, finished with shaved black truffle and parmesan crisp.', image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?w=600&h=400&fit=crop' },
      { id: 8, name: 'Herb-Crusted Lamb Rack', category: 'Main Course', type: 'non-veg', price: 3200, description: 'New Zealand lamb rack, herb-crusted, with rosemary potatoes and minted pea purée.', image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=600&h=400&fit=crop' },
      { id: 9, name: 'Miso-Glazed Aubergine', category: 'Main Course', type: 'veg', price: 1400, description: 'Roasted Japanese aubergine with white miso glaze, sesame, and pickled ginger.', image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&h=400&fit=crop' },
      { id: 10, name: 'Valrhona Fondant', category: 'Desserts', type: 'veg', price: 950, description: '70% Valrhona dark chocolate fondant with a molten center, vanilla bean ice cream.', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop' },
      { id: 11, name: 'Crème Brûlée Trio', category: 'Desserts', type: 'veg', price: 780, description: 'Classic vanilla, lavender, and passion fruit crème brûlées with caramelized sugar crust.', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=400&fit=crop' },
      { id: 12, name: 'Tiramisu Deconstructed', category: 'Desserts', type: 'veg', price: 880, description: 'Espresso-soaked savoiardi, mascarpone mousse, and cocoa dust in a modern presentation.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop' },
      { id: 13, name: 'Aged Single Malt', category: 'Beverages', type: 'non-veg', price: 1500, description: '18-year Highland single malt whisky, served neat with a side of artisanal dark chocolate.', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=400&fit=crop' },
      { id: 14, name: 'Sommelier\'s Wine Pairing', category: 'Beverages', type: 'veg', price: 2200, description: 'A curated flight of three estate-selected wines paired to complement your meal.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop' },
      { id: 15, name: 'Botanical Elixir', category: 'Beverages', type: 'veg', price: 650, description: 'House-crafted non-alcoholic cocktail with elderflower, cucumber, and sparkling tonic.', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&h=400&fit=crop' },
      { id: 16, name: 'Matcha Ceremony', category: 'Beverages', type: 'veg', price: 550, description: 'Ceremonial-grade Uji matcha, whisked to perfection and served with a delicate mochi.', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=400&fit=crop' }
    ];
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);
    
    // Seed Admin User
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    await User.deleteMany({ email: 'admin@mongomeals.com' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin User',
      email: 'admin@mongomeals.com',
      password: hashedPassword,
      role: 'admin',
      points: 1000,
      tier: 'Platinum'
    });

    res.send('<h1 style="font-family:sans-serif; text-align:center; margin-top:50px; color:green;">Database successfully seeded (MenuItems + Admin)! Go back to your website and refresh!</h1>');
  } catch(e) {
    res.status(500).send(e.message);
  }
});

// Custom Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
