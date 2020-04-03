const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  cost: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('The cost should not be any negative number!');
      }
    }
  },
  amount: { // negative = selling record
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;