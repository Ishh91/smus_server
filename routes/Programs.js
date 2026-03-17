const express = require('express');
const multer = require('multer');
const Program = require('../models/Program');
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
    const list = await Program.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
    res.json(toResponse(list));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.highlights && typeof body.highlights === 'string') {
      body.highlights = JSON.parse(body.highlights);
    }

    if (req.file) {
      const fileName = `programs/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      const { data, error } = await supabase.storage
        .from('gallery') // Reuse gallery bucket or create 'programs'
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      body.image_url = publicUrl;
      body.storage_path = fileName;
    }

    const doc = await Program.create(body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.highlights && typeof body.highlights === 'string') {
      body.highlights = JSON.parse(body.highlights);
    }

    if (req.file) {
      const fileName = `programs/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      body.image_url = publicUrl;
      body.storage_path = fileName;
    }

    const doc = await Program.findByIdAndUpdate(req.params.id, body, { new: true });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Program.findById(req.params.id);
    if (doc && doc.storage_path) {
      await supabase.storage.from('gallery').remove([doc.storage_path]);
    }
    await Program.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;