const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/mailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      points: 50,
      rewardPoints: 50,
      totalEarned: 50,
      tier: 'Silver'
    });

    if (user) {
      const RewardHistory = require('../models/RewardHistory');
      const historyItem = await RewardHistory.create({
        userId: user._id,
        type: 'Earned',
        points: 50,
        description: 'Sign Up Bonus'
      });
      
      user.rewardHistory = [historyItem._id];
      await user.save();

      // Send Welcome Email
      sendEmail({
        to: user.email,
        subject: 'Welcome to MongoMeals',
        text: `Hello ${user.name},\n\nThank you for creating a MongoMeals account! Welcome to our exclusive culinary community. We look forward to serving you the finest experiences.\n\nBest regards,\nThe MongoMeals Team`
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        rewardPoints: user.rewardPoints,
        tier: user.tier,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Send Login Alert Email
      sendEmail({
        to: user.email,
        subject: 'MongoMeals Login Alert',
        text: `Hello ${user.name},\n\nThis is to inform you that your MongoMeals account was successfully signed in on ${new Date().toLocaleString()}.\n\nIf this was not you, please contact support immediately.\n\nBest regards,\nThe MongoMeals Team`
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        tier: user.tier,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        tier: user.tier,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
