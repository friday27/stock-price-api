const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const {updateStockPrice, getTickerInfo} = require('../utils/get-latest-price');
const Stock = require('../models/stock');
const Price = require('../models/price');

router.get('/stocks/ticker', auth, async (req, res) => {
  if (!req.query.q) {
    res.status(400).send();
  }
  await getTickerInfo(req.user.finnhubToken, req.query.q, (err, result) => {
    if (err) {
      res.status(400).send();
    }
    res.send(result);
  });
});

router.get('/stocks', auth, async (req, res) => {
  // Show return(%), profit and all stocks listed in the user's watchlist
  const stocks = await Stock.aggregate([
  // Find stock transactions with userId
    {$match: {
      userId: req.user._id.toString()
    }},
    // Group it by ticker
    {$group: {
      _id: '$ticker',
      totalCost: {$sum: '$cost'},
      totalAmount: {$sum: '$amount'}
    }},
    // Populate price info from prices collections
    {$lookup: {
      from: 'prices',
      localField: '_id',
      foreignField: 'displaySymbol',
      as: 'priceInfo'
    }},
    // adjust output format
    {$project: { 
      _id: 0,
      ticker: '$_id',
      totalCost: 1,
      totalAmount: 1,
      priceInfo: {
        price: 1,
        exchange: 1,
        currency: 1,
        updatedAt: 1
      }
    }}
  ]);
  
  // Calculate total profit and return
  let revenue = 0;
  let cost = 0;
  await stocks.forEach(async (stockObj) => {
    // If the price is updated 5 minutes age, request and save the latest price.
    const minutes = await Math.floor(Math.abs(new Date() - stockObj.priceInfo[0].updatedAt)/60000);
    if (minutes > 5) {
      await updateStockPrice(req.user.finnhubToken, stockObj.ticker, async (err) => {
        if (err) {
          console.log(err);
        }
      });
      const newData = await Price.findOne({displaySymbol: stockObj.ticker});
      stockObj.priceInfo[0].price = newData.price;
      stockObj.priceInfo[0].updatedAt = newData.updatedAt;
    }

    if (stockObj.totalAmount != 0) {
      cost += await stockObj.totalCost * stockObj.totalAmount;
      revenue += await stockObj.priceInfo.price * stockObj.totalAmount;
    }
  });

  let profit = revenue - cost;
  res.send({
    profit,
    'return': profit === 0? 0: (revenue-cost) / cost * 100,
    stocks
  });
});

// Add tickers into the user's watchlish
router.post('/stocks', auth, async (req, res) => {
  if (!req.query.tickers) {
    res.status(400).send();
  }

  try {
    const tickers = await req.query.tickers.split(',');
    tickers.forEach(async (ticker) => {
      const foundStock = await Stock.findOne({userId: req.user._id, ticker});
      if (!foundStock) {
        const transac = await new Stock({
          userId: req.user._id,
          ticker
        });
        await transac.save();
      }
    });
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  } 
});

// Add tickers along with cost and amount into the user's watchlist
// router.patch('/stocks', auth, async (res, res) => {
// });

module.exports = router;