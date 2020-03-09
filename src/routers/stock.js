const express = require('express');
const router = new express.Router();
// const auth = require('../utils/auth');
const wtd = require('../utils/world-trading-data');
const User = require('../models/user');

router.post('/stock/:id/add/:ticker', async (req, res) => {
  console.log(req.params);
  const user = await findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }

  user.favoriteTickers = user.favoriteTickers.concat({ticker: req.params.ticker});
  await user.save();
  res.status(201).send();
});

router.get('/stock/:id/fav', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }

  const favoriteTickers = user.favoriteTickers;
  console.log(favoriteTickers);
  if (favoriteTickers.length === 0) {
    return res.status(204).send({error: 'No ticker in your favorite list.'});
  }
});

module.exports = router;