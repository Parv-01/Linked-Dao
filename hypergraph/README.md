# LinkedDAO Hypergraph Integration

This directory contains the Hypergraph indexing setup for the LinkedDAO OnchainTrustNetwork contract.

## 📁 Directory Structure

```
hypergraph/
├── package.json                 # Hypergraph dependencies
├── hypergraph.config.js         # Main configuration
├── schema.graphql               # GraphQL schema for entities
├── src/
│   └── index.js                 # Event handlers
└── abis/
    └── OnchainTrustNetwork.json # Contract ABI
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd hypergraph
npm install
```

### 2. Deploy Your Contract First

From the root project directory:

```bash
# Deploy the OnchainTrustNetwork contract
npx hardhat run scripts/deploy.js --network <your-network>
```

This will automatically update the `hypergraph.config.js` with the deployed contract address and start block.

### 3. Update Configuration

If not auto-updated, manually edit `hypergraph.config.js`:

- Set the correct `address` (deployed contract address)
- Set the correct `startBlock` (deployment block number)
- Update `rpc` URL for your target network
- Update `id` to match your network

### 4. Start Hypergraph Indexing

```bash
npm run dev
```

This will:
- Start indexing events from your OnchainTrustNetwork contract
- Create a GraphQL server at `http://localhost:5173/graphql`
- Provide a GraphQL playground for testing queries

### 5. Access the GraphQL Playground

Open your browser to `http://localhost:5173/graphql` to:
- Test GraphQL queries
- Browse the schema
- See indexed data

## 📊 Available Entities

### Reviewer
- `id`: Reviewer address
- `address`: Ethereum address
- `approvedAt`: Approval timestamp
- `skillRatingsGiven`: Array of ratings given
- `sponsorships`: Array of sponsorships made

### SkillRating
- `id`: Unique rating ID
- `reviewer`: Reviewer who gave the rating
- `junior`: Address of person rated
- `skillHash`: Hash of skill name
- `rating`: Rating score (0-10)
- `timestamp`: When rating was given

### Sponsorship
- `id`: Unique sponsorship ID
- `sponsor`: Reviewer sponsoring
- `candidate`: Candidate being sponsored
- `jobIdHash`: Job identifier hash
- `creditsUsed`: Credits spent
- `timestamp`: Sponsorship time

### Hiring
- `id`: Unique hiring ID
- `candidate`: Candidate address
- `isHired`: Whether hired
- `timestamp`: Hiring decision time

### Stats
- `totalReviewers`: Count of approved reviewers
- `totalRatings`: Count of skill ratings
- `totalSponsorships`: Count of sponsorships
- `totalHires`: Count of successful hires
- `totalCreditsSpent`: Total credits used

## 🔍 Example Queries

### Get All Reviewers
```graphql
query {
  reviewers {
    id
    address
    approvedAt
    skillRatingsGiven {
      rating
      skillHash
    }
  }
}
```

### Get High-Rated Skills
```graphql
query {
  skillRatings(where: { rating_gte: 8 }) {
    id
    reviewer {
      address
    }
    junior
    rating
    skillHash
  }
}
```

### Get Network Statistics
```graphql
query {
  stats(id: "global") {
    totalReviewers
    totalRatings
    totalSponsorships
    totalHires
    totalCreditsSpent
  }
}
```

### Get User's Ratings
```graphql
query GetUserRatings($userAddress: Bytes!) {
  skillRatings(where: { junior: $userAddress }) {
    rating
    skillHash
    reviewer {
      address
    }
    timestamp
  }
}
```

## 🔧 Configuration

### Networks

Update `hypergraph.config.js` for different networks:

```javascript
// Celo Alfajores Testnet
{
  id: "celo-alfajores",
  rpc: "https://alfajores-forno.celo-testnet.org"
}

// Celo Mainnet
{
  id: "celo-mainnet",
  rpc: "https://forno.celo.org"
}

// Polygon Mumbai
{
  id: "polygon-mumbai",
  rpc: "https://rpc-mumbai.maticvigil.com"
}

// Ethereum Sepolia
{
  id: "ethereum-sepolia",
  rpc: "https://sepolia.infura.io/v3/YOUR_KEY"
}
```

### Events

The config automatically indexes these OnchainTrustNetwork events:
- `ReviewerApproved(address,uint256)`
- `SkillRated(address,address,bytes32,uint8)`
- `CreditsSpent(address,address,bytes32,uint256)`
- `HiringOutcome(address,bool,uint256)`

## 🌐 Frontend Integration

The React frontend includes:
- Apollo Client setup (`src/lib/hypergraph.js`)
- React components (`src/components/TrustNetworkData.jsx`)
- Provider wrapper (`src/providers/HypergraphProvider.jsx`)

### Using in React Components

```jsx
import { useQuery, gql } from '@apollo/client';

const GET_REVIEWERS = gql`
  query {
    reviewers {
      address
      approvedAt
    }
  }
`;

function ReviewersList() {
  const { loading, error, data } = useQuery(GET_REVIEWERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.reviewers.map(reviewer => (
        <li key={reviewer.id}>{reviewer.address}</li>
      ))}
    </ul>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

1. **"ABI not found"**
   - Ensure `OnchainTrustNetwork.json` is copied to `abis/` folder
   - Run: `Copy-Item "artifacts/contracts/OnchainTrustNetwork.sol/OnchainTrustNetwork.json" "hypergraph/abis/"`

2. **"Contract address not set"**
   - Deploy contract first: `npx hardhat run scripts/deploy.js`
   - Update `address` in `hypergraph.config.js`

3. **"No events found"**
   - Check `startBlock` is set to deployment block
   - Ensure contract has emitted events (test with transactions)
   - Verify RPC URL is correct

4. **GraphQL errors**
   - Check Hypergraph server is running on port 5173
   - Verify schema matches contract events
   - Check console for indexing errors

### Debugging

Enable debug logging:
```bash
DEBUG=hypergraph:* npm run dev
```

View raw event logs:
```bash
# Check if events are being emitted
npx hardhat run scripts/test-events.js --network <your-network>
```

## 📚 Resources

- [Hypergraph Documentation](https://hypergraph.network/docs)
- [GraphQL Query Language](https://graphql.org/learn/)
- [Apollo Client React](https://www.apollographql.com/docs/react/)
- [OnchainTrustNetwork Contract](../contracts/OnchainTrustNetwork.sol)