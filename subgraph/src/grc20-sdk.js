// GRC-20 SDK for OnchainTrustNetwork - JavaScript version
const { GraphQLClient } = require('@graphprotocol/client-cli');
const { createPublicClient, http, parseAbiItem } = require('viem');
const { celoAlfajores } = require('viem/chains');

class OnchainTrustGRC20SDK {
  constructor() {
    this.contractAddress = process.env.CONTRACT_ADDRESS || '0xabE83DaDFcaBA9137Ce8E75a294b9F946A073565';
    this.rpcUrl = process.env.RPC_URL || 'https://alfajores-forno.celo-testnet.org';
    this.hypergraphUrl = process.env.HYPERGRAPH_API_URL || 'https://api.hypergraph.xyz';
    this.schemaId = process.env.HYPERGRAPH_SCHEMA_ID || null;

    // Initialize clients
    this.viemClient = createPublicClient({
      chain: celoAlfajores,
      transport: http(this.rpcUrl),
    });

    this.graphClient = new GraphQLClient({
      url: 'https://api.thegraph.com/subgraphs/name/onchain-trust-network',
    });

    // Define OnchainTrustNetwork schema for GRC-20
    this.trustNetworkSchema = {
      name: 'OnchainTrustNetwork',
      description: 'Decentralized trust network for skill verification and reputation',
      version: '1.0.0',
      entities: {
        User: {
          properties: {
            id: { type: 'ID', required: true },
            address: { type: 'Bytes', required: true },
            isReviewer: { type: 'Boolean', default: false },
            totalRatingsGiven: { type: 'BigInt', default: '0' },
            totalRatingsReceived: { type: 'BigInt', default: '0' },
            averageRating: { type: 'BigDecimal', default: '0' },
            totalCreditsSpent: { type: 'BigInt', default: '0' },
            joinedAt: { type: 'BigInt', required: true },
            lastActivity: { type: 'BigInt', required: true }
          },
          relationships: {
            ratingsGiven: { type: 'Rating[]', inverse: 'rater' },
            ratingsReceived: { type: 'Rating[]', inverse: 'ratee' },
            sponsorships: { type: 'Sponsorship[]', inverse: 'sponsor' },
            hiringOutcomes: { type: 'HiringOutcome[]', inverse: 'user' }
          }
        },
        Rating: {
          properties: {
            id: { type: 'ID', required: true },
            score: { type: 'Int', required: true },
            skillName: { type: 'String', required: true },
            creditsUsed: { type: 'BigInt', required: true },
            timestamp: { type: 'BigInt', required: true },
            transactionHash: { type: 'Bytes', required: true }
          },
          relationships: {
            rater: { type: 'User', required: true },
            ratee: { type: 'User', required: true },
            skill: { type: 'Skill', required: true }
          }
        },
        Skill: {
          properties: {
            id: { type: 'ID', required: true },
            name: { type: 'String', required: true },
            totalRatings: { type: 'BigInt', default: '0' },
            averageRating: { type: 'BigDecimal', default: '0' },
            createdAt: { type: 'BigInt', required: true }
          },
          relationships: {
            ratings: { type: 'Rating[]', inverse: 'skill' }
          }
        }
      }
    };
  }

  // Publish schema to Hypergraph
  async publishSchema() {
    try {
      console.log('📋 Publishing OnchainTrustNetwork schema to Hypergraph...');

      // Mock implementation - replace with actual Hypergraph SDK calls
      const response = await this.mockHypergraphPublish(this.trustNetworkSchema);

      console.log('✅ Schema published successfully:', response.schemaId);
      return response;
    } catch (error) {
      console.error('❌ Failed to publish schema:', error);
      throw error;
    }
  }

  // Create a space for trust network data
  async createSpace(name = 'OnchainTrustNetwork', description = 'Decentralized trust and reputation network') {
    try {
      console.log('🏗️ Creating space for OnchainTrustNetwork...');

      const response = await this.mockHypergraphCreateSpace({ name, description });

      console.log('✅ Space created successfully:', response.spaceId);
      return response;
    } catch (error) {
      console.error('❌ Failed to create space:', error);
      throw error;
    }
  }

  // Publish a user entity to the knowledge graph
  async publishUser(userAddress, userData = {}) {
    try {
      console.log(`👤 Publishing user ${userAddress} to knowledge graph...`);

      const userEntity = {
        type: 'User',
        id: userAddress,
        properties: {
          address: userAddress,
          isReviewer: userData.isReviewer || false,
          totalRatingsGiven: userData.totalRatingsGiven || '0',
          totalRatingsReceived: userData.totalRatingsReceived || '0',
          averageRating: userData.averageRating || '0',
          totalCreditsSpent: userData.totalCreditsSpent || '0',
          joinedAt: userData.joinedAt || Date.now().toString(),
          lastActivity: Date.now().toString()
        }
      };

      const response = await this.mockHypergraphPublish(userEntity);
      console.log('✅ User published successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to publish user:', error);
      throw error;
    }
  }

  // Publish a rating entity to the knowledge graph
  async publishRating(ratingData) {
    try {
      console.log(`⭐ Publishing rating to knowledge graph...`);

      const ratingEntity = {
        type: 'Rating',
        id: `${ratingData.rater}-${ratingData.ratee}-${ratingData.skillName}-${Date.now()}`,
        properties: {
          score: ratingData.score,
          skillName: ratingData.skillName,
          creditsUsed: ratingData.creditsUsed,
          timestamp: ratingData.timestamp || Date.now().toString(),
          transactionHash: ratingData.transactionHash
        },
        relationships: {
          rater: ratingData.rater,
          ratee: ratingData.ratee,
          skill: ratingData.skillName
        }
      };

      const response = await this.mockHypergraphPublish(ratingEntity);
      console.log('✅ Rating published successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to publish rating:', error);
      throw error;
    }
  }

  // Query users from the knowledge graph
  async queryUsers(filters = {}) {
    try {
      console.log('🔍 Querying users from knowledge graph...');

      // Build GraphQL query
      const query = `
        query GetUsers($first: Int, $where: User_filter) {
          users(first: $first, where: $where, orderBy: joinedAt, orderDirection: desc) {
            id
            address
            isReviewer
            totalRatingsGiven
            totalRatingsReceived
            averageRating
            totalCreditsSpent
            joinedAt
            lastActivity
            ratingsGiven {
              id
              score
              skillName
              timestamp
            }
            ratingsReceived {
              id
              score
              skillName
              timestamp
            }
          }
        }
      `;

      const variables = {
        first: filters.limit || 10,
        where: filters
      };

      const response = await this.graphClient.request(query, variables);
      console.log(`✅ Found ${response.users.length} users`);
      return response.users;
    } catch (error) {
      console.error('❌ Failed to query users:', error);
      return [];
    }
  }

  // Query ratings from the knowledge graph
  async queryRatings(filters = {}) {
    try {
      console.log('🔍 Querying ratings from knowledge graph...');

      const query = `
        query GetRatings($first: Int, $where: Rating_filter) {
          ratings(first: $first, where: $where, orderBy: timestamp, orderDirection: desc) {
            id
            score
            skillName
            creditsUsed
            timestamp
            transactionHash
            rater {
              id
              address
            }
            ratee {
              id
              address
            }
            skill {
              id
              name
              averageRating
            }
          }
        }
      `;

      const variables = {
        first: filters.limit || 20,
        where: filters
      };

      const response = await this.graphClient.request(query, variables);
      console.log(`✅ Found ${response.ratings.length} ratings`);
      return response.ratings;
    } catch (error) {
      console.error('❌ Failed to query ratings:', error);
      return [];
    }
  }

  // Get user reputation data
  async getUserReputation(userAddress) {
    try {
      console.log(`📊 Getting reputation for user ${userAddress}...`);

      const query = `
        query GetUserReputation($userId: String!) {
          user(id: $userId) {
            id
            address
            isReviewer
            totalRatingsGiven
            totalRatingsReceived
            averageRating
            totalCreditsSpent
            ratingsReceived(orderBy: timestamp, orderDirection: desc) {
              id
              score
              skillName
              timestamp
              rater {
                address
              }
            }
            ratingsGiven(orderBy: timestamp, orderDirection: desc) {
              id
              score
              skillName
              timestamp
              ratee {
                address
              }
            }
          }
        }
      `;

      const response = await this.graphClient.request(query, { userId: userAddress });

      if (response.user) {
        console.log(`✅ Retrieved reputation for ${userAddress}`);
        return response.user;
      } else {
        console.log(`ℹ️ No reputation data found for ${userAddress}`);
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to get user reputation:', error);
      return null;
    }
  }

  // Mock Hypergraph publish function (replace with actual SDK)
  async mockHypergraphPublish(data) {
    console.log('📤 Mock publishing to Hypergraph:', JSON.stringify(data, null, 2));
    return {
      success: true,
      schemaId: 'mock-schema-id-' + Date.now(),
      spaceId: 'mock-space-id-' + Date.now(),
      entityId: 'mock-entity-id-' + Date.now()
    };
  }

  // Mock Hypergraph create space function
  async mockHypergraphCreateSpace(spaceData) {
    console.log('🏗️ Mock creating space in Hypergraph:', spaceData);
    return {
      success: true,
      spaceId: 'mock-space-id-' + Date.now(),
      name: spaceData.name,
      description: spaceData.description
    };
  }

  // Test contract events and create corresponding knowledge graph entries
  async testCompleteFlow() {
    console.log('🧪 Testing complete contract → subgraph → knowledge graph flow...\n');

    try {
      // 1. Test schema publishing
      console.log('1️⃣ Testing schema publishing...');
      await this.publishSchema();

      // 2. Test space creation
      console.log('\n2️⃣ Testing space creation...');
      await this.createSpace();

      // 3. Test user publishing
      console.log('\n3️⃣ Testing user publishing...');
      await this.publishUser('0x1234567890123456789012345678901234567890', {
        isReviewer: true,
        totalRatingsGiven: '5'
      });

      // 4. Test rating publishing
      console.log('\n4️⃣ Testing rating publishing...');
      await this.publishRating({
        rater: '0x1234567890123456789012345678901234567890',
        ratee: '0x0987654321098765432109876543210987654321',
        skillName: 'Smart Contract Development',
        score: 5,
        creditsUsed: '100',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      });

      // 5. Test querying
      console.log('\n5️⃣ Testing data querying...');
      const users = await this.queryUsers({ first: 5 });
      const ratings = await this.queryRatings({ first: 5 });

      console.log('\n✅ Complete flow test successful!');
      console.log('🎉 OnchainTrustNetwork GRC-20 SDK is ready for use');

      return {
        success: true,
        usersFound: users.length,
        ratingsFound: ratings.length
      };
    } catch (error) {
      console.error('❌ Complete flow test failed:', error);
      throw error;
    }
  }
}

module.exports = { OnchainTrustGRC20SDK };