const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '19:00' },
  guests: { type: Number, required: true },
  table: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

reservationSchema.index(
  { date: 1, time: 1, table: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['Confirmed', 'Pending', 'Completed'] }
    }
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
