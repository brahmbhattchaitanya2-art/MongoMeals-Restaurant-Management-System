const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  rewardPoints: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  reservations: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  rewardHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RewardHistory' }],
  tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Silver' },
  referralCode: { type: String },
  isProfileCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
