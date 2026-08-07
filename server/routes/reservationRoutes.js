const express = require('express');
const { createReservation, getOccupiedTables, getUserReservations, createChefsTableReservation } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to create reservation, but optionally takes token if available
// Actually, since we might pass token, we can handle it in the controller by checking req.user
// Let's create a custom middleware that sets req.user if token is present, but doesn't fail if absent
const optionalProtect = require('jsonwebtoken');
const User = require('../models/User');

const setOptionalUser = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = optionalProtect.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // ignore
    }
  }
  next();
};

router.post('/', protect, createReservation);
router.post('/chefs-table', protect, createChefsTableReservation);
router.get('/my-reservations', protect, getUserReservations);
router.get('/occupied', getOccupiedTables);

module.exports = router;
