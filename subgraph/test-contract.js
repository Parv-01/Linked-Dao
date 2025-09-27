import { ethers } from 'ethers';

// Test script to verify OnchainTrustNetwork contract interaction and subgraph functionality

const CELO_SEPOLIA_RPC = 'https://alfajores-forno.celo-testnet.org';
const CONTRACT_ADDRESS = '0xabE83DaDFcaBA9137Ce8E75a294b9F946A073565';

// Contract ABI (events only for verification)
const CONTRACT_ABI = [
  "event ReviewerApproved(address indexed reviewer, uint256 timestamp)",
  "event SkillRated(address indexed reviewer, address indexed junior, bytes32 indexed skillHash, uint8 overallRating)",
  "event CreditsSpent(address indexed sponsor, address indexed candidate, bytes32 indexed jobIdHash, uint256 creditsUsed)",
  "event HiringOutcome(address indexed candidate, bool isHired, uint256 timestamp)"
];

async function testContractEvents() {
  try {
    console.log('🔍 Testing OnchainTrustNetwork contract event listening...\n');

    // Create provider
    const provider = new ethers.JsonRpcProvider(CELO_SEPOLIA_RPC);
    
    // Create contract interface
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log('📡 Connected to Celo Sepolia network');
    console.log('📄 Contract Address:', CONTRACT_ADDRESS);
    console.log('🏁 Starting Block:', 5658157);

    // Get latest block for context
    const latestBlock = await provider.getBlockNumber();
    console.log('📊 Latest Block:', latestBlock);
    
    console.log('\n🔎 Querying past events...\n');

    // Query recent events from the contract
    const fromBlock = 5658157; // Deployment block
    const toBlock = 'latest';

    try {
      // Check for ReviewerApproved events
      const reviewerEvents = await contract.queryFilter(
        contract.filters.ReviewerApproved(),
        fromBlock,
        toBlock
      );
      console.log('👥 ReviewerApproved events found:', reviewerEvents.length);
      reviewerEvents.forEach((event, i) => {
        console.log(`   ${i + 1}. Reviewer: ${event.args[0]} at block ${event.blockNumber}`);
      });

      // Check for SkillRated events
      const ratingEvents = await contract.queryFilter(
        contract.filters.SkillRated(),
        fromBlock,
        toBlock
      );
      console.log('⭐ SkillRated events found:', ratingEvents.length);
      ratingEvents.forEach((event, i) => {
        console.log(`   ${i + 1}. Reviewer: ${event.args[0]}, Rated: ${event.args[1]}, Rating: ${event.args[3]} at block ${event.blockNumber}`);
      });

      // Check for CreditsSpent events
      const sponsorEvents = await contract.queryFilter(
        contract.filters.CreditsSpent(),
        fromBlock,
        toBlock
      );
      console.log('💰 CreditsSpent events found:', sponsorEvents.length);
      sponsorEvents.forEach((event, i) => {
        console.log(`   ${i + 1}. Sponsor: ${event.args[0]}, Candidate: ${event.args[1]}, Credits: ${event.args[3]} at block ${event.blockNumber}`);
      });

      // Check for HiringOutcome events
      const hiringEvents = await contract.queryFilter(
        contract.filters.HiringOutcome(),
        fromBlock,
        toBlock
      );
      console.log('🎯 HiringOutcome events found:', hiringEvents.length);
      hiringEvents.forEach((event, i) => {
        console.log(`   ${i + 1}. Candidate: ${event.args[0]}, Hired: ${event.args[1]} at block ${event.blockNumber}`);
      });

      console.log('\n✅ Contract event listening test completed successfully!');
      
      if (reviewerEvents.length > 0 || ratingEvents.length > 0 || sponsorEvents.length > 0 || hiringEvents.length > 0) {
        console.log('\n🎉 Events detected! Your subgraph should be able to process these events and create knowledge graph nodes.');
      } else {
        console.log('\n⚠️  No events found yet. You can test by:');
        console.log('   1. Approving new reviewers (as DAO admin)');
        console.log('   2. Rating skills (as verified reviewer)');
        console.log('   3. Sponsoring applications (as verified reviewer)');
        console.log('   4. Recording hiring outcomes (as DAO admin)');
      }

    } catch (eventError) {
      console.error('❌ Error querying events:', eventError);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// GraphQL query examples for testing the subgraph
function printGraphQLQueries() {
  console.log('\n📋 GraphQL Queries for testing your Hypergraph subgraph:\n');
  
  console.log('1️⃣ Get all users with their reviewer status:');
  console.log(`
query GetUsers {
  users {
    id
    verified
    isReviewer
    ratingsGiven {
      id
      overallRating
      skill {
        id
        averageRating
      }
    }
    ratingsReceived {
      id
      overallRating
    }
  }
}
`);

  console.log('2️⃣ Get all skills with their ratings:');
  console.log(`
query GetSkills {
  skills {
    id
    hash
    averageRating
    totalRatings
    ratings {
      id
      reviewer {
        id
      }
      user {
        id
      }
      overallRating
      timestamp
    }
  }
}
`);

  console.log('3️⃣ Get all sponsorships and job data:');
  console.log(`
query GetSponsorships {
  sponsorships {
    id
    sponsor {
      id
      isReviewer
    }
    candidate {
      id
    }
    job {
      id
      totalCreditsSpent
      totalSponsorships
    }
    creditsUsed
    timestamp
  }
}
`);

  console.log('4️⃣ Get hiring outcomes:');
  console.log(`
query GetHiringOutcomes {
  hiringOutcomes {
    id
    candidate {
      id
      verified
    }
    isHired
    timestamp
    transactionHash
  }
}
`);
}

// Run the test
testContractEvents().then(() => {
  printGraphQLQueries();
});