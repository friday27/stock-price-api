const express = require('express');
const router = new express.Router();
const User = require('../models/user');
// const auth = require('../utils/auth');

router.post('/user', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateJWTAuthToken();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.name, req.body.password);
    const token = await user.generateJWTAuthToken();
    await user.save();
    res.send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/logout', async (req, res) => {
  try {
      req.user.jwtTokens = req.user.jwtTokens.filter((token) => token.token !== req.token);
      await req.user.save();
      res.send();
  } catch (e) {
      res.status(500).send(e);
  }
});

router.post('/users/logoutAll', async (req, res) => {
  try {
      req.user.tokens = [];
      await req.user.save();
      res.send();
  } catch (e) {
      res.status(500).send(e);
  }
});

module.exports = router;