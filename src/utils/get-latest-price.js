const request = require('request');
const Price = require('../models/price');

function getTickerInfo(token, ticker, callback) {
  request(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${token}`, {json: true}, (err, res, body) => {
  if (err) { 
    callback(err);
  }
  if (!body.c) {
    callback('Cannot request from Finnhub API');
  } else {
    callback(null, {
      ticker,
      open: body.o,
      high: body.h,
      low: body.l,
      current: body.c,
      previousClose: body.pc,
      time: new Date(body.t)
    });
  }
});
};

function updateStockPrice(token, ticker, callback) {
  request(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${token}`, {json: true}, async (err, res, body) => {
    let price;
    if (err || !body.c) { 
      price = await Price.findOne({displaySymbol: ticker});
      price.price = null;
      price.updatedAt = new Date();
      await price.save();
      // Price.findOneAndUpdate({displaySymbol: ticker}, {$set: {price: null}});
      callback(err);
    }
    price = await Price.findOne({displaySymbol: ticker});
    price.price = body.c;
    price.updatedAt = new Date();
    await price.save();
    // Price.findOneAndUpdate({displaySymbol: ticker}, {$set: {price: body.c}});
    callback();
  });
}

module.exports = {
  updateStockPrice,
  getTickerInfo
};