const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const {updateStockPrice, updateFxPrice, getTickerInfo, getExchangeInfo} = require('../utils/get-latest-price');
const Forex = require('../models/forex');
const Price = require('../models/price');

router.get('/fx/:exchange', auth, async (req, res) => {
  if (!req.params.exchange) {
    res.status(400).send();
  }

  // Check if the input exchange is supported.
  const exchanges = ['oanda', 'fxcm', 'forex.com', 'ic markets', 'fxpro'];
  const exchange = req.params.exchange.toLowerCase();
  if (!exchanges.includes(exchange)) {
    res.status(404).send();
  }
  
  await getExchangeInfo(req.user.finnhubToken, exchange, (err, result) => {
    if (err) {
      res.status(400).send();
    }
    res.send(result);
  });
});

router.get('/fx', auth, async (req, res) => {
  // Show return(%), profit and all fx listed in the user's watchlist
  const fx = await Forex.aggregate([
  // Find fx transactions with userId
    {$match: {
      userId: req.user._id.toString()
    }},
    // Populate price info from prices collections
    {$lookup: {
      from: 'prices',
      localField: 'symbol',
      foreignField: 'symbol',
      as: 'priceInfo',
    }},
    // adjust output format
    {$project: {
      _id: 0,
      symbol: 1,
      priceInfo: {
        exchange: 1,
        displaySymbol: 1,
        description: 1,
        price: 1,
        popularity: 1,
        updatedAt: 1
      }
    }}
  ]);
  
  await fx.forEach(async (fxObj) => {
    // If the price is updated 5 minutes age, request and save the latest price.
    const minutes = await Math.floor(Math.abs(new Date() - fxObj.priceInfo[0].updatedAt)/60000);
    if (minutes >= 0) {
      await updateFxPrice(req.user.finnhubToken, fxObj.symbol, async (err) => {
        if (err) {
          console.log(err);
        }
      });
      const newData = await Price.findOne({symbol: fxObj.symbol});
      fxObj.price = newData.price;
      fxObj.updatedAt = newData.updatedAt;
    }
  });
  res.send(fx);
});

// Add fx symbol into the user's watchlish
router.post('/fx/:symbol', auth, async (req, res) => {
  const symbol = await req.params.symbol;
  if (!symbol) {
    res.status(400).send();
  }

  // Check if the ticker is supported
  const isSupported = await Price.findOne({symbol});
  if (!isSupported) {
    res.status(404).send();
  }

  // Check if it's saved already
  const foundDup = await Forex.findOne({userId: req.user._id, symbol});
  if (foundDup) {
    res.status(400).send();
  }

  try {
    // Save fxObj
    const transaction = await new Forex({
      userId: req.user._id,
      symbol,
    });
    await transaction.save();

    // Update popularity
    await Price.findOneAndUpdate({symbol}, {$inc: {popularity: 1}});

    res.status(201).send(transaction);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/fx/:symbol', auth, async (req, res) => {
  let savedFx = await Forex.aggregate([
    {
      $match: {
        userId: req.user._id.toString(),
        symbol: req.params.symbol
      }
    },
  ])
  savedFx = savedFx[0];

  // Check if the symbol is in user's watchlist
  if (!savedFx) {
    return res.status(404).send();
  }

  // Delete saved fx
  try {
    const deleted = await Forex.deleteOne({
      userId: req.user._id,
      symbol: req.params.symbol
    });
  
    res.send(deleted);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;