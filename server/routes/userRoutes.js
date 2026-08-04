const express = require('express');
const {
  redeemReward,
  referFriend,
  getRewards,
  getRewardHistory,
  getRewardStats,
  submitReviewPoints,
  completeProfilePoints,
  subscribeNewsletter
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/rewards', getRewards);
router.get('/history', protect, getRewardHistory);
router.get('/stats', protect, getRewardStats);
router.post('/redeem', protect, redeemReward);
router.post('/refer', protect, referFriend);
router.post('/review', protect, submitReviewPoints);
router.post('/complete-profile', protect, completeProfilePoints);
router.post('/subscribe-newsletter', subscribeNewsletter);

module.exports = router;
