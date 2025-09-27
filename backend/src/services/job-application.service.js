const { AppDataSource } = require("../config/database");
const { TABLE_JOB_APPLICATIONS, APPLICATION_STATUS } = require("../models/job-application.model");
const { TABLE_JOB_POSTINGS } = require("../models/job-posting.model");
const crypto = require('crypto');

// CREATE TABLE job_applications (
//     application_id varchar(244) PRIMARY KEY NOT NULL,
//     job_id varchar(244) NOT NULL,
//     candidate_wallet_address varchar(100) NOT NULL,
//     cover_letter TEXT,
//     status varchar(50) DEFAULT 'pending',
//     applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (job_id) REFERENCES job_postings(job_id),
//     UNIQUE KEY unique_application (job_id, candidate_wallet_address)
// );

async function applyForJob(jobId, candidateWalletAddress, coverLetter = "") {
    const jobQuery = `SELECT job_id FROM ${TABLE_JOB_POSTINGS} WHERE job_id = ?`;
    const jobs = await AppDataSource.query(jobQuery, [jobId]);

    if (jobs.length === 0) {
        throw new Error("Job posting not found");
    }

    const existingApplicationQuery = `
        SELECT application_id FROM ${TABLE_JOB_APPLICATIONS} 
        WHERE job_id = ? AND candidate_wallet_address = ?
    `;
    const existingApplications = await AppDataSource.query(existingApplicationQuery, [jobId, candidateWalletAddress]);

    if (existingApplications.length > 0) {
        throw new Error("You have already applied for this job");
    }

    const applicationId = crypto.randomUUID();

    const insertQuery = `
        INSERT INTO ${TABLE_JOB_APPLICATIONS} 
        (application_id, job_id, candidate_wallet_address, cover_letter, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    await AppDataSource.query(insertQuery, [
        applicationId,
        jobId,
        candidateWalletAddress,
        coverLetter,
        APPLICATION_STATUS.PENDING
    ]);

    return {
        application_id: applicationId,
        job_id: jobId,
        candidate_wallet_address: candidateWalletAddress,
        cover_letter: coverLetter,
        status: APPLICATION_STATUS.PENDING,
        applied_at: new Date()
    };
}

async function getAllApplicationsForJob(jobId, hmWalletAddress) {
    const jobQuery = `
        SELECT job_id FROM ${TABLE_JOB_POSTINGS} 
        WHERE job_id = ? AND hm_wallet_address = ?
    `;
    const jobs = await AppDataSource.query(jobQuery, [jobId, hmWalletAddress]);

    if (jobs.length === 0) {
        throw new Error("Job not found or you don't have permission to view applications");
    }

    const query = `
        SELECT 
            ja.application_id,
            ja.job_id,
            ja.candidate_wallet_address,
            ja.cover_letter,
            ja.status,
            ja.applied_at,
            ja.updated_at,
            jp.title as job_title
        FROM ${TABLE_JOB_APPLICATIONS} ja
        JOIN ${TABLE_JOB_POSTINGS} jp ON ja.job_id = jp.job_id
        WHERE ja.job_id = ?
        ORDER BY ja.applied_at DESC
    `;

    return AppDataSource.query(query, [jobId]);
}

async function getApplicationsByCandidate(candidateWalletAddress) {
    const query = `
        SELECT 
            ja.application_id,
            ja.job_id,
            ja.candidate_wallet_address,
            ja.cover_letter,
            ja.status,
            ja.applied_at,
            ja.updated_at,
            jp.title as job_title,
            jp.description as job_description,
            jp.hm_wallet_address
        FROM ${TABLE_JOB_APPLICATIONS} ja
        JOIN ${TABLE_JOB_POSTINGS} jp ON ja.job_id = jp.job_id
        WHERE ja.candidate_wallet_address = ?
        ORDER BY ja.applied_at DESC
    `;

    return AppDataSource.query(query, [candidateWalletAddress]);
}

async function getApplicationById(applicationId) {
    const query = `
        SELECT 
            ja.application_id,
            ja.job_id,
            ja.candidate_wallet_address,
            ja.cover_letter,
            ja.status,
            ja.applied_at,
            ja.updated_at,
            jp.title as job_title,
            jp.description as job_description,
            jp.hm_wallet_address
        FROM ${TABLE_JOB_APPLICATIONS} ja
        JOIN ${TABLE_JOB_POSTINGS} jp ON ja.job_id = jp.job_id
        WHERE ja.application_id = ?
    `;

    const applications = await AppDataSource.query(query, [applicationId]);
    return applications[0] || null;
}

async function updateApplicationStatus(applicationId, newStatus, hmWalletAddress) {
    const application = await getApplicationById(applicationId);

    if (!application) {
        throw new Error("Application not found");
    }

    if (application.hm_wallet_address !== hmWalletAddress) {
        throw new Error("You don't have permission to update this application");
    }

    const updateQuery = `
        UPDATE ${TABLE_JOB_APPLICATIONS} 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE application_id = ?
    `;

    await AppDataSource.query(updateQuery, [newStatus, applicationId]);

    return await getApplicationById(applicationId);
}

async function closeJobApplications(jobId, hmWalletAddress, hiringDecisions) {
    const jobQuery = `
        SELECT job_id FROM ${TABLE_JOB_POSTINGS} 
        WHERE job_id = ? AND hm_wallet_address = ?
    `;
    const jobs = await AppDataSource.query(jobQuery, [jobId, hmWalletAddress]);

    if (jobs.length === 0) {
        throw new Error("Job not found or you don't have permission to close applications");
    }

    const applicationsQuery = `
        SELECT application_id, candidate_wallet_address, status
        FROM ${TABLE_JOB_APPLICATIONS}
        WHERE job_id = ? AND status IN (?, ?)
    `;

    const applications = await AppDataSource.query(applicationsQuery, [
        jobId,
        APPLICATION_STATUS.PENDING,
        APPLICATION_STATUS.REVIEWED
    ]);

    const results = [];

    for (const application of applications) {
        const candidateAddress = application.candidate_wallet_address;
        const decision = hiringDecisions.find(d => d.candidateAddress === candidateAddress);

        let newStatus;
        let isHired = false;

        if (decision) {
            newStatus = decision.isHired ? APPLICATION_STATUS.HIRED : APPLICATION_STATUS.REJECTED;
            isHired = decision.isHired;
        } else {
            newStatus = APPLICATION_STATUS.REJECTED;
            isHired = false;
        }

        await updateApplicationStatus(application.application_id, newStatus, hmWalletAddress);

        results.push({
            applicationId: application.application_id,
            candidateAddress,
            status: newStatus,
            isHired,
            smartContractData: {
                candidate: candidateAddress,
                isHired
            }
        });
    }

    return {
        jobId,
        totalApplicationsProcessed: results.length,
        applications: results
    };
}

module.exports = {
    applyForJob,
    getAllApplicationsForJob,
    getApplicationsByCandidate,
    getApplicationById,
    updateApplicationStatus,
    closeJobApplications
};
