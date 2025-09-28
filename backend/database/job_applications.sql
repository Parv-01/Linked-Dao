
CREATE TABLE IF NOT EXISTS job_applications (
    application_id VARCHAR(244) PRIMARY KEY NOT NULL,
    job_id VARCHAR(244) NOT NULL,
    candidate_wallet_address VARCHAR(100) NOT NULL,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint (assumes job_postings table exists)
    CONSTRAINT fk_job_application_job_id 
        FOREIGN KEY (job_id) REFERENCES job_postings(job_id) 
        ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate applications
    CONSTRAINT unique_job_application 
        UNIQUE (job_id, candidate_wallet_address),
    
    -- Index for better query performance
    INDEX idx_candidate_applications (candidate_wallet_address),
    INDEX idx_job_applications (job_id),
    INDEX idx_application_status (status)
);

-- Insert sample data (optional - for testing)
-- Make sure to update the job_id and wallet addresses with real values from your system

-- INSERT INTO job_applications (
--     application_id, 
--     job_id, 
--     candidate_wallet_address, 
--     cover_letter, 
--     status
-- ) VALUES 
-- (
--     'app-001-uuid', 
--     'your-job-id-here', 
--     '0xCandidateWalletAddress1', 
--     'I am very interested in this position and believe my skills would be a great fit.', 
--     'pending'
-- ),
-- (
--     'app-002-uuid', 
--     'your-job-id-here', 
--     '0xCandidateWalletAddress2', 
--     'I have extensive experience in the required technologies.', 
--     'pending'
-- );
