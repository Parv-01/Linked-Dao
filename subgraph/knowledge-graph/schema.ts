import { Entity, Type } from '@graphprotocol/hypergraph';

// Define Knowledge Graph entities for OnchainTrustNetwork using GRC-20

export class User extends Entity.Class<User>('User')({
  address: Type.String,
  verified: Type.Boolean,
  isReviewer: Type.Boolean,
  approvedAt: Type.optional(Type.Number),
  totalRatingsGiven: Type.Number,
  totalRatingsReceived: Type.Number,
  averageRating: Type.Number,
  totalCreditsSpent: Type.Number,
  joinedAt: Type.Number,
  lastActivity: Type.Number,

  // Relations to other entities
  ratingsGiven: Type.Relation(Rating),
  ratingsReceived: Type.Relation(Rating),
  sponsorships: Type.Relation(Sponsorship),
  hiringOutcomes: Type.Relation(HiringOutcome)
}) {}

export class Skill extends Entity.Class<Skill>('Skill')({
  hash: Type.String,
  name: Type.optional(Type.String),
  averageRating: Type.Number,
  totalRatings: Type.Number,
  createdAt: Type.Number,

  // Relations
  ratings: Type.Relation(Rating)
}) {}

export class Job extends Entity.Class<Job>('Job')({
  hash: Type.String,
  description: Type.optional(Type.String),
  totalCreditsSpent: Type.Number,
  totalSponsorships: Type.Number,
  createdAt: Type.Number,

  // Relations
  sponsorships: Type.Relation(Sponsorship)
}) {}

export class Rating extends Entity.Class<Rating>('Rating')({
  overallRating: Type.Number,
  timestamp: Type.Number,
  transactionHash: Type.String,
  blockNumber: Type.Number,

  // Relations
  reviewer: Type.Relation(User),
  ratee: Type.Relation(User),
  skill: Type.Relation(Skill)
}) {}

export class Sponsorship extends Entity.Class<Sponsorship>('Sponsorship')({
  creditsUsed: Type.Number,
  timestamp: Type.Number,
  transactionHash: Type.String,
  blockNumber: Type.Number,

  // Relations
  sponsor: Type.Relation(User),
  candidate: Type.Relation(User),
  job: Type.Relation(Job)
}) {}

export class HiringOutcome extends Entity.Class<HiringOutcome>('HiringOutcome')({
  isHired: Type.Boolean,
  timestamp: Type.Number,
  transactionHash: Type.String,
  blockNumber: Type.Number,

  // Relations
  candidate: Type.Relation(User)
}) {}