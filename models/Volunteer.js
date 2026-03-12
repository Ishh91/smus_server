const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  skills: String,
  availability: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
