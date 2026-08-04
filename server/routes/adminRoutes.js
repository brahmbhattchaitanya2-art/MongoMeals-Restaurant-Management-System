const express = require('express');
const router = express.Router();
const { getUsers, getOrders, getReservations } = require('../controllers/adminController');
const { getReviewsAdmin, updateReviewStatus } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes in this file are protected by protect and admin middlewares
router.use(protect, admin);

router.get('/users', getUsers);
router.get('/orders', getOrders);
router.get('/reservations', getReservations);
router.get('/reviews', getReviewsAdmin);
router.put('/reviews/:id/status', updateReviewStatus);

module.exports = router;
