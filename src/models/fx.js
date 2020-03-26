const mongoose = require('mongoose');

const fxSchema = new mongoose.Schema({
  symbol: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  forexSymbol: {
    type: String,
    require: true,
    trim: true,
    uppercase: true
  },
  popularity: {
    type: Number,
    default: 0
  }
});

fxSchema.methods.toJSON = function() {
  const fx = this;
  const fxObj = fx.toObject();

  delete fxObj._id;
  delete fxObj.__v;

  return fxObj;
};

const Forex = mongoose.model('Forex', fxSchema);

module.exports = Forex;