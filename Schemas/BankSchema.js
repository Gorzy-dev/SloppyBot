const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
  botID: {
    type: String,
    required: true,
  },
  totalCoins: {
    type: Number, // Change the type to number
    required: true,
  },
});

module.exports = mongoose.model('Bank', bankSchema);