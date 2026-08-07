const User = require('../models/User');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/admin/reservations
// @access  Private/Admin
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('userId', 'name email').sort('-date');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

module.exports = {
  getUsers,
  getOrders,
  getReservations
};
