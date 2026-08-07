const User = require('../models/User');
const Reward = require('../models/Reward');
const RewardHistory = require('../models/RewardHistory');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const Newsletter = require('../models/Newsletter');
const { sendEmail } = require('../utils/mailService');

const calculateTier = (points) => {
  if (points >= 4000) return 'Platinum';
  if (points >= 1500) return 'Gold';
  return 'Silver';
};

// @desc    Get all active rewards
// @route   GET /api/users/rewards
// @access  Public
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ isActive: true });
    res.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user's reward history
// @route   GET /api/users/history
// @access  Private
const getRewardHistory = async (req, res) => {
  try {
    const history = await RewardHistory.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching reward history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reward statistics for the user
// @desc    Get reward statistics for the user
// @route   GET /api/users/stats
// @access  Private
const getRewardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count orders as visits
    const visits = user.visits || await Order.countDocuments({ userId });
    
    // Count reservations
    const reservations = user.reservations || await Reservation.countDocuments({ userId });
    
    // Calculate total earned and redeemed from RewardHistory
    const history = await RewardHistory.find({ userId });
    
    let redeemed = 0;
    let earned = 0;
    
    history.forEach(item => {
      if (item.type === 'Redeemed') {
        redeemed += item.points;
      } else if (item.type === 'Earned') {
        earned += item.points;
      }
    });

    const currentBalance = user.rewardPoints !== undefined ? user.rewardPoints : user.points;
    const totalEarned = user.totalEarned !== undefined ? user.totalEarned : (earned || (currentBalance + redeemed));

    res.json({
      currentBalance,
      totalEarned,
      redeemed,
      visits,
      reservations
    });
  } catch (error) {
    console.error('Error fetching reward stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Redeem reward points
// @route   POST /api/users/redeem
// @access  Private
const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    
    if (!rewardId) {
      return res.status(400).json({ message: 'Invalid reward selection' });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const user = await User.findById(req.user._id);

    const currentBalance = user.rewardPoints !== undefined ? user.rewardPoints : user.points;
    if (currentBalance < reward.pointsCost) {
      return res.status(400).json({ message: 'Not enough reward points.' });
    }

    user.rewardPoints = currentBalance - reward.pointsCost;
    user.points = user.rewardPoints;
    user.tier = calculateTier(user.rewardPoints);

    // Create reward history record
    const history = new RewardHistory({
      userId: user._id,
      type: 'Redeemed',
      points: reward.pointsCost,
      description: `Redeemed ${reward.name}`
    });
    const savedHistory = await history.save();

    if (!user.rewardHistory) user.rewardHistory = [];
    user.rewardHistory.push(savedHistory._id);
    await user.save();

    res.json({
      message: 'Reward redeemed successfully',
      points: user.rewardPoints,
      tier: user.tier,
      history: savedHistory
    });

  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Refer a friend and get points
// @route   POST /api/users/refer
// @access  Private
const referFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.points += 300;
    user.tier = calculateTier(user.points);
    await user.save();

    // Log the referral bonus in RewardHistory
    const history = new RewardHistory({
      userId: user._id,
      type: 'Earned',
      points: 300,
      description: 'Friend Referral Bonus'
    });
    await history.save();

    res.json({
      message: 'Referral successful, points added!',
      points: user.points,
      tier: user.tier,
      history
    });

  } catch (error) {
    console.error('Error in referral:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitReviewPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.points += 50;
    user.tier = calculateTier(user.points);
    await user.save();

    const history = new RewardHistory({
      userId: user._id,
      type: 'Earned',
      points: 50,
      description: 'Submitted a Review'
    });
    await history.save();

    res.json({ message: 'Review points added!', points: user.points, tier: user.tier });
  } catch (error) {
    console.error('Error in review points:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const completeProfilePoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isProfileCompleted) {
      return res.status(400).json({ message: 'Profile already completed bonus awarded.' });
    }
    user.isProfileCompleted = true;
    user.points += 100;
    user.tier = calculateTier(user.points);
    await user.save();

    const history = new RewardHistory({
      userId: user._id,
      type: 'Earned',
      points: 100,
      description: 'Completed Profile Bonus'
    });
    await history.save();

    res.json({ message: 'Profile completion points added!', points: user.points, tier: user.tier });
  } catch (error) {
    console.error('Error in profile completion points:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  try {
    let subscription = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (!subscription) {
      subscription = await Newsletter.create({ email: email.toLowerCase() });
    }

    // Send newsletter welcome email
    sendEmail({
      to: email,
      subject: 'Welcome to MongoMeals Community',
      text: `Hello,\n\nThank you for subscribing to the MongoMeals inner circle! You are now part of our exclusive community. You will receive future offers, updates, and seasonal tasting menu highlights.\n\nBest regards,\nThe MongoMeals Team`
    });

    res.status(200).json({ message: 'Welcome to the inner circle' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Server error during subscription.' });
  }
};

module.exports = {
  getRewards,
  getRewardHistory,
  getRewardStats,
  redeemReward,
  referFriend,
  submitReviewPoints,
  completeProfilePoints,
  calculateTier,
  subscribeNewsletter
};
