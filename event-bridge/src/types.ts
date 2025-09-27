// OnchainTrustNetwork Contract Types and ABI
export const ONCHAIN_TRUST_NETWORK_ABI = [
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "reviewer", "type": "address"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "ReviewerApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "reviewer", "type": "address"},
      {"indexed": true, "name": "junior", "type": "address"},
      {"indexed": true, "name": "skillHash", "type": "bytes32"},
      {"indexed": false, "name": "overallRating", "type": "uint8"}
    ],
    "name": "SkillRated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "sponsor", "type": "address"},
      {"indexed": true, "name": "candidate", "type": "address"},
      {"indexed": true, "name": "jobIdHash", "type": "bytes32"},
      {"indexed": false, "name": "creditsUsed", "type": "uint256"}
    ],
    "name": "CreditsSpent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "candidate", "type": "address"},
      {"indexed": false, "name": "isHired", "type": "bool"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "HiringOutcome",
    "type": "event"
  },
  // View functions
  {
    "inputs": [{"name": "_input", "type": "string"}],
    "name": "getHash",
    "outputs": [{"name": "", "type": "bytes32"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReviewerPool",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Event type definitions
export interface ReviewerApprovedEvent {
  reviewer: string;
  timestamp: bigint;
  blockNumber: bigint;
  transactionHash: string;
}

export interface SkillRatedEvent {
  reviewer: string;
  junior: string;
  skillHash: string;
  overallRating: number;
  blockNumber: bigint;
  transactionHash: string;
}

export interface CreditsSpentEvent {
  sponsor: string;
  candidate: string;
  jobIdHash: string;
  creditsUsed: bigint;
  blockNumber: bigint;
  transactionHash: string;
}

export interface HiringOutcomeEvent {
  candidate: string;
  isHired: boolean;
  timestamp: bigint;
  blockNumber: bigint;
  transactionHash: string;
}

// Configuration interface
export interface BridgeConfig {
  contractAddress: string;
  rpcUrl: string;
  chainId: number;
  publicSpaceId: string;
  hypergraphEndpoint: string;
  startBlock: bigint | 'latest';
  pollInterval: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  privateKey?: string;
  mnemonic?: string;
}