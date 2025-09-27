import { Entity, Type } from '@graphprotocol/hypergraph';

// Mirror the schema from linked-dao/src/schema.ts for the bridge

// User entity - represents verified users in the trust network
export class User extends Entity.Class<User>('User')({
  address: Type.String,                    // Ethereum address
  verified: Type.Boolean,                  // Self Protocol verification status
  isReviewer: Type.Boolean,               // Whether user is approved reviewer
  approvedAt: Type.optional(Type.Number), // Timestamp when approved as reviewer
  totalRatingsGiven: Type.Number,         // Number of ratings given
  totalRatingsReceived: Type.Number,      // Number of ratings received
  averageRating: Type.Number,             // Average rating received
  totalCreditsSpent: Type.Number,         // Total credits spent on sponsorships
  joinedAt: Type.Number,                  // When user first appeared
  lastActivity: Type.Number,              // Last activity timestamp
}) {}

// Skill entity - represents skills that can be rated
export class Skill extends Entity.Class<Skill>('Skill')({
  skillHash: Type.String,                 // bytes32 skill hash from contract
  name: Type.optional(Type.String),       // Human readable skill name (derived)
  totalRatings: Type.Number,              // Total number of ratings for this skill
  averageRating: Type.Number,             // Average rating for this skill
  firstRatedAt: Type.Number,              // When this skill was first rated
  lastRatedAt: Type.Number,               // Most recent rating timestamp
}) {}

// Job entity - represents job opportunities
export class Job extends Entity.Class<Job>('Job')({
  jobIdHash: Type.String,                 // bytes32 job ID hash from contract
  description: Type.optional(Type.String), // Job description (if available)
  totalCreditsSpent: Type.Number,         // Total credits spent on this job
  totalSponsorships: Type.Number,         // Number of sponsorships
  firstSponsoredAt: Type.Number,          // When first sponsorship occurred
  lastSponsoredAt: Type.Number,           // Most recent sponsorship
}) {}

// Rating entity - represents skill ratings between users
export class Rating extends Entity.Class<Rating>('Rating')({
  reviewer: Type.Relation(User),          // User who gave the rating
  junior: Type.Relation(User),            // User who received the rating
  skill: Type.Relation(Skill),            // Skill being rated
  overallRating: Type.Number,             // Rating value (1-10)
  timestamp: Type.Number,                 // Block timestamp
  transactionHash: Type.String,           // Transaction hash
  blockNumber: Type.Number,               // Block number
}) {}

// Sponsorship entity - represents credit spending on candidates
export class Sponsorship extends Entity.Class<Sponsorship>('Sponsorship')({
  sponsor: Type.Relation(User),           // User spending credits
  candidate: Type.Relation(User),         // User being sponsored
  job: Type.Relation(Job),                // Job being sponsored for
  creditsUsed: Type.Number,               // Amount of credits spent
  timestamp: Type.Number,                 // Block timestamp
  transactionHash: Type.String,           // Transaction hash
  blockNumber: Type.Number,               // Block number
}) {}

// HiringOutcome entity - represents hiring decisions
export class HiringOutcome extends Entity.Class<HiringOutcome>('HiringOutcome')({
  candidate: Type.Relation(User),         // User who was evaluated
  isHired: Type.Boolean,                  // Whether candidate was hired
  timestamp: Type.Number,                 // Block timestamp (from event)
  transactionHash: Type.String,           // Transaction hash
  blockNumber: Type.Number,               // Block number
}) {}