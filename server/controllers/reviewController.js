const Review = require('../models/Review');
const User = require('../models/User');
const RewardHistory = require('../models/RewardHistory');

const calculateTier = (points) => {
  if (points >= 4000) return 'Platinum';
  if (points >= 1500) return 'Gold';
  return 'Silver';
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    console.log("Review API hit");
    const { rating, message } = req.body;
    
    if (!rating || !message) {
      return res.status(400).json({ message: 'Rating and message are required' });
    }

    const review = new Review({
      userId: req.user._id,
      userName: req.user.name,
      rating,
      message,
      status: 'pending'
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    console.log("Review GET API hit");
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews for Admin
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update review status (Approve/Reject)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;

    if (status === 'approved' && !review.rewardGiven) {
      // Award +50 points to user
      const user = await User.findById(review.userId);
      if (user) {
        user.rewardPoints = (user.rewardPoints || 0) + 50;
        user.points = user.rewardPoints; // Sync points
        user.totalEarned = (user.totalEarned || 0) + 50;
        
        user.tier = calculateTier(user.rewardPoints);

        // Create reward history log
        const hist = await RewardHistory.create({
          userId: user._id,
          type: 'Earned',
          points: 50,
          description: 'Submitted a Review (Approved)'
        });

        if (!user.rewardHistory) user.rewardHistory = [];
        user.rewardHistory.push(hist._id);
        await user.save();

        review.rewardGiven = true;
      }
    }

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewsAdmin,
  updateReviewStatus
};
