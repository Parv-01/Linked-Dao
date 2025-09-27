const express = require('express');
const router = express.Router();
const jobService = require('../services/job-posting.service');

const authenticateWeb3 = (req, res, next) => {
    req.user = { wallet_address: req.headers['x-wallet-address'] || '0xTestHiringManagerWalletAddress' };
    if (!req.user.wallet_address) {
        return res.status(401).send({ message: "Wallet authentication required." });
    }
    next();
};

router.post('/', authenticateWeb3, async (req, res) => {
    try {
        const hmWalletAddress = req.user.wallet_address;
        const jobData = req.body;

        if (!jobData.title) {
            return res.status(400).json({ message: "Job title is required." });
        }

        const newJob = await jobService.createJobPosting(jobData, hmWalletAddress);
        res.status(201).json(newJob);
    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ message: 'Failed to create job posting', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const jobs = await jobService.getAllJobPostings();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
    }
});

router.get('/:jobId', async (req, res) => {
    try {
        const job = await jobService.getJobPostingById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch job', error: error.message });
    }
});

module.exports = router;
