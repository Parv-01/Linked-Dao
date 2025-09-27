# OnchainTrustNetwork Knowledge Graph Setup Guide

## 🎯 Overview
Your OnchainTrustNetwork subgraph is ready to create a comprehensive knowledge graph that tracks:
- **Trust relationships** between users
- **Skill ratings** and competency networks  
- **Job sponsorships** and hiring patterns
- **Verification status** through Self Protocol

## ✅ Current Status

### Schema & Mappings ✅
- **Schema**: Properly defined GraphQL entities with relationships
- **Mappings**: Event handlers ready for all contract events
- **Build**: Subgraph compiles successfully
- **Network Config**: Correctly configured for Celo Alfajores

### Contract Integration ✅
- **Contract Address**: `0xabE83DaDFcaBA9137Ce8E75a294b9F946A073565`
- **Network**: Celo Alfajores (Testnet)
- **Start Block**: 5658157
- **Events Monitored**: ReviewerApproved, SkillRated, CreditsSpent, HiringOutcome

## 🚀 Deployment Steps

### 1. Initialize Hypergraph Project
```bash
npm run hg:init
```

### 2. Configure TypeSync (Visual Schema Management)
```bash
npm run hg:typesync
```
This opens TypeSync at http://localhost:3000 where you can:
- Visualize your knowledge graph schema
- Manage entity types and relationships
- Publish schema to Hypergraph

### 3. Deploy to Hypergraph
```bash
npm run hg:deploy
```

### 4. Create a Public Space
Visit https://thegraph.com/explorer and create a space for your knowledge graph.

## 📊 Knowledge Graph Structure

### Entities (Nodes)
```graphql
User {
  id: Ethereum address
  verified: Self Protocol status
  isReviewer: Can rate others
  ratingsGiven: [Rating relationships]
  ratingsReceived: [Rating relationships]
}

Skill {
  id: Skill hash
  averageRating: Calculated from all ratings
  totalRatings: Number of times rated
}

Job {
  id: Job hash  
  totalCreditsSpent: Investment amount
  totalSponsorships: Number of sponsors
}
```

### Relationships (Edges)
```graphql
Rating: (Reviewer) -rates-> (User) for (Skill)
Sponsorship: (Sponsor) -sponsors-> (Candidate) for (Job)
HiringOutcome: (Candidate) -outcome-> (Job)
```

## 🔗 GraphQL Query Examples

### Find Top JavaScript Developers
```graphql
query TopJavaScriptDevs {
  skills(where: { hash: "0x..." }) { # JavaScript skill hash
    ratings(
      orderBy: overallRating
      orderDirection: desc
      where: { overallRating_gte: 8 }
    ) {
      user {
        id
        verified
      }
      overallRating
      reviewer {
        id
      }
    }
  }
}
```

### Analyze Sponsorship Patterns
```graphql
query SponsorshipAnalysis {
  jobs(orderBy: totalCreditsSpent, orderDirection: desc) {
    id
    totalCreditsSpent
    totalSponsorships
    sponsorships {
      sponsor {
        id
        isReviewer
      }
      candidate {
        id
        ratingsReceived {
          overallRating
        }
      }
      creditsUsed
    }
  }
}
```

### Trust Network Analysis  
```graphql
query TrustNetwork {
  users(where: { isReviewer: true }) {
    id
    verified
    ratingsGiven {
      user {
        id
      }
      overallRating
      skill {
        averageRating
      }
    }
  }
}
```

## 🎭 Testing the Knowledge Graph

### Generate Test Events
To populate your knowledge graph with data, interact with the contract:

1. **Approve Reviewers** (DAO Admin only)
   - Calls `approveReviewer(address)`
   - Creates User and Reviewer nodes

2. **Rate Skills** (Verified Reviewers)
   - Calls `rateJunior(address, bytes32, uint8)`
   - Creates Rating relationships and Skill nodes

3. **Sponsor Applications** (Verified Reviewers)
   - Calls `sponsorApplication(address, bytes32, uint256)`
   - Creates Sponsorship relationships and Job nodes

4. **Record Hiring** (DAO Admin only)
   - Calls `recordHiringOutcome(address, bool)`
   - Creates HiringOutcome relationships

### Monitor Events
```bash
node test-contract.js  # Check for contract events
```

## 🌐 Hypergraph Benefits

### Traditional Approach vs Knowledge Graph

**Before (Traditional Database):**
```sql
SELECT * FROM ratings WHERE skill = 'JavaScript' AND rating > 8;
```

**After (Knowledge Graph):**
```graphql
# Query across relationships and calculate trust scores
query TrustedJavaScriptExperts {
  skills(where: { hash: "0x..." }) {
    ratings(where: { overallRating_gte: 8 }) {
      user {
        id
        verified
        ratingsReceived(where: { overallRating_gte: 7 }) {
          reviewer {
            ratingsGiven(where: { overallRating_gte: 8 }) {
              # Multi-hop trust analysis
            }
          }
        }
      }
    }
  }
}
```

### Advanced Analytics Possible:
- **Trust Propagation**: How trust flows through the network
- **Skill Correlation**: Which skills are often rated together  
- **Hiring Success Prediction**: Based on rating patterns
- **Reviewer Reliability**: Consistency of ratings over time
- **Network Effects**: How sponsorships influence hiring

## 🔧 Troubleshooting

### No Events Found
- Ensure contract interactions are happening
- Check if events are being emitted on the correct network
- Verify subgraph is deployed and syncing

### Build Errors  
- Run `npm run codegen` to regenerate types
- Check schema.graphql for syntax errors
- Verify mapping.ts imports are correct

### Deployment Issues
- Ensure Hypergraph CLI is installed: `npm install -g hypergraph`
- Check network configuration in subgraph.yaml
- Verify contract ABI is correct in abis/ folder

## 📈 Next Steps

1. **Deploy** your subgraph to Hypergraph
2. **Interact** with your contract to generate events  
3. **Query** your knowledge graph via GraphQL
4. **Visualize** trust networks and skill relationships
5. **Build** applications that leverage the knowledge graph

Your OnchainTrustNetwork is now ready to create a comprehensive knowledge graph of trust relationships! 🎉