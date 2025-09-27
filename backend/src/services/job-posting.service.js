const { AppDataSource } = require("../config/database");
const { TABLE_JOB_POSTINGS } = require("../models/job-posting.model");
const { ethers } = require('ethers');
const crypto = require('crypto');

function hashJobId(jobId) {
    return ethers.keccak256(ethers.toUtf8Bytes(jobId));
}

async function createJobPosting(jobData, hmWalletAddress) {
    const jobId = crypto.randomUUID();
    const jobIdHash = hashJobId(jobId);

    const insertQuery = `
        INSERT INTO ${TABLE_JOB_POSTINGS} 
        (job_id, job_id_hash, title, description, hm_wallet_address)
        VALUES (?, ?, ?, ?, ?)
    `;

    await AppDataSource.query(insertQuery, [
        jobId,
        jobIdHash,
        jobData.title,
        jobData.description || "No description provided.",
        hmWalletAddress
    ]);

    return {
        job_id: jobId,
        job_id_hash: jobIdHash,
        title: jobData.title,
        description: jobData.description,
        hm_wallet_address: hmWalletAddress
    };
}

async function getJobPostingById(jobId) {
    const query = `
        SELECT job_id, job_id_hash, title, description, hm_wallet_address
        FROM ${TABLE_JOB_POSTINGS} 
        WHERE job_id = ?
    `;
    const jobs = await AppDataSource.query(query, [jobId]);
    return jobs[0] || null;
}


async function getAllJobPostings() {
    const query = `
        SELECT job_id, job_id_hash, title, hm_wallet_address
        FROM ${TABLE_JOB_POSTINGS} 
        ORDER BY job_id DESC
    `;
    return AppDataSource.query(query);
}

module.exports = {
    createJobPosting,
    getJobPostingById,
    getAllJobPostings,
    hashJobId
};
