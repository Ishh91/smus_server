const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { authMiddleware } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');
const volunteersRoutes = require('./routes/volunteers');
const donationsRoutes = require('./routes/donations');
const galleryRoutes = require('./routes/gallery');
const programsRoutes = require('./routes/programs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/programs', programsRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
