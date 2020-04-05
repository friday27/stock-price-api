const mongooese = require('mongoose');

const priceSchema = new mongooese.Schema({
  exchange: {
    type: String,
    trim: true,
    require: true,
    uppercase: true
  },
  displaySymbol: { // no need to be unique
    type: String,
    require: true,
    trim: true,
    uppercase: true
  },
  symbol: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    trim: true,
    require: true
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  country: {
    type: String,
    require: true,
    trim: true,
    uppercase: true
  },
  currency: {
    type: String,
    require: true,
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    default: null
  },
  popularity: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

priceSchema.methods.toJSON = function() {
  const price = this;
  const priceObj = price.toObject();

  delete priceObj._id;
  delete priceObj.__v;
  delete priceObj.createdAt;

  return priceObj;
};

const Price = mongooese.model('Price', priceSchema);

module.exports = Price;