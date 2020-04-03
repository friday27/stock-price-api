const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const {updateStockPrice, getTickerInfo} = require('../utils/get-latest-price');
const Stock = require('../models/stock');
const Price = require('../models/price');

router.get('/stocks/:ticker', auth, async (req, res) => {
  if (!req.params.ticker) {
    res.status(400).send();
  }
  await getTickerInfo(req.user.finnhubToken, req.params.ticker, (err, result) => {
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

/*
- Examine if the ticker is valid
- Save ticker
- update ticker popularity
*/
router.post('/stocks', auth, async (req, res) => {
  const tickerObj = await req.body;
  if (!tickerObj || !tickerObj.ticker) {
    return res.status(400).send();
  }

  // Check if the ticker is supported
  const isSupported = await Price.findOne({displaySymbol: tickerObj.ticker});
  if (!isSupported) {
    return res.status(404).send();
  }

  // If there's no cost/amount, check if it's saved already.
  if (!tickerObj.cost || !tickerObj.amount || tickerObj.cost === 0 || tickerObj.amount === 0) {
    const foundDup = await Stock.findOne({userId: req.user._id, ticker: tickerObj.ticker, cost: 0, amount: 0});
    if (foundDup) {
      return res.status(400).send();
    }
  } else if (tickerObj.amount < 0) {
    // Check if the user's held amount + adding amount >= 0 (for selling record)
    let heldStocks = await Stock.aggregate([{
      $match: {
        userId: req.user._id.toString(),
        ticker: tickerObj.ticker
      }
    }, {
      $group: {
        _id: '$ticker',
        totalAmount: {$sum: '$amount'}
      }
    }]);
    heldStocks = heldStocks[0];
    if (!heldStocks || heldStocks.totalAmount + tickerObj.amount < 0) {
      return res.status(400).send();
    }
  }

  try {
    // Save tickerObj
    const transaction = await new Stock({
      userId: req.user._id,
      ticker: tickerObj.ticker,
      cost: tickerObj.cost,
      amount: tickerObj.amount
    });
    await transaction.save();

    // Update stock popularity
    let addingPop = 1;
    if (tickerObj.amount < 0) {
      addingPop = -1;
    }
    await Price.findOneAndUpdate({displaySymbol: tickerObj.ticker}, {$inc: {popularity: addingPop}});

    res.status(201).send(transaction);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/stocks/:ticker', auth, async (req, res) => {
  let heldStock = await Stock.aggregate([
    {
      $match: {
        userId: req.user._id.toString(),
        ticker: req.params.ticker
      }
    },
    {
      $group: {
        _id: '$ticker',
        totalAmount: {$sum: '$amount'}
      }
    }
  ])
  heldStock = heldStock[0];

  // Check if the ticker is in user's watchlist
  if (!heldStock) {
    return res.status(404).send();
  }

  // Check if the held amount is greater than 0
  if (heldStock.totalAmount > 0) {
    return res.status(400).send();
  }

  // Delete held stock
  try {
    const deleted = await Stock.deleteMany({
      userId: req.user._id,
      ticker: req.params.ticker
    });
  
    res.send(deleted);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;