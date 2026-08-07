const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['veg', 'non-veg', 'vegan'], required: true },
  image: { type: String, required: true },
  availability: { type: String, enum: ['Available', 'Out of Stock'], default: 'Available' },
  isChefSpecial: { type: Boolean, default: false }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
