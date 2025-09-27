// src/index.js - Hypergraph event handlers

export function handleReviewerApproved(event) {
  // Create or update Reviewer entity
  let reviewer = new Reviewer(event.params.reviewer.toHex());
  reviewer.address = event.params.reviewer;
  reviewer.approvedAt = event.params.timestamp;
  reviewer.save();

  // Update global stats
  updateStats("totalReviewers", 1);
}

export function handleSkillRated(event) {
  // Create unique ID from transaction hash and log index
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let skillRating = new SkillRating(id);
  skillRating.reviewer = event.params.reviewer.toHex();
  skillRating.junior = event.params.junior;
  skillRating.skillHash = event.params.skillHash;
  skillRating.rating = event.params.overallRating;
  skillRating.timestamp = event.block.timestamp;
  skillRating.blockNumber = event.block.number;
  skillRating.transactionHash = event.transaction.hash;
  skillRating.save();

  // Update global stats
  updateStats("totalRatings", 1);
}

export function handleCreditsSpent(event) {
  // Create unique ID from transaction hash and log index
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let sponsorship = new Sponsorship(id);
  sponsorship.sponsor = event.params.sponsor.toHex();
  sponsorship.candidate = event.params.candidate;
  sponsorship.jobIdHash = event.params.jobIdHash;
  sponsorship.creditsUsed = event.params.creditsUsed;
  sponsorship.timestamp = event.block.timestamp;
  sponsorship.blockNumber = event.block.number;
  sponsorship.transactionHash = event.transaction.hash;
  sponsorship.save();

  // Update global stats
  updateStats("totalSponsorships", 1);
  updateStatsAmount("totalCreditsSpent", event.params.creditsUsed);
}

export function handleHiringOutcome(event) {
  // Create unique ID from transaction hash and log index
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let hiring = new Hiring(id);
  hiring.candidate = event.params.candidate;
  hiring.isHired = event.params.isHired;
  hiring.timestamp = event.params.timestamp;
  hiring.blockNumber = event.block.number;
  hiring.transactionHash = event.transaction.hash;
  hiring.save();

  // Update global stats if hired
  if (event.params.isHired) {
    updateStats("totalHires", 1);
  }
}

// Helper function to update aggregate statistics
function updateStats(field, increment) {
  let stats = Stats.load("global");
  if (stats == null) {
    stats = new Stats("global");
    stats.totalReviewers = 0;
    stats.totalRatings = 0;
    stats.totalSponsorships = 0;
    stats.totalHires = 0;
    stats.totalCreditsSpent = BigInt.fromI32(0);
  }

  if (field == "totalReviewers") {
    stats.totalReviewers += increment;
  } else if (field == "totalRatings") {
    stats.totalRatings += increment;
  } else if (field == "totalSponsorships") {
    stats.totalSponsorships += increment;
  } else if (field == "totalHires") {
    stats.totalHires += increment;
  }

  stats.save();
}

function updateStatsAmount(field, amount) {
  let stats = Stats.load("global");
  if (stats == null) {
    stats = new Stats("global");
    stats.totalReviewers = 0;
    stats.totalRatings = 0;
    stats.totalSponsorships = 0;
    stats.totalHires = 0;
    stats.totalCreditsSpent = BigInt.fromI32(0);
  }

  if (field == "totalCreditsSpent") {
    stats.totalCreditsSpent = stats.totalCreditsSpent.plus(amount);
  }

  stats.save();
}