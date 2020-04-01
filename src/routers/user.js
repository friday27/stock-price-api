const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const User = require('../models/user');

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.name, req.body.password);
    const token = await user.generateAuthToken();
    await user.save();
    res.send({user, token});
  } catch (e) {
    res.status(400).send();
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.jsonWebTokens = await req.user.jsonWebTokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users', async (req, res) => {
  const user = await new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users', auth, async (req, res) => {
  res.send(req.user);
});

router.patch('/users', auth, async (req, res) => {
  // Check if every patched data is allowed to be patched.
  const updates = Object.keys(req.body);
  const allowedToBeUpdated = ['email', 'password', 'finnhubToken', 'public'];
  const isValidOperation = updates.every((update) => allowedToBeUpdated.includes(update));

  if (!isValidOperation) {
    res.status(400).send({error: `Cannot update user.`});
  }

  try {
    await updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/users', auth, async (req, res) => {
  try {
    await User.deleteOne({_id: req.user._id});
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;