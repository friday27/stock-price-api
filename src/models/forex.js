const mongoose = require('mongoose');

const forexSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  symbol: { // includes exchange and forex pair (e.g. OANDA:GBP_USD)
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  cost: {
    type: Number,
    default: null,
    validator(value) {
      if (value <= 0) {
        throw new Error('The cost should not be 0 or any negative number!');
      }
    }
  },
  amount: {
    type: Number,
    default: null,
    validator(value) {
      if (value <= 0) {
        throw new Error('The amount should not be 0 or any negative number!');
      }
    }
  }
}, {
  timestamps: true,
  collection: 'forex'
});

const Forex = mongoose.model('Forex', forexSchema);

module.exports = Forex;