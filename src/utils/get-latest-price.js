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

function getExchangeInfo(token, exchange, callback) {
  request(`https://finnhub.io/api/v1/forex/symbol?exchange=${exchange}&token=${token}`, {json: true}, (err, res, body) => {
  if (err) { 
    callback(err);
  }
  callback(null, body);
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
};

function updateFxPrice(token, symbol, callback) {
  request(`https://finnhub.io/api/v1/forex/candle?symbol=${symbol}&resolution=D&count=1&token=${token}`, {json: true}, async (err, res, body) => {
    let price;
    if (err || !body.s || body.s !== 'ok') { 
      price = await Price.findOne({symbol});
      price.price = null;
      price.updatedAt = new Date();
      await price.save();
      callback(err);
    }
    try {
      price = await Price.findOne({symbol});
      price.price = body.c? body.c[0]: null;
      price.updatedAt = new Date();
      await price.save();
      callback();
    } catch (e) {
      callback(e);
    }
  });
};

module.exports = {
  updateStockPrice,
  updateFxPrice,
  getTickerInfo,
  getExchangeInfo
};