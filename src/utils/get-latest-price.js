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
    try {
      price = await Price.findOne({displaySymbol: ticker});
      price.price = body.c;
      price.updatedAt = new Date();
      await price.save();
      // callback();
      // Price.findOneAndUpdate({displaySymbol: ticker}, {$set: {price: body.c}});
    } catch (e) {
      const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${token}`;
      callback(`Error: ${e}\nURL: ${url}`);
    }
  });
};

function updateFxPrice(token, symbol, callback) {
  request(`https://finnhub.io/api/v1/forex/candle?symbol=${symbol}&resolution=D&count=1&token=${token}`, {json: true}, async (err, res, body) => {
    try {
      price = await Price.findOne({symbol});
      price.price = body.c[0];
      price.updatedAt = new Date();
      await price.save();
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