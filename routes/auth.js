const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    
    // 1. Check database for admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        const token = jwt.sign(
          { id: admin._id, email: admin.email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({ token, user: { email: admin.email, name: admin.name } });
      }
    }

    // 2. Fallback to environment variables (Legacy support)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { email: adminEmail },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({ token, user: { email: adminEmail } });
    }

    res.status(401).json({ error: 'Invalid email or password' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
