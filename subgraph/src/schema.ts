import { 
  Entity,
  Property,
  createSchema,
  EntityType,
  PropertyType
} from '@graphprotocol/grc-20';

// Define Knowledge Graph entities for OnchainTrustNetwork

export const UserEntity = new EntityType({
  name: 'User',
  description: 'A user in the OnchainTrustNetwork system',
  properties: {
    id: new PropertyType({
      name: 'id',
      type: 'string',
      description: 'Ethereum address of the user',
      required: true
    }),
    verified: new PropertyType({
      name: 'verified',
      type: 'boolean',
      description: 'Self Protocol verification status',
      required: true
    }),
    isReviewer: new PropertyType({
      name: 'isReviewer',
      type: 'boolean',
      description: 'Whether user is an approved reviewer',
      required: true
    }),
    approvedAt: new PropertyType({
      name: 'approvedAt',
      type: 'number',
      description: 'Timestamp when user was approved as reviewer',
      required: false
    })
  }
});

export const SkillEntity = new EntityType({
  name: 'Skill',
  description: 'A skill that can be rated in the trust network',
  properties: {
    id: new PropertyType({
      name: 'id',
      type: 'string',
      description: 'Hash of the skill',
      required: true
    }),
    hash: new PropertyType({
      name: 'hash',
      type: 'string',
      description: 'The skill hash bytes',
      required: true
    }),
    averageRating: new PropertyType({
      name: 'averageRating',
      type: 'number',
      description: 'Average rating for this skill',
      required: true
    }),
    totalRatings: new PropertyType({
      name: 'totalRatings',
      type: 'number',
      description: 'Total number of ratings for this skill',
      required: true
    })
  }
});

export const JobEntity = new EntityType({
  name: 'Job',
  description: 'A job opportunity in the network',
  properties: {
    id: new PropertyType({
      name: 'id',
      type: 'string',
      description: 'Hash of the job ID',
      required: true
    }),
    hash: new PropertyType({
      name: 'hash',
      type: 'string',
      description: 'The job ID hash bytes',
      required: true
    }),
    totalCreditsSpent: new PropertyType({
      name: 'totalCreditsSpent',
      type: 'number',
      description: 'Total credits spent on this job',
      required: true
    }),
    totalSponsorships: new PropertyType({
      name: 'totalSponsorships',
      type: 'number',
      description: 'Total number of sponsorships for this job',
      required: true
    })
  }
});

export const RatingRelation = new EntityType({
  name: 'Rating',
  description: 'A skill rating relationship between reviewer and user',
  properties: {
    id: new PropertyType({
      name: 'id',
      type: 'string',
      description: 'Transaction hash + log index',
      required: true
    }),
    reviewer: new PropertyType({
      name: 'reviewer',
      type: 'string',
      description: 'Address of the reviewer',
      required: true
    }),
    user: new PropertyType({
      name: 'user',
      type: 'string',
      description: 'Address of the user being rated',
      required: true
    }),
    skill: new PropertyType({
      name: 'skill',
      type: 'string',
      description: 'Hash of the skill being rated',
      required: true
    }),
    overallRating: new PropertyType({
      name: 'overallRating',
      type: 'number',
      description: 'Rating value (1-10)',
      required: true
    }),
    timestamp: new PropertyType({
      name: 'timestamp',
      type: 'number',
      description: 'Block timestamp',
      required: true
    }),
    transactionHash: new PropertyType({
      name: 'transactionHash',
      type: 'string',
      description: 'Transaction hash',
      required: true
    }),
    blockNumber: new PropertyType({
      name: 'blockNumber',
      type: 'number',
      description: 'Block number',
      required: true
    })
  }
});

export const SponsorshipRelation = new EntityType({
  name: 'Sponsorship',
  description: 'A sponsorship relationship between sponsor and candidate for a job',
  properties: {
    id: new PropertyType({
      name: 'id',
      type: 'string',
      description: 'Transaction hash + log index',
      required: true
    }),
    sponsor: new PropertyType({
      name: 'sponsor',
      type: 'string',
      description: 'Address of the sponsor',
      required: true
    }),
    candidate: new PropertyType({
      name: 'candidate',
      type: 'string',
      description: 'Address of the candidate',
      required: true
    }),
    job: new PropertyType({
      name: 'job',
      type: 'string',
      description: 'Hash of the job ID',
      required: true
    }),
    creditsUsed: new PropertyType({
      name: 'creditsUsed',
      type: 'number',
      description: 'Amount of credits spent',
      required: true
    }),
    timestamp: new PropertyType({
      name: 'timestamp',
      type: 'number',
      description: 'Block timestamp',
      required: true
    }),
    transactionHash: new PropertyType({
      name: 'transactionHash',
      type: 'string',
      description: 'Transaction hash',
      required: true
    }),
    blockNumber: new PropertyType({
      name: 'blockNumber',
      type: 'number',
      description: 'Block number',
      required: true
    })
  }
});

export const HiringOutcomeRelation = new EntityType({
  name: 'HiringOutcome',
  description: 'The outcome of a hiring decision',
  properties: {
    id: new PropertyType({
      name: 'id',
      type: 'string',
      description: 'Transaction hash + log index',
      required: true
    }),
    candidate: new PropertyType({
      name: 'candidate',
      type: 'string',
      description: 'Address of the candidate',
      required: true
    }),
    isHired: new PropertyType({
      name: 'isHired',
      type: 'boolean',
      description: 'Whether the candidate was hired',
      required: true
    }),
    timestamp: new PropertyType({
      name: 'timestamp',
      type: 'number',
      description: 'Block timestamp',
      required: true
    }),
    transactionHash: new PropertyType({
      name: 'transactionHash',
      type: 'string',
      description: 'Transaction hash',
      required: true
    }),
    blockNumber: new PropertyType({
      name: 'blockNumber',
      type: 'number',
      description: 'Block number',
      required: true
    })
  }
});

// Create the schema
export const schema = createSchema({
  entities: [
    UserEntity,
    SkillEntity,
    JobEntity,
    RatingRelation,
    SponsorshipRelation,
    HiringOutcomeRelation
  ]
});