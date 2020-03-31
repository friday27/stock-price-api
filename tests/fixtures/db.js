const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Stock = require('../../src/models/stock');
const Forex = require('../../src/models/forex');

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1Id,
  name: 'missallsunday',
  password: 'iknowyoursecrets',
  email: 'escape@onepiece.com',
  public: true,
  finnhubToken: process.env.FINNHUB_TOKEN,
  jsonWebTokens: [{
    jsonWebToken: jwt.sign({_id: user1Id}, process.env.JWT_SECRET)
  }]
};

const user1_stock1 = {
  userId: user1Id,
  ticker: 'GOOG',
  cost: 1000,
  amount: 10
};

const user1_stock2 = {
  userId: user1Id,
  ticker: 'PBD',
  cost: 11,
  amount: 5
};

const user1_stock3 = {
  userId: user1Id,
  ticker: 'NFLX',
  cost: 350,
  amount: 20
};

const user1_forex1 = {
  userId: user1Id,
  symbol: 'OANDA:GBP_USD',
  cost: 0.80,
  amount: 10000
};

const user1_forex2 = {
  userId: user1Id,
  symbol: 'FXCM:USD/HKD',
  cost: 7.75,
  amount: 50000
};

// const user2Id = new mongoose.Types.ObjectId();
// const user2 = {
//   _id: user2Id,
//   name: 'wednesday',
//   password: 'drawwithcolors',
//   email: 'drawtothedayidie@bbq.com',
//   public: false,
//   finnhubToken: process.env.FINNHUB_TOKEN2,
//   jsonWebTokens: [{
//     jsonWebToken: jwt.sign({_id: user2Id}, process.env.JWT_SECRET)
//   }]
// };

// const user2_stock1 = {
//   userId: user2Id,
//   ticker: 'NFLX',
//   cost: 350,
//   amount: 2000
// };

// const user2_forex1 = {
//   userId: user1Id,
//   symbol: 'OANDA:GBP_USD',
//   cost: 0.80,
//   amount: 1000
// };

// const user2_forex2 = {
//   userId: user1Id,
//   symbol: 'FXCM:USD/HKD',
//   cost: 7.75,
//   amount: 5000
// };

// const user2_forex3 = {
//   userId: user1Id,
//   symbol: 'FXPIG:9',
//   cost: 0.89,
//   amount: 2500
// };

// const user2_forex4 = {
//   userId: user1Id,
//   symbol: 'FOREX:401484403',
//   cost: 5.45,
//   amount: 12500
// };

// const user2_forex5 = {
//   userId: user1Id,
//   symbol: 'PEPPERSTONE:60',
//   cost: 7.75,
//   amount: 6000
// };


const setupDatabase = async function() {
  await User.deleteMany();
  await Stock.deleteMany();
  await Forex.deleteMany();
  
  await new User(user1).save();
  await new Stock(user1_stock1).save();
  await new Stock(user1_stock2).save();
  await new Stock(user1_stock3).save();
  await new Forex(user1_forex1).save();
  await new Forex(user1_forex2).save();

  // await new User(user2).save();
  // await new Stock(user2_stock1).save();
  // await new Forex(user2_forex1).save();
  // await new Forex(user2_forex2).save();
  // await new Forex(user2_forex3).save();
  // await new Forex(user2_forex4).save();
  // await new Forex(user2_forex5).save();
};

module.exports = {
  user1,
  // user2,
  setupDatabase
};