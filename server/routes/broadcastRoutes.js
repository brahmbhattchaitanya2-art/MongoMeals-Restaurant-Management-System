const express = require('express');
const router = express.Router();
const { getRecipients, sendBroadcast } = require('../controllers/broadcastController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to get all unique recipients, protected for admin access only
router.get('/recipients', protect, admin, getRecipients);

// Route to send email broadcast to selected recipients, protected for admin access only
router.post('/send', protect, admin, sendBroadcast);

module.exports = router;
