const Reward = require('../models/Reward');
const RewardHistory = require('../models/RewardHistory');
const User = require('../models/User');

// GET all rewards (active only for public, all for admin if query has all=true)
const getRewards = async (req, res) => {
  try {
    const query = {};
    if (req.query.all !== 'true') {
      query.isActive = true;
    }
    const rewards = await Reward.find(query).sort({ pointsCost: 1 });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error: error.message });
  }
};

// POST add reward (admin only, handles upload)
const createReward = async (req, res) => {
  try {
    const { name, description, pointsCost, tierRequirement, isActive } = req.body;
    
    let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const newReward = await Reward.create({
      name,
      description,
      pointsCost: Number(pointsCost),
      image: imageUrl,
      tierRequirement: tierRequirement || 'Silver',
      isActive: isActive === 'true' || isActive === true
    });
    res.status(201).json(newReward);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reward', error: error.message });
  }
};

// PUT update reward (admin only, handles upload)
const updateReward = async (req, res) => {
  try {
    const { name, description, pointsCost, tierRequirement, isActive } = req.body;
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    let imageUrl = reward.image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    reward.name = name || reward.name;
    reward.description = description || reward.description;
    reward.pointsCost = pointsCost !== undefined ? Number(pointsCost) : reward.pointsCost;
    reward.tierRequirement = tierRequirement || reward.tierRequirement;
    reward.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : reward.isActive;
    reward.image = imageUrl;

    const updatedReward = await reward.save();
    res.json(updatedReward);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reward', error: error.message });
  }
};

// DELETE reward (admin only)
const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    await Reward.deleteOne({ _id: req.params.id });
    res.json({ message: 'Reward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reward', error: error.message });
  }
};

// GET all redeemed history logs for Admin
const getRedeemedHistory = async (req, res) => {
  try {
    const logs = await RewardHistory.find()
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reward history logs', error: error.message });
  }
};

module.exports = {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  getRedeemedHistory
};
