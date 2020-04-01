const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const Stock = require('../models/stock');
const Price = require('../models/price');

router.get('/stocks', auth, async (req, res) => {
  if (req.query.ticker) {
    const ticker = await req.query.ticker;
    try {
      const stock = await Price.find({displaySymbol: ticker});
      if (!stock) {
        res.status(404).send();
      }
      res.send(stock);
    } catch (e) {
      res.status(400).send();
    }
  } else {
    const stocks = await Stock.find({userId: req.user._id});
    res.send(stocks);
  }
});

module.exports = router;