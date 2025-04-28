const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL']
  },
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'PENDING',
    enum: ['PENDING', 'COMPLETED', 'CANCELLED']
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

const OrdersModel = mongoose.model('Order', orderSchema);

module.exports = { OrdersModel }; 