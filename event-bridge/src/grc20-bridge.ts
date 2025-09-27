import { createPublicClient, http, parseAbiItem, Address } from 'viem';
import { Graph, Ipfs, getWalletClient } from '@graphprotocol/grc-20';
import { privateKeyToAccount } from 'viem/accounts';
import { OnchainTrustNetworkABI } from './types';

interface EventData {
  blockNumber: bigint;
  transactionHash: string;
  args: any;
  eventName: string;
}

export class GRC20OnchainTrustBridge {
  private publicClient: any;
  private walletClient: any;
  private contractAddress: Address;
  private spaceId: string;
  private isListening: boolean = false;

  // Property IDs for OnchainTrust entities (these would be created once and reused)
  private propertyIds: { [key: string]: string } = {};
  private typeIds: { [key: string]: string } = {};

  constructor(
    rpcUrl: string,
    contractAddress: Address,
    spaceId: string,
    privateKey: string
  ) {
    this.publicClient = createPublicClient({
      transport: http(rpcUrl),
    });
    
    this.contractAddress = contractAddress;
    this.spaceId = spaceId;
    
    // Initialize wallet client for publishing
    this.initializeWalletClient(privateKey);
  }

  private async initializeWalletClient(privateKey: string) {
    try {
      this.walletClient = await getWalletClient({
        privateKey: privateKey,
      });
      console.log('GRC-20 wallet client initialized');
    } catch (error) {
      console.error('Failed to initialize wallet client:', error);
    }
  }

  // Initialize properties and types (call this once during setup)
  async initializeSchema() {
    try {
      const ops: any[] = [];

      // Create properties for User entity
      const { id: addressPropertyId, ops: addressOps } = Graph.createProperty({
        dataType: 'TEXT',
        name: 'Ethereum Address',
      });
      ops.push(...addressOps);
      this.propertyIds.address = addressPropertyId;

      const { id: verifiedPropertyId, ops: verifiedOps } = Graph.createProperty({
        dataType: 'CHECKBOX',
        name: 'Is Verified Reviewer',
      });
      ops.push(...verifiedOps);
      this.propertyIds.isVerified = verifiedPropertyId;

      const { id: approvedAtPropertyId, ops: approvedAtOps } = Graph.createProperty({
        dataType: 'TIME',
        name: 'Approved At',
      });
      ops.push(...approvedAtOps);
      this.propertyIds.approvedAt = approvedAtPropertyId;

      // Create properties for Rating entity
      const { id: raterPropertyId, ops: raterOps } = Graph.createProperty({
        dataType: 'TEXT',
        name: 'Rater Address',
      });
      ops.push(...raterOps);
      this.propertyIds.rater = raterPropertyId;

      const { id: skillHashPropertyId, ops: skillHashOps } = Graph.createProperty({
        dataType: 'TEXT',
        name: 'Skill Hash',
      });
      ops.push(...skillHashOps);
      this.propertyIds.skillHash = skillHashPropertyId;

      const { id: ratingValuePropertyId, ops: ratingValueOps } = Graph.createProperty({
        dataType: 'NUMBER',
        name: 'Rating Value',
      });
      ops.push(...ratingValueOps);
      this.propertyIds.ratingValue = ratingValuePropertyId;

      const { id: attestationPropertyId, ops: attestationOps } = Graph.createProperty({
        dataType: 'TEXT',
        name: 'Attestation UID',
      });
      ops.push(...attestationOps);
      this.propertyIds.attestationUID = attestationPropertyId;

      // Create User Type
      const { id: userTypeId, ops: userTypeOps } = Graph.createType({
        name: 'OnchainTrust User',
        properties: [addressPropertyId, verifiedPropertyId, approvedAtPropertyId],
      });
      ops.push(...userTypeOps);
      this.typeIds.user = userTypeId;

      // Create Rating Type
      const { id: ratingTypeId, ops: ratingTypeOps } = Graph.createType({
        name: 'OnchainTrust Rating',
        properties: [raterPropertyId, skillHashPropertyId, ratingValuePropertyId, attestationPropertyId],
      });
      ops.push(...ratingTypeOps);
      this.typeIds.rating = ratingTypeId;

      // Publish schema to knowledge graph
      await this.publishOps(ops, 'OnchainTrust Schema Initialization');
      
      console.log('GRC-20 OnchainTrust schema initialized');
      console.log('Property IDs:', this.propertyIds);
      console.log('Type IDs:', this.typeIds);

    } catch (error) {
      console.error('Failed to initialize schema:', error);
    }
  }

  async startListening() {
    if (this.isListening) {
      console.log('Bridge is already listening');
      return;
    }

    this.isListening = true;
    console.log('Starting GRC-20 OnchainTrust bridge...');

    try {
      // Listen for ReviewerApproved events
      this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: OnchainTrustNetworkABI,
        eventName: 'ReviewerApproved',
        onLogs: (logs: any[]) => {
          logs.forEach(log => this.handleReviewerApproved(log));
        },
      });

      // Listen for SkillRated events  
      this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: OnchainTrustNetworkABI,
        eventName: 'SkillRated',
        onLogs: (logs: any[]) => {
          logs.forEach(log => this.handleSkillRated(log));
        },
      });

      // Listen for CreditsSpent events
      this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: OnchainTrustNetworkABI,
        eventName: 'CreditsSpent',
        onLogs: (logs: any[]) => {
          logs.forEach(log => this.handleCreditsSpent(log));
        },
      });

      // Listen for HiringOutcome events
      this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: OnchainTrustNetworkABI,
        eventName: 'HiringOutcome',
        onLogs: (logs: any[]) => {
          logs.forEach(log => this.handleHiringOutcome(log));
        },
      });

      console.log('✅ GRC-20 OnchainTrust bridge is now listening for events');

    } catch (error) {
      console.error('Failed to start listening:', error);
      this.isListening = false;
    }
  }

  private async handleReviewerApproved(log: any) {
    try {
      console.log('📝 Processing ReviewerApproved event:', log);
      
      const { reviewer, timestamp } = log.args;

      // Create User entity using GRC-20 SDK
      const { id: userId, ops: userOps } = Graph.createEntity({
        name: `OnchainTrust User ${reviewer.slice(0, 8)}...`,
        description: `Verified reviewer in OnchainTrustNetwork`,
        types: [this.typeIds.user],
        values: [
          {
            property: this.propertyIds.address,
            value: reviewer,
          },
          {
            property: this.propertyIds.isVerified,
            value: Graph.serializeBoolean(true),
          },
          {
            property: this.propertyIds.approvedAt,
            value: Graph.serializeDate(new Date(Number(timestamp) * 1000)),
          },
        ],
      });

      await this.publishOps(userOps, `ReviewerApproved: ${reviewer}`);
      console.log(`✅ Published User entity: ${userId}`);

    } catch (error) {
      console.error('Failed to handle ReviewerApproved:', error);
    }
  }

  private async handleSkillRated(log: any) {
    try {
      console.log('⭐ Processing SkillRated event:', log);
      
      const { user, rater, skillHash, rating, attestationUID } = log.args;

      // Create Rating entity using GRC-20 SDK
      const { id: ratingId, ops: ratingOps } = Graph.createEntity({
        name: `Rating for ${user.slice(0, 8)}...`,
        description: `Skill rating in OnchainTrustNetwork`,
        types: [this.typeIds.rating],
        values: [
          {
            property: this.propertyIds.rater,
            value: rater,
          },
          {
            property: this.propertyIds.skillHash,
            value: skillHash,
          },
          {
            property: this.propertyIds.ratingValue,
            value: Graph.serializeNumber(Number(rating)),
          },
          {
            property: this.propertyIds.attestationUID,
            value: attestationUID,
          },
        ],
      });

      await this.publishOps(ratingOps, `SkillRated: ${user} by ${rater}`);
      console.log(`✅ Published Rating entity: ${ratingId}`);

    } catch (error) {
      console.error('Failed to handle SkillRated:', error);
    }
  }

  private async handleCreditsSpent(log: any) {
    try {
      console.log('💳 Processing CreditsSpent event:', log);
      
      const { user, amount, timestamp } = log.args;

      // Create or update User entity with credits spent
      // This is a simplified example - in practice you'd want to query existing entity and update
      const { id: creditEventId, ops: creditOps } = Graph.createEntity({
        name: `Credits Spent by ${user.slice(0, 8)}...`,
        description: `Credit spending event in OnchainTrustNetwork`,
        types: [this.typeIds.user], // You might want a separate CreditEvent type
        values: [
          {
            property: this.propertyIds.address,
            value: user,
          },
          // Add amount and timestamp properties if needed
        ],
      });

      await this.publishOps(creditOps, `CreditsSpent: ${user} spent ${amount}`);
      console.log(`✅ Published Credits event: ${creditEventId}`);

    } catch (error) {
      console.error('Failed to handle CreditsSpent:', error);
    }
  }

  private async handleHiringOutcome(log: any) {
    try {
      console.log('🎯 Processing HiringOutcome event:', log);
      
      const { jobId, candidate, employer, outcome, timestamp } = log.args;

      // Create HiringOutcome entity
      // You'd want to create a HiringOutcome type first
      const { id: outcomeId, ops: outcomeOps } = Graph.createEntity({
        name: `Hiring Outcome for Job ${jobId}`,
        description: `Hiring outcome in OnchainTrustNetwork`,
        // types: [this.typeIds.hiringOutcome], // Create this type in initializeSchema
        values: [
          // Add properties for jobId, candidate, employer, outcome, etc.
        ],
      });

      await this.publishOps(outcomeOps, `HiringOutcome: Job ${jobId}`);
      console.log(`✅ Published HiringOutcome entity: ${outcomeId}`);

    } catch (error) {
      console.error('Failed to handle HiringOutcome:', error);
    }
  }

  private async publishOps(ops: any[], editName: string) {
    try {
      if (!this.walletClient) {
        console.error('Wallet client not initialized');
        return;
      }

      const { address } = privateKeyToAccount(process.env.DEMO_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001');

      // Publish to IPFS
      const { cid } = await Ipfs.publishEdit({
        name: editName,
        ops: ops,
        author: address,
        network: 'TESTNET',
      });

      console.log(`📦 Published to IPFS: ${cid}`);

      // Get calldata for onchain publishing
      const response = await fetch(`${Graph.TESTNET_API_ORIGIN}/space/${this.spaceId}/edit/calldata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cid }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get calldata: ${response.statusText}`);
      }

      const { to, data } = await response.json();

      // Send transaction
      const txResult = await this.walletClient.sendTransaction({
        to: to,
        value: 0n,
        data: data,
      });

      console.log(`⛓️ Published onchain: ${txResult}`);

    } catch (error) {
      console.error('Failed to publish ops:', error);
    }
  }

  stopListening() {
    this.isListening = false;
    console.log('🛑 Stopped GRC-20 OnchainTrust bridge');
  }

  getStatus() {
    return {
      isListening: this.isListening,
      contractAddress: this.contractAddress,
      spaceId: this.spaceId,
      propertyIds: this.propertyIds,
      typeIds: this.typeIds,
    };
  }
}

export default GRC20OnchainTrustBridge;