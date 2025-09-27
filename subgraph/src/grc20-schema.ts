import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

// GRC-20 Knowledge Graph Schema for OnchainTrustNetwork
// This defines the public data structure and relationships

export interface TrustNetworkEntity {
  id: string;
  type: string;
  properties: Record<string, any>;
  relationships: Relationship[];
  metadata: EntityMetadata;
}

export interface Relationship {
  type: string;
  target: string;
  properties: Record<string, any>;
  direction: 'outgoing' | 'incoming' | 'bidirectional';
}

export interface EntityMetadata {
  createdAt: string;
  updatedAt: string;
  source: 'onchain' | 'computed' | 'hybrid';
  verification: VerificationStatus;
  trustScore?: number;
}

export interface VerificationStatus {
  selfProtocol: boolean;
  onchainProof: string;
  verificationTimestamp: string;
}

// Core entity types for the trust network
export const ENTITY_TYPES = {
  USER: 'trust:User',
  SKILL: 'trust:Skill',
  JOB: 'trust:Job',
  ORGANIZATION: 'trust:Organization',
  REVIEWER: 'trust:Reviewer'
} as const;

// Relationship types following GRC-20 standards
export const RELATIONSHIP_TYPES = {
  RATES: 'trust:rates',
  SPONSORS: 'trust:sponsors',
  HIRED_BY: 'trust:hiredBy',
  VERIFIED_BY: 'trust:verifiedBy',
  ENDORSES: 'trust:endorses',
  COLLABORATES_WITH: 'trust:collaboratesWith'
} as const;

// GRC-20 Schema Definition
export const TRUST_NETWORK_SCHEMA = {
  '@context': {
    'trust': 'https://schema.onchaintrustnetwork.com/',
    'graph': 'https://thegraph.com/schema/',
    'self': 'https://self.xyz/schema/'
  },
  '@type': 'graph:Schema',
  'name': 'OnchainTrustNetwork',
  'version': '1.0.0',
  'description': 'A knowledge graph for tracking trust relationships, skill verification, and hiring outcomes',
  'entities': [
    {
      '@type': 'graph:EntityType',
      'name': ENTITY_TYPES.USER,
      'description': 'A verified user in the trust network',
      'properties': {
        'address': { type: 'string', required: true, unique: true },
        'verified': { type: 'boolean', default: false },
        'isReviewer': { type: 'boolean', default: false },
        'trustScore': { type: 'number', min: 0, max: 100 },
        'joinedAt': { type: 'timestamp' },
        'reputation': { type: 'number', computed: true }
      }
    },
    {
      '@type': 'graph:EntityType',
      'name': ENTITY_TYPES.SKILL,
      'description': 'A skill that can be rated and verified',
      'properties': {
        'skillHash': { type: 'string', required: true, unique: true },
        'name': { type: 'string' },
        'category': { type: 'string' },
        'averageRating': { type: 'number', min: 1, max: 10, computed: true },
        'totalRatings': { type: 'number', computed: true },
        'verificationRequirements': { type: 'object' }
      }
    },
    {
      '@type': 'graph:EntityType',
      'name': ENTITY_TYPES.JOB,
      'description': 'A job opportunity with sponsorship tracking',
      'properties': {
        'jobHash': { type: 'string', required: true, unique: true },
        'title': { type: 'string' },
        'description': { type: 'string' },
        'requiredSkills': { type: 'array', items: 'string' },
        'totalCreditsSpent': { type: 'number', computed: true },
        'totalSponsorships': { type: 'number', computed: true },
        'hiringSuccess': { type: 'boolean' }
      }
    }
  ],
  'relationships': [
    {
      '@type': 'graph:RelationshipType',
      'name': RELATIONSHIP_TYPES.RATES,
      'description': 'A reviewer rates a user for a specific skill',
      'from': ENTITY_TYPES.USER,
      'to': ENTITY_TYPES.USER,
      'via': ENTITY_TYPES.SKILL,
      'properties': {
        'rating': { type: 'number', min: 1, max: 10, required: true },
        'timestamp': { type: 'timestamp', required: true },
        'transactionHash': { type: 'string', required: true },
        'confidence': { type: 'number', min: 0, max: 1 }
      }
    },
    {
      '@type': 'graph:RelationshipType',
      'name': RELATIONSHIP_TYPES.SPONSORS,
      'description': 'A sponsor supports a candidate for a job',
      'from': ENTITY_TYPES.USER,
      'to': ENTITY_TYPES.USER,
      'via': ENTITY_TYPES.JOB,
      'properties': {
        'creditsSpent': { type: 'number', min: 0, required: true },
        'timestamp': { type: 'timestamp', required: true },
        'transactionHash': { type: 'string', required: true },
        'sponsorshipType': { type: 'string', enum: ['skill', 'reputation', 'network'] }
      }
    }
  ]
};

// GraphQL client for publishing to The Graph
export class TrustNetworkPublisher {
  private client: GraphQLClient;
  private spaceId: string;

  constructor(endpoint: string, spaceId: string, authToken?: string) {
    this.client = new GraphQLClient(endpoint, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
    });
    this.spaceId = spaceId;
  }

  // Publish schema to public knowledge graph
  async publishSchema(): Promise<boolean> {
    const mutation = `
      mutation PublishSchema($schema: SchemaInput!, $spaceId: String!) {
        publishSchema(schema: $schema, spaceId: $spaceId) {
          id
          version
          published
        }
      }
    `;

    try {
      const result = await this.client.request(mutation, {
        schema: TRUST_NETWORK_SCHEMA,
        spaceId: this.spaceId
      });
      console.log('✅ Schema published successfully:', result);
      return true;
    } catch (error) {
      console.error('❌ Failed to publish schema:', error);
      return false;
    }
  }

  // Publish entity to public knowledge graph
  async publishEntity(entity: TrustNetworkEntity): Promise<boolean> {
    const mutation = `
      mutation PublishEntity($entity: EntityInput!, $spaceId: String!) {
        publishEntity(entity: $entity, spaceId: $spaceId) {
          id
          published
        }
      }
    `;

    try {
      const result = await this.client.request(mutation, {
        entity,
        spaceId: this.spaceId
      });
      console.log('✅ Entity published:', entity.id);
      return true;
    } catch (error) {
      console.error('❌ Failed to publish entity:', error);
      return false;
    }
  }

  // Publish multiple entities as a batch
  async publishBatch(entities: TrustNetworkEntity[]): Promise<number> {
    const mutation = `
      mutation PublishBatch($entities: [EntityInput!]!, $spaceId: String!) {
        publishBatch(entities: $entities, spaceId: $spaceId) {
          successful
          failed
          results {
            id
            published
            error
          }
        }
      }
    `;

    try {
      const result = await this.client.request(mutation, {
        entities,
        spaceId: this.spaceId
      });
      console.log(`✅ Batch published: ${result.publishBatch.successful} successful, ${result.publishBatch.failed} failed`);
      return result.publishBatch.successful;
    } catch (error) {
      console.error('❌ Failed to publish batch:', error);
      return 0;
    }
  }
}

export default TrustNetworkPublisher;