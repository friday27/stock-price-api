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
    default: null,
    validate(value) {
      if (value <= 0) {
        throw new Error('The cost should not be 0 or any negative number!');
      }
    }
  },
  amount: {
    type: Number,
    default: null,
    validate(value) {
      if (value <= 0) {
        throw new Error('The amount should not be 0 or any negative number!');
      }
    }
  }
}, {
  timestamps: true
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;