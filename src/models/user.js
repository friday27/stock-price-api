const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isValidFinnhubToken = require('../utils/token-validator');
const Stock = require('./stock');
const Forex = require('./forex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email address is invalid.');
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  finnhubToken: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate(value) {
      isValidFinnhubToken(value, (err) => {
        if (err) {
          throw new Error(`${value} is not a valid Finnhub API Token. Please try again.`);
        }
      });
    }
  },
  public: {
    type: Boolean,
    default: false
  },
  jsonWebTokens: [{
    jsonWebToken: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

userSchema.statics.findByCredentials = async function (name, password) {
  const user = await User.findOne({name});
  if (!user) {
    throw new Error('Unable to login.');
  }
  const isMatch = await bcrypt.compare(password, user.password); //(plain, hashed)
  if (!isMatch) {
    throw new Error('Unable to login.');
  }
  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
  user.jsonWebTokens = user.jsonWebTokens.concat({jsonWebToken: token});
  await user.save();
  return token;
};

// Overwrite toJSON() to remove private data
userSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.jsonWebTokens;

  return userObj;
};

// Bcrypt password before saving
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre('remove', async function(next) {
  const user = this;
  await Stock.deleteMany({userId: user._id});
  await Forex.deleteMany({userId: user._id});
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;