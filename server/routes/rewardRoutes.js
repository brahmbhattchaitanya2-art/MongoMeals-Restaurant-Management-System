const express = require('express');
const { getRewards, createReward, updateReward, deleteReward, getRedeemedHistory } = require('../controllers/rewardController');
const { redeemReward } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getRewards);
router.post('/redeem', protect, redeemReward); // User redeem endpoint alias
router.post('/', protect, admin, upload.single('image'), createReward);
router.put('/:id', protect, admin, upload.single('image'), updateReward);
router.delete('/:id', protect, admin, deleteReward);
router.get('/history', protect, admin, getRedeemedHistory);

module.exports = router;
