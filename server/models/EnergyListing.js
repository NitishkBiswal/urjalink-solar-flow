// server/models/EnergyListing.js
const mongoose = require('mongoose');

const EnergyListingSchema = new mongoose.Schema({
  energyUnits: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'open' }, // <-- Add this line
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EnergyListing', EnergyListingSchema);