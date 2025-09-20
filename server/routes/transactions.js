// server/routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const EnergyListing = require('../models/EnergyListing');

// Route to "buy" energy
router.post('/buy', async (req, res) => {
    const { listingId, buyerId } = req.body;
    try {
        const listing = await EnergyListing.findById(listingId);
        if (!listing || listing.status === 'sold') {
            return res.status(404).json({ message: 'Listing not available.' });
        }
        listing.status = 'sold';
        await listing.save();
        const newTransaction = new Transaction({
            listingId: listing._id,
            sellerId: listing.sellerId,
            buyerId: buyerId,
            energyUnits: listing.energyUnits,
            pricePerUnit: listing.pricePerUnit,
            totalAmount: listing.energyUnits * listing.pricePerUnit,
        });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Server error during purchase.' });
    }
});

// Route to get a user's transaction history
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({
            $or: [{ buyerId: userId }, { sellerId: userId }]
        })
        .populate('sellerId', 'name')
        .populate('buyerId', 'name')
        .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction history.' });
    }
});

module.exports = router;