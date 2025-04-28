const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  stockSymbol: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  averagePrice: {
    type: Number,
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

const Holding = mongoose.model('Holding', holdingSchema);

module.exports = Holding; 