const mongoose = require('mongoose');

const eventRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  guests: { type: Number, required: true },
  eventType: { type: String, required: true },
  venue: { type: String, required: true },
  dietary: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Contacted', 'Confirmed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventRequest', eventRequestSchema);
