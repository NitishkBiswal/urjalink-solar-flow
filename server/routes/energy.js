const express = require('express');
const EnergyListing = require('../models/EnergyListing');
const router = express.Router();

// Route to list new energy
router.post('/list', async (req, res) => {
  try {
    const { energyUnits, pricePerUnit, sellerId } = req.body;
    const newListing = new EnergyListing({ energyUnits, pricePerUnit, sellerId });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ message: 'Error creating listing' });
  }
});

router.get('/listings', async (req, res) => {
    try {
        // Only find listings that are still 'open' for sale
        const listings = await EnergyListing.find({ status: 'open' })
            .populate('sellerId', 'name walletAddress');
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listings' });
    }
});

module.exports = router;
