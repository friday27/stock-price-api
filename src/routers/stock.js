const express = require('express');
const router = new express.Router();
// const auth = require('../utils/auth');
const wtd = require('../utils/world-trading-data');
const User = require('../models/user');

router.get('/stock/:id/fav', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }

  const favoriteTickers = user.favoriteTickers;
  if (favoriteTickers.length === 0) {
    return res.status(204).send({error: 'No ticker in your favorite list.'});
  }
  res.send(favoriteTickers);
});

router.get('/stock/:id/add/:ticker', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }
  const matchedTicker = await user.getMatchedTicker(req.params.ticker);
  if (matchedTicker.length === 0) {
    user.favoriteTickers = await user.favoriteTickers.concat({ticker: req.params.ticker});
    await user.save();
    res.status(201);
  }  
  res.send(user);
});

router.get('/stock/:id/delete/:ticker', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }
  const matchedTicker = await user.getMatchedTicker(req.params.ticker);
  if (matchedTicker.length > 0) {
    user.favoriteTickers = await user.favoriteTickers.filter((tickerObj) => tickerObj.ticker !== req.params.ticker);
    await user.save();
  }  
  res.send(user);
})

module.exports = router;