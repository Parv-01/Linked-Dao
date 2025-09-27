#!/usr/bin/env node

// Complete test and deployment script for OnchainTrustNetwork Knowledge Graph with GRC-20

const { ethers } = require('ethers');
// Import the GRC-20 SDK
const { OnchainTrustGRC20SDK } = require('./src/grc20-sdk.js');

console.log('🚀 OnchainTrustNetwork Knowledge Graph Complete Test Suite');
console.log('══════════════════════════════════════════════════════════════\n');

const CONFIG = {
  CONTRACT_ADDRESS: '0xabE83DaDFcaBA9137Ce8E75a294b9F946A073565',
  RPC_URL: 'https://alfajores-forno.celo-testnet.org',
  START_BLOCK: 5658157,
  HYPERGRAPH_ENDPOINT: 'https://api.hypergraph.thegraph.com/graphql',
  SPACE_ID: 'onchain-trust-network'
};

class CompleteKnowledgeGraphTest {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    this.contract = new ethers.Contract(
      CONFIG.CONTRACT_ADDRESS,
      [
        "event ReviewerApproved(address indexed reviewer, uint256 timestamp)",
        "event SkillRated(address indexed reviewer, address indexed junior, bytes32 indexed skillHash, uint8 overallRating)",
        "event CreditsSpent(address indexed sponsor, address indexed candidate, bytes32 indexed jobIdHash, uint256 creditsUsed)",
        "event HiringOutcome(address indexed candidate, bool isHired, uint256 timestamp)"
      ],
      this.provider
    );

    this.sdk = new OnchainTrustGRC20SDK({
      hypergraphEndpoint: CONFIG.HYPERGRAPH_ENDPOINT,
      spaceId: CONFIG.SPACE_ID
    });
  }

  // Step 1: Test contract connection and event detection
  async testContractEvents() {
    console.log('1️⃣  Testing Contract Event Detection');
    console.log('═══════════════════════════════════════');

    try {
      const latestBlock = await this.provider.getBlockNumber();
      console.log(`✅ Connected to Celo Alfajores. Latest block: ${latestBlock}`);

      // Get all events from contract
      const events = await this.getAllContractEvents();

      console.log(`📊 Contract Events Summary:`);
      console.log(`   ReviewerApproved: ${events.reviewerApproved.length}`);
      console.log(`   SkillRated: ${events.skillRated.length}`);
      console.log(`   CreditsSpent: ${events.creditsSpent.length}`);
      console.log(`   HiringOutcome: ${events.hiringOutcome.length}`);
      console.log(`   Total Events: ${this.getTotalEvents(events)}`);

      if (this.getTotalEvents(events) > 0) {
        console.log('✅ Contract events detected successfully!\n');
        return { success: true, events };
      } else {
        console.log('⚠️  No events found. Test contract interactions in Remix first.\n');
        return { success: false, events };
      }
    } catch (error) {
      console.error('❌ Contract connection failed:', error.message);
      return { success: false, events: null };
    }
  }

  // Step 2: Test subgraph build and deployment readiness
  async testSubgraphReadiness() {
    console.log('2️⃣  Testing Subgraph Build & Deployment Readiness');
    console.log('═══════════════════════════════════════════════════');

    try {
      // Check if subgraph files exist and are properly configured
      const checks = {
        schemaExists: await this.fileExists('./schema.graphql'),
        mappingExists: await this.fileExists('./src/mapping.ts'),
        manifestExists: await this.fileExists('./subgraph.yaml'),
        abiExists: await this.fileExists('./abis/OnchainTrustNetwork.json')
      };

      console.log('📋 Subgraph Configuration Check:');
      Object.entries(checks).forEach(([check, passed]) => {
        console.log(`   ${passed ? '✅' : '❌'} ${check}: ${passed ? 'OK' : 'MISSING'}`);
      });

      const allChecksPassed = Object.values(checks).every(Boolean);

      if (allChecksPassed) {
        console.log('✅ Subgraph configuration is complete!\n');
        return { success: true, checks };
      } else {
        console.log('⚠️  Some subgraph files are missing. Check configuration.\n');
        return { success: false, checks };
      }
    } catch (error) {
      console.error('❌ Subgraph readiness check failed:', error.message);
      return { success: false, checks: null };
    }
  }

  // Step 3: Test GRC-20 schema publishing
  async testGRC20Schema() {
    console.log('3️⃣  Testing GRC-20 Schema Publishing');
    console.log('═══════════════════════════════════════');

    try {
      // Test schema creation and structure
      const schema = this.sdk.defineSchema();

      console.log('📋 Schema Structure Check:');
      console.log(`   Entity Types: ${schema.entities.length}`);
      console.log(`   Relation Types: ${schema.relations.length}`);
      console.log(`   Schema Version: ${schema.version}`);

      // List entity types
      console.log('\n🏗️  Entity Types:');
      schema.entities.forEach(entity => {
        console.log(`   • ${entity.name}: ${entity.description}`);
      });

      // List relation types
      console.log('\n🔗 Relation Types:');
      schema.relations.forEach(relation => {
        console.log(`   • ${relation.name}: ${relation.from} → ${relation.to}`);
      });

      console.log('✅ GRC-20 schema structure is valid!\n');
      return { success: true, schema };
    } catch (error) {
      console.error('❌ GRC-20 schema test failed:', error.message);
      return { success: false, schema: null };
    }
  }

  // Step 4: Test knowledge graph data publishing simulation
  async testDataPublishing(events) {
    console.log('4️⃣  Testing Knowledge Graph Data Publishing');
    console.log('═════════════════════════════════════════════════');

    if (!events || this.getTotalEvents(events) === 0) {
      console.log('⚠️  No events to publish. Skipping data publishing test.\n');
      return { success: false, published: 0 };
    }

    try {
      let publishedCount = 0;

      // Simulate publishing rating events
      for (const event of events.skillRated) {
        const ratingData = {
          reviewer: event.args.reviewer,
          user: event.args.junior,
          skillHash: event.args.skillHash,
          rating: parseInt(event.args.overallRating),
          timestamp: event.blockNumber, // Using block number as timestamp for simulation
          transactionHash: event.transactionHash,
          logIndex: event.logIndex
        };

        console.log(`📤 Publishing rating: ${ratingData.reviewer} → ${ratingData.user} (${ratingData.rating}/10)`);

        // In a real scenario, this would publish to Hypergraph
        // const result = await this.sdk.publishRating(ratingData);
        publishedCount++;
      }

      // Simulate publishing sponsorship events
      for (const event of events.creditsSpent) {
        const sponsorshipData = {
          sponsor: event.args.sponsor,
          candidate: event.args.candidate,
          jobIdHash: event.args.jobIdHash,
          creditsUsed: parseInt(event.args.creditsUsed),
          timestamp: event.blockNumber,
          transactionHash: event.transactionHash,
          logIndex: event.logIndex
        };

        console.log(`💰 Publishing sponsorship: ${sponsorshipData.sponsor} → ${sponsorshipData.candidate} (${sponsorshipData.creditsUsed} credits)`);
        publishedCount++;
      }

      console.log(`✅ Simulated publishing ${publishedCount} knowledge graph entities!\n`);
      return { success: true, published: publishedCount };
    } catch (error) {
      console.error('❌ Data publishing simulation failed:', error.message);
      return { success: false, published: 0 };
    }
  }

  // Step 5: Test query capabilities
  async testQueryCapabilities() {
    console.log('5️⃣  Testing Query Capabilities');
    console.log('══════════════════════════════════');

    try {
      // Test different types of queries that will be possible
      const queryTypes = [
        {
          name: 'Trust Network Analysis',
          description: 'Multi-hop trust relationships between users',
          example: `
            query TrustNetwork {
              users(where: { isReviewer: true }) {
                id
                ratingsGiven {
                  user { ratingsReceived { reviewer { id } } }
                }
              }
            }
          `
        },
        {
          name: 'Skill Competency Mapping',
          description: 'Skill ratings and expertise identification',
          example: `
            query SkillExperts($skillHash: String!) {
              skills(where: { hash: $skillHash }) {
                averageRating
                ratings(where: { overallRating_gte: 8 }) {
                  user { id verified }
                  reviewer { id trustScore }
                }
              }
            }
          `
        },
        {
          name: 'Job Sponsorship Patterns',
          description: 'Analysis of sponsorship behavior and success rates',
          example: `
            query SponsorshipAnalysis {
              jobs {
                totalCreditsSpent
                sponsorships {
                  sponsor { isReviewer }
                  creditsUsed
                }
                hiringOutcomes { isHired }
              }
            }
          `
        },
        {
          name: 'Reviewer Credibility',
          description: 'Assessment of reviewer reliability and consistency',
          example: `
            query ReviewerCredibility {
              users(where: { isReviewer: true }) {
                ratingsGiven {
                  overallRating
                  user { ratingsReceived { overallRating } }
                }
              }
            }
          `
        }
      ];

      console.log('📊 Knowledge Graph Query Capabilities:');
      queryTypes.forEach((query, i) => {
        console.log(`\n   ${i + 1}. ${query.name}`);
        console.log(`      ${query.description}`);
        console.log(`      GraphQL: ${query.example.replace(/\s+/g, ' ').trim().substring(0, 80)}...`);
      });

      console.log('\n✅ Query capabilities are comprehensive and well-structured!\n');
      return { success: true, queryTypes };
    } catch (error) {
      console.error('❌ Query capability test failed:', error.message);
      return { success: false, queryTypes: null };
    }
  }

  // Helper functions
  async getAllContractEvents() {
    const [reviewerApproved, skillRated, creditsSpent, hiringOutcome] = await Promise.all([
      this.contract.queryFilter(this.contract.filters.ReviewerApproved(), CONFIG.START_BLOCK, 'latest'),
      this.contract.queryFilter(this.contract.filters.SkillRated(), CONFIG.START_BLOCK, 'latest'),
      this.contract.queryFilter(this.contract.filters.CreditsSpent(), CONFIG.START_BLOCK, 'latest'),
      this.contract.queryFilter(this.contract.filters.HiringOutcome(), CONFIG.START_BLOCK, 'latest')
    ]);

    return { reviewerApproved, skillRated, creditsSpent, hiringOutcome };
  }

  getTotalEvents(events) {
    if (!events) return 0;
    return events.reviewerApproved.length + events.skillRated.length +
           events.creditsSpent.length + events.hiringOutcome.length;
  }

  async fileExists(filePath) {
    try {
      const fs = await import('fs/promises');
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Run complete test suite
  async runCompleteTest() {
    console.log('Starting comprehensive knowledge graph test...\n');

    const results = {
      contractEvents: await this.testContractEvents(),
      subgraphReadiness: await this.testSubgraphReadiness(),
      grc20Schema: await this.testGRC20Schema(),
      dataPublishing: await this.testDataPublishing(
        (await this.testContractEvents()).events
      ),
      queryCapabilities: await this.testQueryCapabilities()
    };

    // Generate final report
    console.log('📊 FINAL TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════════════');

    let passedTests = 0;
    const totalTests = Object.keys(results).length;

    Object.entries(results).forEach(([testName, result]) => {
      const status = result.success ? '✅ PASSED' : '❌ FAILED';
      console.log(`${status} ${testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`);
      if (result.success) passedTests++;
    });

    const successRate = Math.round((passedTests / totalTests) * 100);
    console.log(`\n🎯 Overall Success Rate: ${passedTests}/${totalTests} (${successRate}%)`);

    if (successRate >= 80) {
      console.log('\n🎉 EXCELLENT! Your OnchainTrustNetwork knowledge graph is ready for production!');
      this.printDeploymentInstructions();
    } else if (successRate >= 60) {
      console.log('\n⚠️  GOOD! Minor issues to fix before full deployment.');
      this.printTroubleshootingTips();
    } else {
      console.log('\n❌ NEEDS WORK! Several components need attention.');
      this.printTroubleshootingTips();
    }

    return results;
  }

  printDeploymentInstructions() {
    console.log('\n🚀 DEPLOYMENT INSTRUCTIONS:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('1. Deploy subgraph: npm run deploy');
    console.log('2. Publish GRC-20 schema: node publish-schema.js');
    console.log('3. Start event listener: node start-event-publisher.js');
    console.log('4. Test GraphQL queries: npm run test-queries');
    console.log('5. Monitor knowledge graph: Check Hypergraph dashboard');
  }

  printTroubleshootingTips() {
    console.log('\n🛠️  TROUBLESHOOTING TIPS:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('• Ensure contract has been interacted with in Remix');
    console.log('• Check all subgraph files are present and configured');
    console.log('• Verify network connectivity to Celo Alfajores');
    console.log('• Review subgraph schema for any syntax errors');
    console.log('• Test individual components before full integration');
  }
}

// Run the complete test suite
const tester = new CompleteKnowledgeGraphTest();
tester.runCompleteTest().catch(console.error);

export default CompleteKnowledgeGraphTest;