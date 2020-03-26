const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    require: true,
    unique: true,
    trim: true
  },
  followingIDs: [{
    followingID: {
      type: String,
      trim: true,
      unique: true
    }
  }]
});

const Following = mongoose.model('Following', followingSchema);

module.exports = Following;