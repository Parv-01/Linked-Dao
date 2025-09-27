import { createPublicClient, http, parseAbiItem, Log } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import {
  ONCHAIN_TRUST_NETWORK_ABI,
  BridgeConfig,
  ReviewerApprovedEvent,
  SkillRatedEvent,
  CreditsSpentEvent,
  HiringOutcomeEvent
} from './types.js';

dotenv.config();

export class OnchainTrustBridge {
  private config: BridgeConfig;
  private client: any;
  private lastProcessedBlock: bigint = 0n;
  private isRunning: boolean = false;

  // In-memory storage for entities (in production, this would be a database)
  private users = new Map<string, any>();
  private skills = new Map<string, any>();
  private jobs = new Map<string, any>();
  private ratings: any[] = [];
  private sponsorships: any[] = [];
  private hiringOutcomes: any[] = [];

  constructor(config: BridgeConfig) {
    this.config = config;
    this.client = createPublicClient({
      chain: celoAlfajores,
      transport: http(config.rpcUrl)
    });
    this.log('info', 'Bridge initialized with config:', config);
  }

  private log(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
  }

  // Start listening to contract events
  async start(): Promise<void> {
    if (this.isRunning) {
      this.log('warn', 'Bridge is already running');
      return;
    }

    this.isRunning = true;
    this.log('info', 'Starting OnchainTrustNetwork bridge...');

    try {
      // Get the latest block if starting from 'latest'
      if (this.config.startBlock === 'latest') {
        const latestBlock = await this.client.getBlockNumber();
        this.lastProcessedBlock = latestBlock;
        this.log('info', `Starting from latest block: ${latestBlock}`);
      } else {
        this.lastProcessedBlock = this.config.startBlock;
        this.log('info', `Starting from block: ${this.config.startBlock}`);
      }

      // Start the polling loop
      this.pollForEvents();
    } catch (error) {
      this.log('error', 'Failed to start bridge:', error);
      this.isRunning = false;
      throw error;
    }
  }

  // Stop the bridge
  stop(): void {
    this.isRunning = false;
    this.log('info', 'Bridge stopped');
  }

  // Poll for new events
  private async pollForEvents(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.processNewBlocks();
        await this.sleep(this.config.pollInterval);
      } catch (error) {
        this.log('error', 'Error polling for events:', error);
        await this.sleep(this.config.pollInterval * 2); // Back off on error
      }
    }
  }

  // Process new blocks and their events
  private async processNewBlocks(): Promise<void> {
    const latestBlock = await this.client.getBlockNumber();
    
    if (latestBlock <= this.lastProcessedBlock) {
      return; // No new blocks
    }

    const fromBlock = this.lastProcessedBlock + 1n;
    const toBlock = latestBlock;

    this.log('info', `Processing blocks ${fromBlock} to ${toBlock}`);

    // Get all events for our contract in the block range
    const events = await this.client.getLogs({
      address: this.config.contractAddress as `0x${string}`,
      fromBlock,
      toBlock,
      events: [
        parseAbiItem('event ReviewerApproved(address indexed reviewer, uint256 timestamp)'),
        parseAbiItem('event SkillRated(address indexed reviewer, address indexed junior, bytes32 indexed skillHash, uint8 overallRating)'),
        parseAbiItem('event CreditsSpent(address indexed sponsor, address indexed candidate, bytes32 indexed jobIdHash, uint256 creditsUsed)'),
        parseAbiItem('event HiringOutcome(address indexed candidate, bool isHired, uint256 timestamp)')
      ]
    });

    // Process each event
    for (const event of events) {
      await this.processEvent(event);
    }

    this.lastProcessedBlock = toBlock;
    
    if (events.length > 0) {
      this.log('info', `Processed ${events.length} events from blocks ${fromBlock}-${toBlock}`);
    }
  }

  // Process individual event and update knowledge graph
  private async processEvent(event: Log): Promise<void> {
    try {
      const eventName = event.topics?.[0];
      const blockNumber = event.blockNumber || 0n;
      const transactionHash = event.transactionHash || '';

      switch (event.eventName) {
        case 'ReviewerApproved':
          await this.handleReviewerApproved(event as any, blockNumber, transactionHash);
          break;
        case 'SkillRated':
          await this.handleSkillRated(event as any, blockNumber, transactionHash);
          break;
        case 'CreditsSpent':
          await this.handleCreditsSpent(event as any, blockNumber, transactionHash);
          break;
        case 'HiringOutcome':
          await this.handleHiringOutcome(event as any, blockNumber, transactionHash);
          break;
        default:
          this.log('debug', `Unknown event: ${event.eventName}`);
      }
    } catch (error) {
      this.log('error', 'Error processing event:', { event, error });
    }
  }

  // Handle ReviewerApproved event
  private async handleReviewerApproved(event: any, blockNumber: bigint, transactionHash: string): Promise<void> {
    const { reviewer, timestamp } = event.args;
    
    this.log('info', `ReviewerApproved: ${reviewer} at ${timestamp}`);

    // Create or update user entity
    const userKey = reviewer.toLowerCase();
    const existingUser = this.users.get(userKey);

    const userData = {
      id: userKey,
      address: reviewer,
      verified: true,
      isReviewer: true,
      approvedAt: Number(timestamp),
      totalRatingsGiven: existingUser?.totalRatingsGiven || 0,
      totalRatingsReceived: existingUser?.totalRatingsReceived || 0,
      averageRating: existingUser?.averageRating || 0,
      totalCreditsSpent: existingUser?.totalCreditsSpent || 0,
      joinedAt: existingUser?.joinedAt || Number(timestamp),
      lastActivity: Number(timestamp)
    };

    this.users.set(userKey, userData);
    
    // In a real implementation, this would publish to Hypergraph
    await this.publishToKnowledgeGraph('User', userData);
    
    this.log('info', `User entity updated: ${reviewer} (now reviewer)`);
  }

  // Handle SkillRated event
  private async handleSkillRated(event: any, blockNumber: bigint, transactionHash: string): Promise<void> {
    const { reviewer, junior, skillHash, overallRating } = event.args;
    
    this.log('info', `SkillRated: ${reviewer} rated ${junior} ${overallRating}/10 for skill ${skillHash}`);

    // Update or create skill entity
    const skillKey = skillHash;
    const existingSkill = this.skills.get(skillKey);
    const currentTime = Date.now();

    const skillData = {
      id: skillKey,
      skillHash: skillHash,
      name: this.deriveSkillName(skillHash),
      totalRatings: (existingSkill?.totalRatings || 0) + 1,
      averageRating: existingSkill ? 
        ((existingSkill.averageRating * existingSkill.totalRatings) + overallRating) / (existingSkill.totalRatings + 1) :
        overallRating,
      firstRatedAt: existingSkill?.firstRatedAt || currentTime,
      lastRatedAt: currentTime
    };

    this.skills.set(skillKey, skillData);

    // Update users
    await this.updateUserFromRating(reviewer, junior, overallRating);

    // Create rating entity
    const ratingData = {
      id: `${transactionHash}-${blockNumber}`,
      reviewerId: reviewer.toLowerCase(),
      juniorId: junior.toLowerCase(),
      skillId: skillKey,
      overallRating: overallRating,
      timestamp: currentTime,
      transactionHash,
      blockNumber: Number(blockNumber)
    };

    this.ratings.push(ratingData);

    // Publish to knowledge graph
    await this.publishToKnowledgeGraph('Skill', skillData);
    await this.publishToKnowledgeGraph('Rating', ratingData);
    
    this.log('info', `Rating recorded: ${overallRating}/10 for skill ${skillHash}`);
  }

  // Handle CreditsSpent event
  private async handleCreditsSpent(event: any, blockNumber: bigint, transactionHash: string): Promise<void> {
    const { sponsor, candidate, jobIdHash, creditsUsed } = event.args;
    
    this.log('info', `CreditsSpent: ${sponsor} spent ${creditsUsed} credits on ${candidate} for job ${jobIdHash}`);

    // Update or create job entity
    const jobKey = jobIdHash;
    const existingJob = this.jobs.get(jobKey);
    const currentTime = Date.now();

    const jobData = {
      id: jobKey,
      jobIdHash: jobIdHash,
      description: this.deriveJobDescription(jobIdHash),
      totalCreditsSpent: (existingJob?.totalCreditsSpent || 0) + Number(creditsUsed),
      totalSponsorships: (existingJob?.totalSponsorships || 0) + 1,
      firstSponsoredAt: existingJob?.firstSponsoredAt || currentTime,
      lastSponsoredAt: currentTime
    };

    this.jobs.set(jobKey, jobData);

    // Update sponsor user
    await this.updateUserFromSponsorship(sponsor, Number(creditsUsed));

    // Create sponsorship entity
    const sponsorshipData = {
      id: `${transactionHash}-${blockNumber}`,
      sponsorId: sponsor.toLowerCase(),
      candidateId: candidate.toLowerCase(),
      jobId: jobKey,
      creditsUsed: Number(creditsUsed),
      timestamp: currentTime,
      transactionHash,
      blockNumber: Number(blockNumber)
    };

    this.sponsorships.push(sponsorshipData);

    // Publish to knowledge graph
    await this.publishToKnowledgeGraph('Job', jobData);
    await this.publishToKnowledgeGraph('Sponsorship', sponsorshipData);
    
    this.log('info', `Sponsorship recorded: ${creditsUsed} credits for job ${jobIdHash}`);
  }

  // Handle HiringOutcome event
  private async handleHiringOutcome(event: any, blockNumber: bigint, transactionHash: string): Promise<void> {
    const { candidate, isHired, timestamp } = event.args;
    
    this.log('info', `HiringOutcome: ${candidate} ${isHired ? 'HIRED' : 'NOT HIRED'} at ${timestamp}`);

    // Create hiring outcome entity
    const outcomeData = {
      id: `${transactionHash}-${blockNumber}`,
      candidateId: candidate.toLowerCase(),
      isHired: isHired,
      timestamp: Number(timestamp),
      transactionHash,
      blockNumber: Number(blockNumber)
    };

    this.hiringOutcomes.push(outcomeData);

    // Publish to knowledge graph
    await this.publishToKnowledgeGraph('HiringOutcome', outcomeData);
    
    this.log('info', `Hiring outcome recorded: ${candidate} ${isHired ? 'hired' : 'not hired'}`);
  }

  // Helper: Update user from rating activity
  private async updateUserFromRating(reviewerAddress: string, juniorAddress: string, rating: number): Promise<void> {
    // Update reviewer
    const reviewerKey = reviewerAddress.toLowerCase();
    const reviewer = this.users.get(reviewerKey) || this.createDefaultUser(reviewerAddress);
    reviewer.totalRatingsGiven += 1;
    reviewer.lastActivity = Date.now();
    this.users.set(reviewerKey, reviewer);
    await this.publishToKnowledgeGraph('User', reviewer);

    // Update junior
    const juniorKey = juniorAddress.toLowerCase();
    const junior = this.users.get(juniorKey) || this.createDefaultUser(juniorAddress);
    junior.totalRatingsReceived += 1;
    junior.averageRating = junior.totalRatingsReceived === 1 ? 
      rating : 
      ((junior.averageRating * (junior.totalRatingsReceived - 1)) + rating) / junior.totalRatingsReceived;
    junior.lastActivity = Date.now();
    this.users.set(juniorKey, junior);
    await this.publishToKnowledgeGraph('User', junior);
  }

  // Helper: Update user from sponsorship activity
  private async updateUserFromSponsorship(sponsorAddress: string, creditsSpent: number): Promise<void> {
    const sponsorKey = sponsorAddress.toLowerCase();
    const sponsor = this.users.get(sponsorKey) || this.createDefaultUser(sponsorAddress);
    sponsor.totalCreditsSpent += creditsSpent;
    sponsor.lastActivity = Date.now();
    this.users.set(sponsorKey, sponsor);
    await this.publishToKnowledgeGraph('User', sponsor);
  }

  // Helper: Create default user
  private createDefaultUser(address: string): any {
    return {
      id: address.toLowerCase(),
      address: address,
      verified: false,
      isReviewer: false,
      approvedAt: null,
      totalRatingsGiven: 0,
      totalRatingsReceived: 0,
      averageRating: 0,
      totalCreditsSpent: 0,
      joinedAt: Date.now(),
      lastActivity: Date.now()
    };
  }

  // Helper: Derive skill name from hash (placeholder implementation)
  private deriveSkillName(skillHash: string): string {
    // In a real implementation, you might have a mapping or derive from common patterns
    const commonSkills = ['JavaScript', 'React', 'Solidity', 'TypeScript', 'Web3', 'DeFi', 'Node.js', 'Python'];
    const hashNum = parseInt(skillHash.slice(-4), 16) % commonSkills.length;
    return commonSkills[hashNum];
  }

  // Helper: Derive job description from hash (placeholder implementation)
  private deriveJobDescription(jobHash: string): string {
    const jobTypes = ['Frontend Developer', 'Smart Contract Developer', 'Full Stack Engineer', 'DeFi Developer', 'Web3 Developer'];
    const hashNum = parseInt(jobHash.slice(-4), 16) % jobTypes.length;
    return jobTypes[hashNum];
  }

  // Publish entity to Hypergraph knowledge graph
  private async publishToKnowledgeGraph(entityType: string, entityData: any): Promise<void> {
    try {
      // This is where you would integrate with Hypergraph publishing
      // For now, we'll just log and store the data
      
      this.log('info', `Publishing ${entityType} to knowledge graph:`, {
        spaceId: this.config.publicSpaceId,
        entityType,
        entityData
      });

      // Simulate API call to Hypergraph
      // In production, this would use the Hypergraph SDK to publish entities
      console.log(`📤 [PUBLISH] ${entityType}:`, JSON.stringify(entityData, null, 2));
      
      return Promise.resolve();
    } catch (error) {
      this.log('error', `Failed to publish ${entityType}:`, error);
      throw error;
    }
  }

  // Helper: Sleep function
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get current stats
  getStats(): any {
    return {
      lastProcessedBlock: this.lastProcessedBlock.toString(),
      isRunning: this.isRunning,
      entities: {
        users: this.users.size,
        skills: this.skills.size,
        jobs: this.jobs.size,
        ratings: this.ratings.length,
        sponsorships: this.sponsorships.length,
        hiringOutcomes: this.hiringOutcomes.length
      }
    };
  }
}