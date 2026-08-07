const Reservation = require('../models/Reservation');
const ChefTableReservation = require('../models/ChefTableReservation');

const createReservation = async (req, res) => {
  try {
    const reservationData = req.body;
    
    // 1. Validation: Prevent past dates
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    if (reservationData.date < todayStr) {
      return res.status(400).json({ message: 'Please select a valid future reservation date.' });
    }

    // 2. Validation: Restaurant opening hours (11:00 AM to 11:00 PM)
    if (reservationData.time) {
      const [resHour, resMin] = reservationData.time.split(':').map(Number);
      const totalMin = resHour * 60 + resMin;
      if (totalMin < 11 * 60 || totalMin > 23 * 60) {
        return res.status(400).json({ message: 'Reservation time must be between 11:00 AM and 11:00 PM.' });
      }
    }

    // 3. Validation: Prevent past times for today
    if (reservationData.date === todayStr && reservationData.time) {
      // Get current local time
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const [resHour, resMin] = reservationData.time.split(':').map(Number);
      if (resHour < currentHour || (resHour === currentHour && resMin <= currentMinute)) {
        return res.status(400).json({ message: 'Please select a valid future time slot for today.' });
      }
    }

    // 4. Validation: Prevent double booking of the same table at the same date/time
    const existing = await Reservation.findOne({
      date: reservationData.date,
      time: reservationData.time || '19:00',
      table: Number(reservationData.table),
      status: { $ne: 'Cancelled' }
    });
    if (existing) {
      return res.status(400).json({ message: 'This table is already booked for selected date and time.' });
    }

    if (req.user) {
      reservationData.userId = req.user._id;
    }
    
    // Ensure table is stored as a number and status defaults to Confirmed
    reservationData.table = Number(reservationData.table);
    if (!reservationData.status) {
      reservationData.status = 'Confirmed';
    }

    const newReservation = new Reservation(reservationData);
    const savedReservation = await newReservation.save();

    // Reward points for reservation
    if (req.user) {
      const User = require('../models/User');
      const RewardHistory = require('../models/RewardHistory');
      
      const user = await User.findById(req.user._id);
      if (user) {
        // Increment user's reservations count
        user.reservations = (user.reservations || 0) + 1;
        
        const isFirst = user.reservations === 1;
        const pointsAwarded = isFirst ? 150 : 50;
        
        user.rewardPoints = (user.rewardPoints || 0) + pointsAwarded;
        user.points = user.rewardPoints; // Sync points
        user.totalEarned = (user.totalEarned || 0) + pointsAwarded;
        
        const calculateTier = (points) => {
          if (points >= 4000) return 'Platinum';
          if (points >= 1500) return 'Gold';
          return 'Silver';
        };
        user.tier = calculateTier(user.rewardPoints);
        
        const historyItems = [];
        if (isFirst) {
          const hist1 = await RewardHistory.create({
            userId: user._id,
            type: 'Earned',
            points: 100,
            description: 'First Reservation Bonus'
          });
          const hist2 = await RewardHistory.create({
            userId: user._id,
            type: 'Earned',
            points: 50,
            description: 'Reservation Loyalty Points'
          });
          historyItems.push(hist1._id, hist2._id);
        } else {
          const hist = await RewardHistory.create({
            userId: user._id,
            type: 'Earned',
            points: 50,
            description: 'Reservation Loyalty Points'
          });
          historyItems.push(hist._id);
        }

        if (!user.rewardHistory) user.rewardHistory = [];
        user.rewardHistory.push(...historyItems);
        await user.save();
      }
    }

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating reservation', error: error.message });
  }
};

const getOccupiedTables = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    const query = { date };
    if (time) {
      query.time = time;
    }
    // Only exclude cancelled reservations
    query.status = { $ne: 'Cancelled' };
    
    const reservations = await Reservation.find(query);
    const occupiedTables = reservations.map(r => r.table);
    res.json(occupiedTables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching occupied tables', error: error.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id }).sort({ date: -1, time: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

const createChefsTableReservation = async (req, res) => {
  try {
    const reservationData = req.body;
    if (req.user) {
      reservationData.userId = req.user._id;
    }
    // Set some defaults for required fields in ChefTableReservation model if missing
    if (!reservationData.phone) reservationData.phone = 'Not provided';
    if (!reservationData.time) reservationData.time = 'TBD';
    if (!reservationData.dietaryRestrictions && reservationData.notes) {
        reservationData.dietaryRestrictions = reservationData.notes;
    }

    const newReservation = new ChefTableReservation(reservationData);
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating VIP reservation', error: error.message });
  }
};

module.exports = { createReservation, getOccupiedTables, getUserReservations, createChefsTableReservation };
