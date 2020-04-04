const mongoose = require('mongoose');

const forexSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  symbol: { // includes exchange and forex pair (e.g. OANDA:GBP_USD)
    type: String,
    unique: true,
    required: true,
    uppercase: true,
    trim: true
  },
}, {
  timestamps: true,
  collection: 'forex'
});

const Forex = mongoose.model('Forex', forexSchema);

module.exports = Forex;