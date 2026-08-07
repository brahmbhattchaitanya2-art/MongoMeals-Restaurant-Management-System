const Order = require('../models/Order');
const User = require('../models/User');
const { calculateTier } = require('./userController');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public or Private (handled via optional auth)
const createOrder = async (req, res) => {
  try {
    const { items, subtotal, tax, serviceFee, total, guestEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const orderData = {
      items: items.map(item => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      tax,
      serviceFee,
      total,
      guestEmail: req.user ? undefined : guestEmail
    };

    if (req.user) {
      orderData.userId = req.user._id;
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();

    if (req.user) {
      const user = await User.findById(req.user._id);
      
      const basePoints = Math.floor(total / 10);
      let bonusPoints = 0;
      let bonusDesc = '';
      if (total > 2500) {
        bonusPoints = 250;
        bonusDesc = 'Order above ₹2500 Bonus';
      } else if (total > 1000) {
        bonusPoints = 100;
        bonusDesc = 'Order above ₹1000 Bonus';
      }

      const totalAwarded = basePoints + bonusPoints;
      
      // Increment visits count
      user.visits = (user.visits || 0) + 1;
      user.rewardPoints = (user.rewardPoints || 0) + totalAwarded;
      user.points = user.rewardPoints; // Sync points
      user.totalEarned = (user.totalEarned || 0) + totalAwarded;
      
      user.tier = calculateTier(user.rewardPoints);
      
      const RewardHistory = require('../models/RewardHistory');
      const historyItems = [];
      
      if (basePoints > 0) {
        const hist1 = await RewardHistory.create({
          userId: user._id,
          type: 'Earned',
          points: basePoints,
          description: `Points earned on Order #${createdOrder._id.toString().slice(-6).toUpperCase()}`
        });
        historyItems.push(hist1._id);
      }

      if (bonusPoints > 0) {
        const hist2 = await RewardHistory.create({
          userId: user._id,
          type: 'Earned',
          points: bonusPoints,
          description: bonusDesc
        });
        historyItems.push(hist2._id);
      }

      if (!user.rewardHistory) user.rewardHistory = [];
      user.rewardHistory.push(...historyItems);
      await user.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
