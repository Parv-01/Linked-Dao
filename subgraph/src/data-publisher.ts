import { ethers } from 'ethers';
import TrustNetworkPublisher, { 
  TrustNetworkEntity, 
  ENTITY_TYPES, 
  RELATIONSHIP_TYPES 
} from './grc20-schema.js';

// Publisher for converting OnchainTrustNetwork events to GRC-20 format
export class OnchainTrustPublisher {
  private publisher: TrustNetworkPublisher;
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(
    graphEndpoint: string,
    spaceId: string,
    rpcUrl: string,
    contractAddress: string,
    authToken?: string
  ) {
    this.publisher = new TrustNetworkPublisher(graphEndpoint, spaceId, authToken);
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Contract ABI for event listening
    const contractABI = [
      "event ReviewerApproved(address indexed reviewer, uint256 timestamp)",
      "event SkillRated(address indexed reviewer, address indexed junior, bytes32 indexed skillHash, uint8 overallRating)",
      "event CreditsSpent(address indexed sponsor, address indexed candidate, bytes32 indexed jobIdHash, uint256 creditsUsed)",
      "event HiringOutcome(address indexed candidate, bool isHired, uint256 timestamp)"
    ];

    this.contract = new ethers.Contract(contractAddress, contractABI, this.provider);
  }

  // Initialize and publish schema
  async initialize(): Promise<boolean> {
    console.log('🚀 Initializing OnchainTrust Knowledge Graph...');
    return await this.publisher.publishSchema();
  }

  // Convert ReviewerApproved event to GRC-20 entities
  async handleReviewerApproved(event: any): Promise<void> {
    const reviewerAddress = event.args.reviewer;
    const timestamp = event.args.timestamp.toString();

    // Create User entity
    const userEntity: TrustNetworkEntity = {
      id: `user:${reviewerAddress}`,
      type: ENTITY_TYPES.USER,
      properties: {
        address: reviewerAddress,
        verified: false, // Will be updated when Self Protocol verification occurs
        isReviewer: true,
        trustScore: 50, // Initial trust score
        joinedAt: timestamp,
        reputation: 0
      },
      relationships: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    // Create Reviewer entity
    const reviewerEntity: TrustNetworkEntity = {
      id: `reviewer:${reviewerAddress}`,
      type: ENTITY_TYPES.REVIEWER,
      properties: {
        address: reviewerAddress,
        approvedAt: timestamp,
        ratingsGiven: 0,
        averageRatingGiven: 0,
        reviewerLevel: 'junior'
      },
      relationships: [
        {
          type: 'trust:isReviewerOf',
          target: userEntity.id,
          properties: { approvedAt: timestamp },
          direction: 'outgoing'
        }
      ],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    await this.publisher.publishBatch([userEntity, reviewerEntity]);
  }

  // Convert SkillRated event to GRC-20 entities and relationships
  async handleSkillRated(event: any): Promise<void> {
    const reviewerAddress = event.args.reviewer;
    const juniorAddress = event.args.junior;
    const skillHash = event.args.skillHash;
    const rating = parseInt(event.args.overallRating);
    const timestamp = event.block.timestamp.toString();

    // Create/update Skill entity
    const skillEntity: TrustNetworkEntity = {
      id: `skill:${skillHash}`,
      type: ENTITY_TYPES.SKILL,
      properties: {
        skillHash: skillHash,
        name: await this.getSkillName(skillHash), // You can implement skill name mapping
        category: 'technical',
        averageRating: rating, // Will be computed across all ratings
        totalRatings: 1,
        verificationRequirements: {
          minimumRatings: 3,
          minimumReviewers: 2
        }
      },
      relationships: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    // Create Rating relationship
    const ratingRelationship: TrustNetworkEntity = {
      id: `rating:${event.transactionHash}-${event.logIndex}`,
      type: 'trust:Rating',
      properties: {
        rating: rating,
        timestamp: timestamp,
        transactionHash: event.transactionHash,
        confidence: this.calculateConfidence(reviewerAddress, rating)
      },
      relationships: [
        {
          type: RELATIONSHIP_TYPES.RATES,
          target: `user:${juniorAddress}`,
          properties: {
            skill: skillEntity.id,
            rating: rating,
            timestamp: timestamp
          },
          direction: 'outgoing'
        }
      ],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    // Ensure junior user exists
    const juniorUserEntity: TrustNetworkEntity = {
      id: `user:${juniorAddress}`,
      type: ENTITY_TYPES.USER,
      properties: {
        address: juniorAddress,
        verified: false,
        isReviewer: false,
        trustScore: this.calculateTrustScore(juniorAddress, rating),
        reputation: rating
      },
      relationships: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    await this.publisher.publishBatch([skillEntity, ratingRelationship, juniorUserEntity]);
  }

  // Convert CreditsSpent event to GRC-20 entities and relationships
  async handleCreditsSpent(event: any): Promise<void> {
    const sponsorAddress = event.args.sponsor;
    const candidateAddress = event.args.candidate;
    const jobIdHash = event.args.jobIdHash;
    const creditsUsed = event.args.creditsUsed.toString();
    const timestamp = event.block.timestamp.toString();

    // Create Job entity
    const jobEntity: TrustNetworkEntity = {
      id: `job:${jobIdHash}`,
      type: ENTITY_TYPES.JOB,
      properties: {
        jobHash: jobIdHash,
        title: await this.getJobTitle(jobIdHash), // You can implement job title mapping
        description: '',
        requiredSkills: [],
        totalCreditsSpent: parseInt(creditsUsed),
        totalSponsorships: 1,
        hiringSuccess: false // Will be updated when hiring outcome is recorded
      },
      relationships: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    // Create Sponsorship relationship
    const sponsorshipRelationship: TrustNetworkEntity = {
      id: `sponsorship:${event.transactionHash}-${event.logIndex}`,
      type: 'trust:Sponsorship',
      properties: {
        creditsSpent: parseInt(creditsUsed),
        timestamp: timestamp,
        transactionHash: event.transactionHash,
        sponsorshipType: 'reputation' // Can be inferred from context
      },
      relationships: [
        {
          type: RELATIONSHIP_TYPES.SPONSORS,
          target: `user:${candidateAddress}`,
          properties: {
            job: jobEntity.id,
            creditsSpent: parseInt(creditsUsed),
            timestamp: timestamp
          },
          direction: 'outgoing'
        }
      ],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    await this.publisher.publishBatch([jobEntity, sponsorshipRelationship]);
  }

  // Convert HiringOutcome event to GRC-20 relationship
  async handleHiringOutcome(event: any): Promise<void> {
    const candidateAddress = event.args.candidate;
    const isHired = event.args.isHired;
    const timestamp = event.args.timestamp.toString();

    // Create HiringOutcome relationship
    const hiringRelationship: TrustNetworkEntity = {
      id: `hiring:${event.transactionHash}-${event.logIndex}`,
      type: 'trust:HiringOutcome',
      properties: {
        isHired: isHired,
        timestamp: timestamp,
        transactionHash: event.transactionHash,
        successRate: isHired ? 1.0 : 0.0
      },
      relationships: [
        {
          type: RELATIONSHIP_TYPES.HIRED_BY,
          target: `user:${candidateAddress}`,
          properties: {
            outcome: isHired ? 'hired' : 'rejected',
            timestamp: timestamp
          },
          direction: 'incoming'
        }
      ],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'onchain',
        verification: {
          selfProtocol: false,
          onchainProof: event.transactionHash,
          verificationTimestamp: timestamp
        }
      }
    };

    await this.publisher.publishEntity(hiringRelationship);
  }

  // Listen to all contract events and publish to knowledge graph
  async startEventListener(fromBlock: number = 0): Promise<void> {
    console.log('🎧 Starting event listener for OnchainTrustNetwork...');

    // Listen for ReviewerApproved events
    this.contract.on('ReviewerApproved', async (reviewer, timestamp, event) => {
      console.log('📢 ReviewerApproved:', reviewer);
      await this.handleReviewerApproved(event);
    });

    // Listen for SkillRated events  
    this.contract.on('SkillRated', async (reviewer, junior, skillHash, rating, event) => {
      console.log('⭐ SkillRated:', junior, 'rated', rating, 'for skill', skillHash);
      await this.handleSkillRated(event);
    });

    // Listen for CreditsSpent events
    this.contract.on('CreditsSpent', async (sponsor, candidate, jobIdHash, creditsUsed, event) => {
      console.log('💰 CreditsSpent:', creditsUsed, 'credits from', sponsor, 'to', candidate);
      await this.handleCreditsSpent(event);
    });

    // Listen for HiringOutcome events
    this.contract.on('HiringOutcome', async (candidate, isHired, timestamp, event) => {
      console.log('🎯 HiringOutcome:', candidate, isHired ? 'hired' : 'not hired');
      await this.handleHiringOutcome(event);
    });

    console.log('✅ Event listeners started successfully');
  }

  // Helper functions
  private async getSkillName(skillHash: string): Promise<string> {
    // You can implement a mapping service or use external APIs
    // For now, return a placeholder
    return `Skill-${skillHash.substring(0, 8)}`;
  }

  private async getJobTitle(jobHash: string): Promise<string> {
    // You can implement a mapping service or use external APIs
    return `Job-${jobHash.substring(0, 8)}`;
  }

  private calculateConfidence(reviewerAddress: string, rating: number): number {
    // Implement confidence calculation based on reviewer history
    // For now, return a base confidence
    return 0.8;
  }

  private calculateTrustScore(userAddress: string, rating: number): number {
    // Implement trust score calculation
    // For now, use rating as base score
    return rating * 10;
  }
}

export default OnchainTrustPublisher;