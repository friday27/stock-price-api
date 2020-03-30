const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const isValidFinnhubToken = require('../utils/token-validator');

const userSchema = new mongoose.Schema({
  username: {
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
    validator(value) {
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
    required: true,
    trim: true,
    unique: true,
    validator(value) {
      if (!isValidFinnhubToken(value)) {
        throw new Error('It is not a valid Finnhub API Token. Please try again.');
      }
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
});

// Overwrite toJSON() to remove private data
userSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.jsonWebTokens;

  return userObj;
};

// Bcrypt password before saving
userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;