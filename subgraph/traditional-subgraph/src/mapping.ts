import {
  ReviewerApproved,
  SkillRated,
  CreditsSpent,
  HiringOutcome
} from "../generated/OnchainTrustNetwork/OnchainTrustNetwork";

import {
  User,
  Reviewer,
  Rating,
  Skill,
  Job,
  Sponsorship,
  HiringOutcome as HiringOutcomeEntity
} from "../generated/schema";

import { BigInt, Bytes, crypto } from "@graphprotocol/graph-ts";

// Helper functions
function getOrCreateUser(address: Bytes): User {
  let user = User.load(address.toHexString());
  if (user == null) {
    user = new User(address.toHexString());
    user.address = address;
    user.verified = false;
    user.isReviewer = false;
    user.totalRatingsGiven = BigInt.fromI32(0);
    user.totalRatingsReceived = BigInt.fromI32(0);
    user.averageRating = BigInt.fromI32(0).toBigDecimal();
    user.totalCreditsSpent = BigInt.fromI32(0);
    user.joinedAt = BigInt.fromI32(0);
    user.lastActivity = BigInt.fromI32(0);
  }
  return user;
}

function getOrCreateSkill(skillHash: Bytes): Skill {
  let skill = Skill.load(skillHash.toHexString());
  if (skill == null) {
    skill = new Skill(skillHash.toHexString());
    skill.hash = skillHash;
    skill.totalRatings = BigInt.fromI32(0);
    skill.averageRating = BigInt.fromI32(0).toBigDecimal();
    skill.createdAt = BigInt.fromI32(0);
  }
  return skill;
}

function getOrCreateJob(jobHash: Bytes): Job {
  let job = Job.load(jobHash.toHexString());
  if (job == null) {
    job = new Job(jobHash.toHexString());
    job.hash = jobHash;
    job.totalCreditsSpent = BigInt.fromI32(0);
    job.totalSponsorships = BigInt.fromI32(0);
    job.createdAt = BigInt.fromI32(0);
  }
  return job;
}

export function handleReviewerApproved(event: ReviewerApproved): void {
  // Create or update user
  let user = getOrCreateUser(event.params.reviewer);
  user.isReviewer = true;
  user.approvedAt = event.block.timestamp;
  user.lastActivity = event.block.timestamp;

  if (user.joinedAt.equals(BigInt.fromI32(0))) {
    user.joinedAt = event.block.timestamp;
  }

  user.save();

  // Create reviewer entity
  let reviewer = new Reviewer(event.params.reviewer.toHexString());
  reviewer.user = user.id;
  reviewer.approvedAt = event.block.timestamp;
  reviewer.transactionHash = event.transaction.hash;
  reviewer.blockNumber = event.block.number;
  reviewer.save();
}

export function handleSkillRated(event: SkillRated): void {
  // Create or update reviewer
  let reviewer = getOrCreateUser(event.params.reviewer);
  reviewer.isReviewer = true;
  reviewer.totalRatingsGiven = reviewer.totalRatingsGiven.plus(BigInt.fromI32(1));
  reviewer.lastActivity = event.block.timestamp;

  if (reviewer.joinedAt.equals(BigInt.fromI32(0))) {
    reviewer.joinedAt = event.block.timestamp;
  }

  reviewer.save();

  // Create or update ratee
  let ratee = getOrCreateUser(event.params.user);
  ratee.totalRatingsReceived = ratee.totalRatingsReceived.plus(BigInt.fromI32(1));
  ratee.lastActivity = event.block.timestamp;

  if (ratee.joinedAt.equals(BigInt.fromI32(0))) {
    ratee.joinedAt = event.block.timestamp;
  }

  // Update average rating
  if (ratee.totalRatingsReceived.gt(BigInt.fromI32(0))) {
    // Simple average calculation (can be improved)
    let currentTotal = ratee.averageRating.times(ratee.totalRatingsReceived.minus(BigInt.fromI32(1)).toBigDecimal());
    let newTotal = currentTotal.plus(BigInt.fromI32(event.params.overallRating).toBigDecimal());
    ratee.averageRating = newTotal.div(ratee.totalRatingsReceived.toBigDecimal());
  }

  ratee.save();

  // Create or update skill
  let skill = getOrCreateSkill(event.params.skill);
  skill.totalRatings = skill.totalRatings.plus(BigInt.fromI32(1));

  if (skill.createdAt.equals(BigInt.fromI32(0))) {
    skill.createdAt = event.block.timestamp;
  }

  // Update skill average rating
  if (skill.totalRatings.gt(BigInt.fromI32(0))) {
    let currentTotal = skill.averageRating.times(skill.totalRatings.minus(BigInt.fromI32(1)).toBigDecimal());
    let newTotal = currentTotal.plus(BigInt.fromI32(event.params.overallRating).toBigDecimal());
    skill.averageRating = newTotal.div(skill.totalRatings.toBigDecimal());
  }

  skill.save();

  // Create rating entity
  let ratingId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let rating = new Rating(ratingId);
  rating.reviewer = reviewer.id;
  rating.ratee = ratee.id;
  rating.skill = skill.id;
  rating.overallRating = event.params.overallRating;
  rating.timestamp = event.block.timestamp;
  rating.transactionHash = event.transaction.hash;
  rating.blockNumber = event.block.number;
  rating.save();
}

export function handleCreditsSpent(event: CreditsSpent): void {
  // Create or update sponsor
  let sponsor = getOrCreateUser(event.params.sponsor);
  sponsor.totalCreditsSpent = sponsor.totalCreditsSpent.plus(event.params.creditsUsed);
  sponsor.lastActivity = event.block.timestamp;

  if (sponsor.joinedAt.equals(BigInt.fromI32(0))) {
    sponsor.joinedAt = event.block.timestamp;
  }

  sponsor.save();

  // Create or update candidate
  let candidate = getOrCreateUser(event.params.candidate);
  candidate.lastActivity = event.block.timestamp;

  if (candidate.joinedAt.equals(BigInt.fromI32(0))) {
    candidate.joinedAt = event.block.timestamp;
  }

  candidate.save();

  // Create or update job
  let job = getOrCreateJob(event.params.jobId);
  job.totalCreditsSpent = job.totalCreditsSpent.plus(event.params.creditsUsed);
  job.totalSponsorships = job.totalSponsorships.plus(BigInt.fromI32(1));

  if (job.createdAt.equals(BigInt.fromI32(0))) {
    job.createdAt = event.block.timestamp;
  }

  job.save();

  // Create sponsorship entity
  let sponsorshipId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let sponsorship = new Sponsorship(sponsorshipId);
  sponsorship.sponsor = sponsor.id;
  sponsorship.candidate = candidate.id;
  sponsorship.job = job.id;
  sponsorship.creditsUsed = event.params.creditsUsed;
  sponsorship.timestamp = event.block.timestamp;
  sponsorship.transactionHash = event.transaction.hash;
  sponsorship.blockNumber = event.block.number;
  sponsorship.save();
}

export function handleHiringOutcome(event: HiringOutcome): void {
  // Create or update candidate
  let candidate = getOrCreateUser(event.params.candidate);
  candidate.lastActivity = event.block.timestamp;

  if (candidate.joinedAt.equals(BigInt.fromI32(0))) {
    candidate.joinedAt = event.block.timestamp;
  }

  candidate.save();

  // Create hiring outcome entity
  let outcomeId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let outcome = new HiringOutcomeEntity(outcomeId);
  outcome.candidate = candidate.id;
  outcome.isHired = event.params.isHired;
  outcome.timestamp = event.block.timestamp;
  outcome.transactionHash = event.transaction.hash;
  outcome.blockNumber = event.block.number;
  outcome.save();
}