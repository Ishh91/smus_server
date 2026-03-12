require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin';

if (!email || !password) {
  console.log('Usage: node create-admin.js <email> <password> [name]');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const admin = new Admin({ email, password, name });
      await admin.save();
      console.log(`✅ Admin created successfully: ${email}`);
    } catch (err) {
      console.error('❌ Error creating admin:', err.message);
    } finally {
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });