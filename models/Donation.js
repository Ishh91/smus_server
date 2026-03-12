const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor_name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  transaction_id: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
