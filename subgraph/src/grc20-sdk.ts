import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';

// OnchainTrustNetwork GRC-20 SDK for Schema Publishing and Querying
// Based on Hypergraph documentation: https://docs.hypergraph.thegraph.com/

class OnchainTrustGRC20SDK {
  constructor(options = {}) {
    this.config = {
      hypergraphEndpoint: options.hypergraphEndpoint || 'https://api.hypergraph.thegraph.com/graphql',
      spaceId: options.spaceId || 'onchain-trust-network',
      apiKey: options.apiKey || process.env.HYPERGRAPH_API_KEY,
      version: '1.0.0',
      ...options
    };

    this.client = new GraphQLClient(this.config.hypergraphEndpoint, {
      headers: {
        'Authorization': this.config.apiKey ? `Bearer ${this.config.apiKey}` : undefined,
        'Content-Type': 'application/json'
      }
    });

    this.schema = this.defineSchema();
  }

  // Define GRC-20 compatible schema for OnchainTrustNetwork
  defineSchema() {
    return {
      '@context': {
        'trust': 'https://schema.onchaintrustnetwork.com/',
        'graph': 'https://thegraph.com/schema/',
        'grc20': 'https://github.com/graphprotocol/grc/',
        'schema': 'https://schema.org/'
      },
      '@type': 'grc20:Schema',
      'name': 'OnchainTrustNetwork',
      'version': this.config.version,
      'description': 'A decentralized trust network for skill verification and job matching',
      'license': 'MIT',
      'entities': [
        {
          '@type': 'grc20:EntityType',
          'name': 'TrustUser',
          'description': 'A verified user in the trust network',
          'properties': {
            'id': {
              'type': 'string',
              'format': 'ethereum-address',
              'required': true,
              'unique': true,
              'description': 'Ethereum address of the user'
            },
            'verified': {
              'type': 'boolean',
              'default': false,
              'description': 'Self Protocol verification status'
            },
            'isReviewer': {
              'type': 'boolean',
              'default': false,
              'description': 'Can rate other users skills'
            },
            'trustScore': {
              'type': 'number',
              'minimum': 0,
              'maximum': 100,
              'description': 'Calculated trust score based on network activity'
            },
            'reputation': {
              'type': 'number',
              'computed': true,
              'description': 'Aggregated reputation from ratings received'
            },
            'joinedAt': {
              'type': 'string',
              'format': 'date-time',
              'description': 'When the user joined the network'
            }
          }
        },
        {
          '@type': 'grc20:EntityType',
          'name': 'Skill',
          'description': 'A skill that can be rated and verified',
          'properties': {
            'id': {
              'type': 'string',
              'format': 'keccak256-hash',
              'required': true,
              'unique': true
            },
            'name': {
              'type': 'string',
              'description': 'Human readable skill name'
            },
            'category': {
              'type': 'string',
              'enum': ['technical', 'soft', 'language', 'domain'],
              'description': 'Skill category classification'
            },
            'averageRating': {
              'type': 'number',
              'minimum': 1,
              'maximum': 10,
              'computed': true,
              'description': 'Average rating across all reviews'
            },
            'totalRatings': {
              'type': 'integer',
              'minimum': 0,
              'computed': true,
              'description': 'Total number of ratings received'
            },
            'verificationRequirements': {
              'type': 'object',
              'description': 'Requirements for skill verification'
            }
          }
        },
        {
          '@type': 'grc20:EntityType',
          'name': 'Job',
          'description': 'A job opportunity with sponsorship tracking',
          'properties': {
            'id': {
              'type': 'string',
              'format': 'keccak256-hash',
              'required': true,
              'unique': true
            },
            'title': {
              'type': 'string',
              'description': 'Job title'
            },
            'description': {
              'type': 'string',
              'description': 'Job description'
            },
            'requiredSkills': {
              'type': 'array',
              'items': {'type': 'string'},
              'description': 'List of required skill hashes'
            },
            'totalCreditsSpent': {
              'type': 'number',
              'minimum': 0,
              'computed': true,
              'description': 'Total credits invested in this job'
            },
            'totalSponsorships': {
              'type': 'integer',
              'minimum': 0,
              'computed': true,
              'description': 'Number of sponsorship relationships'
            },
            'hiringSuccess': {
              'type': 'boolean',
              'description': 'Whether hiring was successful'
            }
          }
        }
      ],
      'relations': [
        {
          '@type': 'grc20:RelationType',
          'name': 'rates',
          'description': 'A reviewer rates a user for a specific skill',
          'from': 'TrustUser',
          'to': 'TrustUser',
          'via': 'Skill',
          'properties': {
            'rating': {
              'type': 'integer',
              'minimum': 1,
              'maximum': 10,
              'required': true
            },
            'timestamp': {
              'type': 'string',
              'format': 'date-time',
              'required': true
            },
            'transactionHash': {
              'type': 'string',
              'format': 'keccak256-hash',
              'required': true
            },
            'confidence': {
              'type': 'number',
              'minimum': 0,
              'maximum': 1,
              'description': 'Confidence score for this rating'
            }
          }
        },
        {
          '@type': 'grc20:RelationType',
          'name': 'sponsors',
          'description': 'A sponsor supports a candidate for a job',
          'from': 'TrustUser',
          'to': 'TrustUser',
          'via': 'Job',
          'properties': {
            'creditsSpent': {
              'type': 'number',
              'minimum': 0,
              'required': true
            },
            'timestamp': {
              'type': 'string',
              'format': 'date-time',
              'required': true
            },
            'sponsorshipType': {
              'type': 'string',
              'enum': ['skill', 'reputation', 'network', 'financial']
            }
          }
        },
        {
          '@type': 'grc20:RelationType',
          'name': 'hiringOutcome',
          'description': 'The result of a hiring decision',
          'from': 'TrustUser',
          'to': 'Job',
          'properties': {
            'isHired': {
              'type': 'boolean',
              'required': true
            },
            'timestamp': {
              'type': 'string',
              'format': 'date-time',
              'required': true
            },
            'successRate': {
              'type': 'number',
              'minimum': 0,
              'maximum': 1,
              'computed': true
            }
          }
        }
      ]
    };
  }

  // Publish schema to Hypergraph (Public Data)
  async publishSchema() {
    console.log('📤 Publishing OnchainTrustNetwork schema to Hypergraph...');

    const mutation = gql`
      mutation PublishSchema($spaceId: String!, $schema: SchemaInput!) {
        publishSchema(spaceId: $spaceId, schema: $schema) {
          id
          version
          published
          url
          errors {
            message
            path
          }
        }
      }
    `;

    try {
      const result = await this.client.request(mutation, {
        spaceId: this.config.spaceId,
        schema: this.schema
      });

      if (result.publishSchema.errors?.length > 0) {
        console.error('❌ Schema publication errors:', result.publishSchema.errors);
        return false;
      }

      console.log('✅ Schema published successfully!');
      console.log(`   ID: ${result.publishSchema.id}`);
      console.log(`   Version: ${result.publishSchema.version}`);
      console.log(`   URL: ${result.publishSchema.url}`);

      return result.publishSchema;
    } catch (error) {
      console.error('❌ Failed to publish schema:', error);
      return false;
    }
  }

  // Publish rating data to knowledge graph
  async publishRating(ratingData) {
    console.log('📤 Publishing rating data...');

    const mutation = gql`
      mutation PublishRating($spaceId: String!, $data: EntityInput!) {
        publishEntity(spaceId: $spaceId, data: $data) {
          id
          published
          errors {
            message
          }
        }
      }
    `;

    const entityData = {
      '@type': 'grc20:Entity',
      'entityType': 'rates',
      'id': `rating:${ratingData.transactionHash}-${ratingData.logIndex}`,
      'properties': {
        'rating': ratingData.rating,
        'timestamp': new Date(ratingData.timestamp * 1000).toISOString(),
        'transactionHash': ratingData.transactionHash,
        'confidence': ratingData.confidence || 0.8
      },
      'relations': [
        {
          'type': 'rates',
          'from': `user:${ratingData.reviewer}`,
          'to': `user:${ratingData.user}`,
          'via': `skill:${ratingData.skillHash}`
        }
      ]
    };

    try {
      const result = await this.client.request(mutation, {
        spaceId: this.config.spaceId,
        data: entityData
      });

      console.log('✅ Rating published:', result.publishEntity.id);
      return result.publishEntity;
    } catch (error) {
      console.error('❌ Failed to publish rating:', error);
      return false;
    }
  }

  // Publish credits/sponsorship data
  async publishSponsorship(sponsorshipData) {
    console.log('📤 Publishing sponsorship data...');

    const mutation = gql`
      mutation PublishSponsorship($spaceId: String!, $data: EntityInput!) {
        publishEntity(spaceId: $spaceId, data: $data) {
          id
          published
          errors {
            message
          }
        }
      }
    `;

    const entityData = {
      '@type': 'grc20:Entity',
      'entityType': 'sponsors',
      'id': `sponsorship:${sponsorshipData.transactionHash}-${sponsorshipData.logIndex}`,
      'properties': {
        'creditsSpent': sponsorshipData.creditsUsed,
        'timestamp': new Date(sponsorshipData.timestamp * 1000).toISOString(),
        'sponsorshipType': sponsorshipData.sponsorshipType || 'reputation'
      },
      'relations': [
        {
          'type': 'sponsors',
          'from': `user:${sponsorshipData.sponsor}`,
          'to': `user:${sponsorshipData.candidate}`,
          'via': `job:${sponsorshipData.jobIdHash}`
        }
      ]
    };

    try {
      const result = await this.client.request(mutation, {
        spaceId: this.config.spaceId,
        data: entityData
      });

      console.log('✅ Sponsorship published:', result.publishEntity.id);
      return result.publishEntity;
    } catch (error) {
      console.error('❌ Failed to publish sponsorship:', error);
      return false;
    }
  }

  // Query public trust network data
  async queryTrustNetwork(filters = {}) {
    console.log('🔍 Querying trust network data...');

    const query = gql`
      query TrustNetworkQuery($spaceId: String!, $filters: FilterInput) {
        space(id: $spaceId) {
          entities(type: "TrustUser", filters: $filters) {
            id
            properties
            relations {
              type
              target {
                id
                properties
              }
            }
          }
        }
      }
    `;

    try {
      const result = await this.client.request(query, {
        spaceId: this.config.spaceId,
        filters
      });

      return result.space.entities;
    } catch (error) {
      console.error('❌ Failed to query trust network:', error);
      return [];
    }
  }

  // Query skill ratings and competency data
  async querySkillData(skillFilters = {}) {
    console.log('🔍 Querying skill competency data...');

    const query = gql`
      query SkillQuery($spaceId: String!, $filters: FilterInput) {
        space(id: $spaceId) {
          entities(type: "Skill", filters: $filters) {
            id
            properties
            relations {
              type
              properties
              from {
                id
                properties
              }
              to {
                id
                properties
              }
            }
          }
        }
      }
    `;

    try {
      const result = await this.client.request(query, {
        spaceId: this.config.spaceId,
        filters: skillFilters
      });

      return result.space.entities;
    } catch (error) {
      console.error('❌ Failed to query skill data:', error);
      return [];
    }
  }

  // Query private user data (with authentication)
  async queryPrivateUserData(userAddress, apiKey) {
    console.log('🔍 Querying private user data...');

    // Update client with user-specific API key for private data
    const privateClient = new GraphQLClient(this.config.hypergraphEndpoint, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const query = gql`
      query PrivateUserQuery($spaceId: String!, $userAddress: String!) {
        space(id: $spaceId) {
          privateData(userId: $userAddress) {
            personalProfile {
              skills
              preferences
              hiddenRatings
            }
            networkConnections {
              trustedReviewers
              endorsements
            }
          }
        }
      }
    `;

    try {
      const result = await privateClient.request(query, {
        spaceId: this.config.spaceId,
        userAddress
      });

      return result.space.privateData;
    } catch (error) {
      console.error('❌ Failed to query private data:', error);
      return null;
    }
  }

  // Batch publish multiple entities
  async publishBatch(entities) {
    console.log(`📤 Publishing batch of ${entities.length} entities...`);

    const mutation = gql`
      mutation PublishBatch($spaceId: String!, $entities: [EntityInput!]!) {
        publishBatch(spaceId: $spaceId, entities: $entities) {
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
        spaceId: this.config.spaceId,
        entities
      });

      console.log(`✅ Batch published: ${result.publishBatch.successful} successful, ${result.publishBatch.failed} failed`);
      return result.publishBatch;
    } catch (error) {
      console.error('❌ Failed to publish batch:', error);
      return { successful: 0, failed: entities.length };
    }
  }

  // Create a public space for the trust network
  async createSpace(spaceConfig = {}) {
    console.log('🌐 Creating public space for OnchainTrustNetwork...');

    const mutation = gql`
      mutation CreateSpace($config: SpaceConfigInput!) {
        createSpace(config: $config) {
          id
          name
          public
          url
          schema {
            version
          }
        }
      }
    `;

    const defaultConfig = {
      id: this.config.spaceId,
      name: 'OnchainTrustNetwork',
      description: 'A decentralized trust network for skill verification and job matching',
      public: true,
      schema: this.schema,
      permissions: {
        read: 'public',
        write: 'authenticated',
        admin: 'owner'
      },
      ...spaceConfig
    };

    try {
      const result = await this.client.request(mutation, {
        config: defaultConfig
      });

      console.log('✅ Space created successfully!');
      console.log(`   ID: ${result.createSpace.id}`);
      console.log(`   URL: ${result.createSpace.url}`);

      return result.createSpace;
    } catch (error) {
      console.error('❌ Failed to create space:', error);
      return false;
    }
  }

  // Get space information and statistics
  async getSpaceInfo() {
    const query = gql`
      query SpaceInfo($spaceId: String!) {
        space(id: $spaceId) {
          id
          name
          public
          schema {
            version
            entities
          }
          statistics {
            totalEntities
            totalRelations
            lastUpdated
          }
        }
      }
    `;

    try {
      const result = await this.client.request(query, {
        spaceId: this.config.spaceId
      });

      return result.space;
    } catch (error) {
      console.error('❌ Failed to get space info:', error);
      return null;
    }
  }
}

export default OnchainTrustGRC20SDK;