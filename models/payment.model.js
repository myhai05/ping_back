const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
