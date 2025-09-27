const express = require('express');
const router = express.Router();
const profileService = require('../services/profile.service');

const authenticateWeb3 = (req, res, next) => {
    req.user = { wallet_address: req.headers['x-wallet-address'] || '0xTestReviewerWalletAddress' };
    if (!req.user.wallet_address) {
        return res.status(401).send({ message: "Wallet authentication required." });
    }
    next();
};

router.get('/me', authenticateWeb3, async (req, res) => {
    try {
        const profile = await profileService.findOrCreateProfile(req.user.wallet_address);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
});

router.put('/me', authenticateWeb3, async (req, res) => {
    try {
        const updatedProfile = await profileService.updateProfile(req.user.wallet_address, req.body);
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
});

router.get('/review-list', async (req, res) => {
    try {
        const profiles = await profileService.getReviewOptInList();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch review list', error: error.message });
    }
});

module.exports = router;
