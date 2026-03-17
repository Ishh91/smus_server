const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, default: 'BookOpen' }, // Lucide icon name
  image_url: { type: String },
  storage_path: { type: String },
  highlights: [{ type: String }],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);