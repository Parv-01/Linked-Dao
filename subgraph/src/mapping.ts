import { BigInt, Bytes, ethereum, BigDecimal } from "@graphprotocol/graph-ts"
import {
  ReviewerApproved,
  SkillRated,
  CreditsSpent,
  HiringOutcome
} from "../generated/OnchainTrustNetwork/OnchainTrustNetwork"
import { User, Reviewer, Rating, Sponsorship, HiringOutcome as HiringOutcomeEntity, Skill, Job } from "../generated/schema"

// Helper function to create or load a user
function getOrCreateUser(address: Bytes): User {
  let user = User.load(address.toHex())
  if (user == null) {
    user = new User(address.toHex())
    user.verified = false
    user.isReviewer = false
    user.save()
  }
  return user
}

// Helper function to create or load a skill
function getOrCreateSkill(skillHash: Bytes): Skill {
  let skill = Skill.load(skillHash.toHex())
  if (skill == null) {
    skill = new Skill(skillHash.toHex())
    skill.hash = skillHash
    skill.averageRating = BigDecimal.fromString("0")
    skill.totalRatings = 0
    skill.save()
  }
  return skill
}

// Helper function to create or load a job
function getOrCreateJob(jobIdHash: Bytes): Job {
  let job = Job.load(jobIdHash.toHex())
  if (job == null) {
    job = new Job(jobIdHash.toHex())
    job.hash = jobIdHash
    job.totalCreditsSpent = BigInt.fromI32(0)
    job.totalSponsorships = 0
    job.save()
  }
  return job
}

export function handleReviewerApproved(event: ReviewerApproved): void {
  let reviewerAddress = event.params.reviewer
  let user = getOrCreateUser(reviewerAddress)

  // Mark user as reviewer
  user.isReviewer = true
  user.save()

  // Create reviewer entity
  let reviewer = new Reviewer(reviewerAddress.toHex())
  reviewer.user = user.id
  reviewer.approvedAt = event.params.timestamp
  reviewer.save()
}

export function handleSkillRated(event: SkillRated): void {
  let reviewerAddress = event.params.reviewer
  let juniorAddress = event.params.junior
  let skillHash = event.params.skillHash
  let rating = event.params.overallRating

  // Get or create users
  let reviewer = getOrCreateUser(reviewerAddress)
  let junior = getOrCreateUser(juniorAddress)

  // Mark both as verified (since they can interact with the contract)
  reviewer.verified = true
  junior.verified = true
  reviewer.save()
  junior.save()

  // Get or create skill
  let skill = getOrCreateSkill(skillHash)

  // Create rating entity
  let ratingId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let ratingEntity = new Rating(ratingId)
  ratingEntity.user = junior.id
  ratingEntity.reviewer = reviewer.id
  ratingEntity.skill = skill.id
  ratingEntity.skillHash = skillHash
  ratingEntity.overallRating = rating
  ratingEntity.timestamp = event.block.timestamp
  ratingEntity.transactionHash = event.transaction.hash
  ratingEntity.blockNumber = event.block.number
  ratingEntity.save()

  // Update skill statistics
  skill.totalRatings = skill.totalRatings + 1
  // Calculate new average rating
  let totalRatingSum = skill.averageRating.times(BigDecimal.fromString((skill.totalRatings - 1).toString())).plus(BigDecimal.fromString(rating.toString()))
  skill.averageRating = totalRatingSum.div(BigDecimal.fromString(skill.totalRatings.toString()))
  skill.save()
}

export function handleCreditsSpent(event: CreditsSpent): void {
  let sponsorAddress = event.params.sponsor
  let candidateAddress = event.params.candidate
  let jobIdHash = event.params.jobIdHash
  let creditsUsed = event.params.creditsUsed

  // Get or create users
  let sponsor = getOrCreateUser(sponsorAddress)
  let candidate = getOrCreateUser(candidateAddress)

  // Mark both as verified
  sponsor.verified = true
  candidate.verified = true
  sponsor.save()
  candidate.save()

  // Get or create job
  let job = getOrCreateJob(jobIdHash)

  // Create sponsorship entity
  let sponsorshipId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let sponsorship = new Sponsorship(sponsorshipId)
  sponsorship.sponsor = sponsor.id
  sponsorship.candidate = candidate.id
  sponsorship.job = job.id
  sponsorship.jobIdHash = jobIdHash
  sponsorship.creditsUsed = creditsUsed
  sponsorship.timestamp = event.block.timestamp
  sponsorship.transactionHash = event.transaction.hash
  sponsorship.blockNumber = event.block.number
  sponsorship.save()

  // Update job statistics
  job.totalCreditsSpent = job.totalCreditsSpent.plus(creditsUsed)
  job.totalSponsorships = job.totalSponsorships + 1
  job.save()
}

export function handleHiringOutcome(event: HiringOutcome): void {
  let candidateAddress = event.params.candidate
  let isHired = event.params.isHired

  // Get or create user
  let candidate = getOrCreateUser(candidateAddress)
  candidate.verified = true
  candidate.save()

  // Create hiring outcome entity
  let hiringOutcomeId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let hiringOutcome = new HiringOutcomeEntity(hiringOutcomeId)
  hiringOutcome.candidate = candidate.id
  hiringOutcome.isHired = isHired
  hiringOutcome.timestamp = event.params.timestamp
  hiringOutcome.transactionHash = event.transaction.hash
  hiringOutcome.blockNumber = event.block.number
  hiringOutcome.save()
}
