const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    uppercase: true,
    trim: true,
    unique: true,
    require: true
  },
  company: {
    type: String,
    trim: true,
    require: true
  },
  popularity: {
    type: Number,
    default: 0
  }
});

stockSchema.methods.toJSON = function() {
  const stock = this;
  const stockObj = stock.toObject();
  delete stockObj._id;
  delete stockObj.__v;
  return stockObj;
};

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;