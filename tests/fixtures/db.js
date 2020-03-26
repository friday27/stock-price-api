const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const user1ID = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1ID,
  name: 'saturday',
  password: 'wooohooo',
  email: 'everyonelovesme@yahoo.com.tw',
  public: true,
  finnhubToken: 'invalid',
  tokens: [{
    token: jwt.sign({_id: user1ID}, process.env.JWT_SECRET)
  }]
};

const user2ID = new mongoose.Types.ObjectId();
const user2 = {
  _id: user2ID,
  name: 'tuesday',
  password: 'ignoremehuh',
  email: 'timetogo@weeks.com',
  public: false,
  finnhubToken: 'alsoinvalid',
  tokens: [{
    token: jwt.sign({_id: user2ID}, process.env.JWT_SECRET)
  }]
};

const setupDatabase = async function() {
  await User.deleteMany();
  await new User(user1).save();
  await new User(user2).save();
};

module.exports = {
  user1,
  user2,
  setupDatabase
};