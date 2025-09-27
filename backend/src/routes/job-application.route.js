const express = require('express');
const router = express.Router();
const jobApplicationService = require('../services/job-application.service');
const smartContractService = require('../services/smart-contract.service');
const { APPLICATION_STATUS } = require('../models/job-application.model');

// Middleware for wallet authentication
const authenticateWeb3 = (req, res, next) => {
    req.user = { wallet_address: req.headers['x-wallet-address'] };
    if (!req.user.wallet_address) {
        return res.status(401).json({
            success: false,
            message: "Wallet authentication required. Please provide x-wallet-address header."
        });
    }
    next();
};

// POST /job-applications/apply - Apply for a job
router.post('/apply', authenticateWeb3, async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;
        const candidateWalletAddress = req.user.wallet_address;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        const application = await jobApplicationService.applyForJob(
            jobId,
            candidateWalletAddress,
            coverLetter
        );

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(400).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /job-applications/my-applications - Get all applications by current user
router.get('/my-applications', authenticateWeb3, async (req, res) => {
    try {
        const candidateWalletAddress = req.user.wallet_address;
        const applications = await jobApplicationService.getApplicationsByCandidate(candidateWalletAddress);

        res.json({
            success: true,
            message: "Applications retrieved successfully",
            data: {
                total: applications.length,
                applications
            }
        });
    } catch (error) {
        console.error("Error fetching user applications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /job-applications/job/:jobId - Get all applications for a specific job (for hiring managers)
router.get('/job/:jobId', authenticateWeb3, async (req, res) => {
    try {
        const { jobId } = req.params;
        const hmWalletAddress = req.user.wallet_address;

        const applications = await jobApplicationService.getAllApplicationsForJob(jobId, hmWalletAddress);

        res.json({
            success: true,
            message: "Job applications retrieved successfully",
            data: {
                jobId,
                total: applications.length,
                applications
            }
        });
    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(403).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /job-applications/:applicationId - Get specific application details
router.get('/:applicationId', authenticateWeb3, async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userWalletAddress = req.user.wallet_address;

        const application = await jobApplicationService.getApplicationById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Check if user has permission to view this application
        if (application.candidate_wallet_address !== userWalletAddress &&
            application.hm_wallet_address !== userWalletAddress) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this application"
            });
        }

        res.json({
            success: true,
            message: "Application retrieved successfully",
            data: application
        });
    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch application",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// PUT /job-applications/:applicationId/status - Update application status (for hiring managers)
router.put('/:applicationId/status', authenticateWeb3, async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const hmWalletAddress = req.user.wallet_address;

        if (!status || !Object.values(APPLICATION_STATUS).includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`
            });
        }

        const updatedApplication = await jobApplicationService.updateApplicationStatus(
            applicationId,
            status,
            hmWalletAddress
        );

        res.json({
            success: true,
            message: "Application status updated successfully",
            data: updatedApplication
        });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(403).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// POST /job-applications/close-job/:jobId - Close all applications for a job and record outcomes on blockchain
router.post('/close-job/:jobId', authenticateWeb3, async (req, res) => {
    try {
        const { jobId } = req.params;
        const { hiringDecisions } = req.body;
        const hmWalletAddress = req.user.wallet_address;

        if (!Array.isArray(hiringDecisions)) {
            return res.status(400).json({
                success: false,
                message: "hiringDecisions must be an array of objects with candidateAddress and isHired properties"
            });
        }

        // Validate hiring decisions format
        for (const decision of hiringDecisions) {
            if (!decision.candidateAddress || typeof decision.isHired !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: "Each hiring decision must have candidateAddress (string) and isHired (boolean)"
                });
            }
        }

        // Close applications and update statuses
        const closeResult = await jobApplicationService.closeJobApplications(
            jobId,
            hmWalletAddress,
            hiringDecisions
        );

        // Record outcomes on blockchain
        const smartContractData = closeResult.applications.map(app => ({
            candidateAddress: app.candidateAddress,
            isHired: app.isHired
        }));

        let blockchainResults = [];
        try {
            blockchainResults = await smartContractService.recordMultipleHiringOutcomes(smartContractData);
        } catch (blockchainError) {
            console.error("Blockchain recording failed:", blockchainError);
            // Continue with response even if blockchain fails - applications are already updated
        }

        res.json({
            success: true,
            message: "Job applications closed successfully",
            data: {
                ...closeResult,
                blockchainResults: blockchainResults.length > 0 ? blockchainResults : "Blockchain recording failed or not configured"
            }
        });
    } catch (error) {
        console.error("Error closing job applications:", error);
        res.status(403).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /job-applications/contract/info - Get smart contract information
router.get('/contract/info', async (req, res) => {
    try {
        const contractInfo = await smartContractService.getContractInfo();
        res.json({
            success: true,
            message: "Contract information retrieved successfully",
            data: contractInfo
        });
    } catch (error) {
        console.error("Error getting contract info:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get contract information",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
