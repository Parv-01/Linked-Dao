const { AppDataSource } = require("../config/database");
const { TABLE_USER_PROFILES } = require("../models/profile.model");

// CREATE TABLE user_profiles (id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, wallet_address varchar(100) NOT NULL, name varchar(244), bio varchar(244), is_seeking_review BOOLEAN)

async function findOrCreateProfile(walletAddress) {
    const findQuery = `
        SELECT wallet_address, name, bio, is_seeking_review 
        FROM ${TABLE_USER_PROFILES} 
        WHERE wallet_address = ?
    `;
    const profiles = await AppDataSource.query(findQuery, [walletAddress]);
    let profile = profiles[0];

    if (!profile) {
        const insertQuery = `
            INSERT INTO ${TABLE_USER_PROFILES} 
            (wallet_address, name, bio, is_seeking_review) 
            VALUES (?, ?, ?, ?)
        `;
        await AppDataSource.query(insertQuery, [
            walletAddress,
            '',
            '',
            false
        ]);

        const newProfile = await AppDataSource.query(findQuery, [walletAddress]);
        profile = newProfile[0];
    }

    return profile;
}

async function getReviewOptInList() {
    const query = `
        SELECT wallet_address, name, bio 
        FROM ${TABLE_USER_PROFILES} 
        WHERE is_seeking_review = ?
    `;
    return AppDataSource.query(query, [1]);
}

async function updateProfile(walletAddress, updateData) {
    const columns = [];
    const values = [];

    if (updateData.name !== undefined) {
        columns.push("name = ?");
        values.push(updateData.name);
    }
    if (updateData.bio !== undefined) {
        columns.push("bio = ?");
        values.push(updateData.bio);
    }
    if (updateData.is_seeking_review !== undefined) {
        columns.push("is_seeking_review = ?");
        values.push(updateData.is_seeking_review ? 1 : 0);
    }

    if (columns.length === 0) {
        return findOrCreateProfile(walletAddress);
    }

    values.push(walletAddress);

    const updateQuery = `
        UPDATE ${TABLE_USER_PROFILES} 
        SET ${columns.join(', ')} 
        WHERE wallet_address = ?
    `;

    await AppDataSource.query(updateQuery, values);

    return findOrCreateProfile(walletAddress);
}


module.exports = {
    findOrCreateProfile,
    getReviewOptInList,
    updateProfile,
};
