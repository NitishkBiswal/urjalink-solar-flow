// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
// Replace with your MongoDB connection string if it's different
const dbURI = 'mongodb://localhost:27017/urjalink';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// --- API Routes ---
const authRoutes = require('./routes/auth');
const energyRoutes = require('./routes/energy');
const transactionRoutes = require('./routes/transactions');

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/transactions', transactionRoutes);


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));