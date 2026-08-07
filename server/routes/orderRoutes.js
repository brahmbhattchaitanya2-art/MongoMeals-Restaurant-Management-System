const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders (Public or authenticated)
// Note: We use a custom middleware inline to set req.user if token exists, but not fail if it doesn't.
// Since protect forces 401 on no token, we'll just allow POST to createOrder to be public
// but we'll try to extract the user from the token if possible. Let's just make it entirely public
// and if they pass a token, we handle it in auth check, or just rely on protect for /my-orders.

const { jwt } = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.error(error);
    }
  }
  next();
};

router.post('/', protect, createOrder);
router.route('/my-orders').get(protect, getMyOrders);

module.exports = router;
