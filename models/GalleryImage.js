const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image_url: { type: String, required: true },
  storage_path: String,
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
