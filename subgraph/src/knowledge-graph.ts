import dotenv from 'dotenv';
import OnchainTrustPublisher from './data-publisher.js';
import TrustNetworkQuerier, { TrustNetworkAnalytics } from './query-interface.js';

dotenv.config();

// Configuration for The Graph's public knowledge graph
const CONFIG = {
  // The Graph endpoints (replace with actual endpoints when available)
  GRAPH_ENDPOINT: process.env.GRAPH_ENDPOINT || 'https://api.thegraph.com/public-data',
  HYPERGRAPH_ENDPOINT: process.env.HYPERGRAPH_ENDPOINT || 'https://hypergraph.thegraph.com/graphql',

  // Contract configuration
  RPC_URL: 'https://alfajores-forno.celo-testnet.org',
  CONTRACT_ADDRESS: '0xabE83DaDFcaBA9137Ce8E75a294b9F946A073565',
  START_BLOCK: 5658157,

  // Knowledge graph space
  SPACE_ID: 'onchain-trust-network',
  AUTH_TOKEN: process.env.GRAPH_AUTH_TOKEN,
};

// Space Manager for organizing knowledge graph data
export class SpaceManager {
  private publisher: OnchainTrustPublisher;
  private querier: TrustNetworkQuerier;
  private analytics: TrustNetworkAnalytics;

  constructor() {
    this.publisher = new OnchainTrustPublisher(
      CONFIG.HYPERGRAPH_ENDPOINT,
      CONFIG.SPACE_ID,
      CONFIG.RPC_URL,
      CONFIG.CONTRACT_ADDRESS,
      CONFIG.AUTH_TOKEN
    );

    this.querier = new TrustNetworkQuerier(
      CONFIG.HYPERGRAPH_ENDPOINT,
      CONFIG.SPACE_ID
    );

    this.analytics = new TrustNetworkAnalytics(this.querier);
  }

  // Initialize the complete knowledge graph system
  async initialize(): Promise<void> {
    console.log('🚀 Initializing OnchainTrust Knowledge Graph System...\n');

    try {
      // 1. Publish schema to public knowledge graph
      console.log('📋 Publishing schema...');
      const schemaPublished = await this.publisher.initialize();
      if (!schemaPublished) {
        throw new Error('Failed to publish schema');
      }
      console.log('✅ Schema published successfully\n');

      // 2. Start event listener for real-time data publishing
      console.log('🎧 Starting event listener...');
      await this.publisher.startEventListener(CONFIG.START_BLOCK);
      console.log('✅ Event listener started\n');

      console.log('🎉 Knowledge graph system initialized successfully!');
      console.log(`📊 Public data available at: ${CONFIG.HYPERGRAPH_ENDPOINT}`);
      console.log(`🔍 Space ID: ${CONFIG.SPACE_ID}\n`);

    } catch (error) {
      console.error('❌ Failed to initialize knowledge graph system:', error);
      throw error;
    }
  }

  // Query public trust network data
  async queryTrustNetwork(): Promise<void> {
    console.log('🔍 Querying public trust network data...\n');

    try {
      // Get most trusted reviewers
      console.log('👥 Most Trusted Reviewers:');
      const trustedReviewers = await this.querier.getMostTrustedReviewers(5);
      trustedReviewers.forEach((reviewer: any, index: number) => {
        console.log(`  ${index + 1}. ${reviewer.properties.address} (Trust Score: ${reviewer.properties.trustScore})`);
      });
      console.log();

      // Get skill competency map
      console.log('🎯 Skill Competency Overview:');
      const skillClusters = await this.analytics.identifySkillClusters();
      skillClusters.forEach((cluster: any) => {
        console.log(`  📂 ${cluster.category}: ${cluster.clusterSize} skills, Avg Competency: ${cluster.avgCompetency.toFixed(2)}`);
      });
      console.log();

      // Get hiring success rates
      console.log('📈 Hiring Success Analysis:');
      const hiringData = await this.querier.getHiringSuccessRates();
      const totalOutcomes = hiringData.length;
      const successfulHires = hiringData.filter((outcome: any) => outcome.properties.isHired).length;
      const successRate = totalOutcomes > 0 ? (successfulHires / totalOutcomes * 100).toFixed(2) : 'N/A';
      console.log(`  🎯 Overall Success Rate: ${successRate}% (${successfulHires}/${totalOutcomes})`);
      console.log();

    } catch (error) {
      console.error('❌ Failed to query trust network:', error);
    }
  }

  // Analyze specific user's trust profile
  async analyzeUser(userAddress: string): Promise<void> {
    console.log(`🔬 Analyzing user: ${userAddress}\n`);

    try {
      // Calculate trust propagation
      const trustScore = await this.analytics.calculateTrustPropagation(userAddress);
      console.log(`🎯 Trust Score: ${trustScore.toFixed(2)}/10`);

      // Predict hiring success
      const hiringProbability = await this.analytics.predictHiringSuccess(userAddress);
      console.log(`📈 Hiring Success Probability: ${(hiringProbability * 100).toFixed(2)}%`);

      // Get network effect analysis
      const networkData = await this.querier.getNetworkEffectAnalysis(userAddress);

      console.log('\n📊 Network Analysis:');
      console.log(`  ⭐ Direct Ratings: ${networkData.directRatings?.length || 0}`);
      console.log(`  💰 Sponsorships: ${networkData.sponsorships?.length || 0}`);
      console.log(`  🎯 Hiring Outcomes: ${networkData.hiringOutcomes?.length || 0}`);

      if (networkData.directRatings && networkData.directRatings.length > 0) {
        const avgRating = networkData.directRatings.reduce((sum: number, rating: any) =>
          sum + rating.properties.rating, 0
        ) / networkData.directRatings.length;
        console.log(`  📊 Average Rating: ${avgRating.toFixed(2)}/10`);
      }

    } catch (error) {
      console.error('❌ Failed to analyze user:', error);
    }
  }

  // Get schema information
  async getSchemaInfo(): Promise<void> {
    console.log('📋 Knowledge Graph Schema Information:\n');

    try {
      const schema = await this.querier.getSchemaInfo();

      console.log(`📖 Name: ${schema.name}`);
      console.log(`🔄 Version: ${schema.version}`);
      console.log(`📝 Description: ${schema.description}\n`);

      console.log('🏗️  Entity Types:');
      schema.entities.forEach((entity: any) => {
        console.log(`  • ${entity.name}: ${entity.description}`);
      });

      console.log('\n🔗 Relationship Types:');
      schema.relationships.forEach((rel: any) => {
        console.log(`  • ${rel.name}: ${rel.from} → ${rel.to}`);
      });

    } catch (error) {
      console.error('❌ Failed to get schema info:', error);
    }
  }

  // Advanced analytics dashboard
  async runAnalyticsDashboard(): Promise<void> {
    console.log('📊 OnchainTrust Analytics Dashboard\n');
    console.log('=' .repeat(50));

    try {
      // Overall network statistics
      const users = await this.querier.getUsersWithTrustScores(0);
      const skillData = await this.querier.getSkillCompetencyMap();
      const sponsorships = await this.querier.getSponsorshipPatterns();

      console.log('\n📈 Network Statistics:');
      console.log(`  👥 Total Users: ${users.length}`);
      console.log(`  🎯 Total Skills: ${skillData.length}`);
      console.log(`  💰 Total Sponsorships: ${sponsorships.length}`);

      // Trust distribution
      const trustScores = users.map((user: any) => user.properties.trustScore || 0);
      const avgTrust = trustScores.reduce((sum: number, score: number) => sum + score, 0) / trustScores.length;
      console.log(`  🎯 Average Trust Score: ${avgTrust.toFixed(2)}`);

      // Skill popularity
      const skillsByRatings = skillData
        .sort((a: any, b: any) => b.properties.totalRatings - a.properties.totalRatings)
        .slice(0, 5);

      console.log('\n🔥 Most Popular Skills:');
      skillsByRatings.forEach((skill: any, index: number) => {
        console.log(`  ${index + 1}. ${skill.properties.name || skill.id} (${skill.properties.totalRatings} ratings)`);
      });

      // Network growth
      console.log('\n📊 Network Health:');
      const verifiedUsers = users.filter((user: any) => user.properties.verified).length;
      const reviewers = users.filter((user: any) => user.properties.isReviewer).length;

      console.log(`  ✅ Verified Users: ${verifiedUsers}/${users.length} (${(verifiedUsers/users.length*100).toFixed(1)}%)`);
      console.log(`  👨‍💼 Reviewers: ${reviewers}/${users.length} (${(reviewers/users.length*100).toFixed(1)}%)`);

    } catch (error) {
      console.error('❌ Failed to run analytics dashboard:', error);
    }
  }
}

// CLI interface for interacting with the knowledge graph
async function main() {
  const spaceManager = new SpaceManager();

  const command = process.argv[2];
  const param = process.argv[3];

  switch (command) {
    case 'init':
      await spaceManager.initialize();
      break;

    case 'query':
      await spaceManager.queryTrustNetwork();
      break;

    case 'analyze':
      if (!param) {
        console.log('❌ Please provide a user address to analyze');
        process.exit(1);
      }
      await spaceManager.analyzeUser(param);
      break;

    case 'schema':
      await spaceManager.getSchemaInfo();
      break;

    case 'dashboard':
      await spaceManager.runAnalyticsDashboard();
      break;

    default:
      console.log('🎯 OnchainTrust Knowledge Graph CLI\n');
      console.log('Usage:');
      console.log('  node knowledge-graph.js init              # Initialize knowledge graph');
      console.log('  node knowledge-graph.js query             # Query public data');
      console.log('  node knowledge-graph.js analyze <address> # Analyze user profile');
      console.log('  node knowledge-graph.js schema            # Show schema info');
      console.log('  node knowledge-graph.js dashboard         # Analytics dashboard');
      console.log('\nExamples:');
      console.log('  node knowledge-graph.js analyze 0x1234... # Analyze specific user');
      console.log('  node knowledge-graph.js dashboard         # View network analytics');
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SpaceManager, CONFIG };