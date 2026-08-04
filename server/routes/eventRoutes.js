const express = require('express');
const router = express.Router();
const {
  submitEventRequest,
  getAllEventRequests,
  updateEventRequestStatus,
  deleteEventRequest
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/request', submitEventRequest);

// Admin-only event management routes
router.get('/requests', protect, admin, getAllEventRequests);
router.put('/requests/:id/status', protect, admin, updateEventRequestStatus);
router.delete('/requests/:id', protect, admin, deleteEventRequest);

module.exports = router;
