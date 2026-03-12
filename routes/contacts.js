const express = require('express');
const Contact = require('../models/Contact');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

function toResponse(list) {
  return list.map(({ _id, createdAt, ...r }) => ({ ...r, id: _id.toString(), created_at: createdAt }));
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(toResponse(list));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const doc = await Contact.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
