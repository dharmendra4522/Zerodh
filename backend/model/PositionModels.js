const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  avg: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  net: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  isLoss: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PositionModels = mongoose.model('Position', positionSchema);

module.exports = { PositionModels }; 