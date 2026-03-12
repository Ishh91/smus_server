const express = require('express');
const multer = require('multer');
const GalleryImage = require('../models/GalleryImage');
const { authMiddleware } = require('../middleware/auth');
const { supabase } = require('../lib/supabase');
const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 } 
});

function toResponse(list) {
  return list.map(({ _id, createdAt, ...r }) => ({ ...r, id: _id.toString(), created_at: createdAt }));
}

router.get('/', async (req, res) => {
  try {
    const list = await GalleryImage.find().sort({ createdAt: -1 }).lean();
    res.json(toResponse(list));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file' });

    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    const doc = await GalleryImage.create({
      title: req.body.title || 'Untitled',
      description: req.body.description || null,
      image_url: publicUrl,
      storage_path: fileName,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await GalleryImage.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    
    if (doc.storage_path) {
      await supabase.storage.from('gallery').remove([doc.storage_path]);
    }
    
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
