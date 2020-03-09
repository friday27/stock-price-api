const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please enter a valid email.');
      }
    }
  },
  worldtradingdataToken: {
    type: String,
    require: true,
    validate(value) {

    }
  },
  jwtTokens: [{
    token: {
      type: String,
      require: true
    }
  }],
  favoriteTickers: [{
    ticker: {
      type: String,
      uppercase: true,
      trim: true,
      validate(value) {

      }
    }
  }]
}, {
  timestamps: true
});

// overwrite toJSON instance method to hide private info
userSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.email;
  delete userObj.worldtradingdataToken;
  delete userObj.jwtTokens;

  return userObj;
};

userSchema.methods.generateJWTAuthToken = async function() {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, 'friday27stockpriceapitw');
  user.jwtTokens = user.jwtTokens.concat({token});
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (name, password) => {
  const user = await User.findOne({name});
  if (!user) {
    throw new Error('Unable to login.');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login.');
  }
  return user;
};

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;