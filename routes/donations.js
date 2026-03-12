const express = require('express');
const multer = require('multer');
const Donation = require('../models/Donation');
const { authMiddleware } = require('../middleware/auth');
const { supabase } = require('../lib/supabase');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function toResponse(list) {
  return list.map(({ _id, createdAt, ...r }) => ({ ...r, id: _id.toString(), created_at: createdAt }));
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const list = await Donation.find().sort({ createdAt: -1 }).lean();
    res.json(toResponse(list));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.amount != null) body.amount = Number(body.amount);
    const doc = await Donation.create(body);

    if (req.file) {
      const fileName = `receipts/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      
      const { data, error } = await supabase.storage
        .from('donations')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('donations')
          .getPublicUrl(fileName);
        
        doc.message = (doc.message || '') + (doc.message ? '\n' : '') + `Receipt: ${publicUrl}`;
        await doc.save();
      }
    }
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
