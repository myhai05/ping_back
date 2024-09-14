const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  validityMonths: {
    type: Number,
    required: true,
  }
});

const OfferModel = mongoose.model('offers', OfferSchema);

module.exports = OfferModel;