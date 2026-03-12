const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ error: 'Admin not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in server .env' });
  }
  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { email: adminEmail },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { email: adminEmail } });
  }
  res.status(401).json({ error: 'Invalid email or password' });
});

module.exports = router;
