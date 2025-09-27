# OnchainTrustNetwork Event Bridge

A service that listens to OnchainTrustNetwork smart contract events and publishes structured data to the Hypergraph knowledge graph.

## 🏗️ Architecture

```
OnchainTrustNetwork.sol → Events → Bridge Service → Hypergraph Knowledge Graph (Public Space)
```

## 📋 Features

- **Real-time Event Listening**: Monitors contract events on Celo Alfajores
- **Knowledge Graph Publishing**: Converts events to structured entities
- **Entity Management**: Maintains Users, Skills, Jobs, Ratings, Sponsorships, and Hiring Outcomes
- **Graceful Error Handling**: Resilient to network issues and RPC failures
- **Statistics Tracking**: Provides insights into processed events and entities

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd event-bridge
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

**IMPORTANT**: Update the `CONTRACT_ADDRESS` in `.env` with your deployed OnchainTrustNetwork contract address.

### 3. Run the Bridge

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📊 Events Processed

### 1. ReviewerApproved
- **Trigger**: When DAO admin approves a new reviewer
- **Creates/Updates**: User entity with reviewer status
- **Data**: Address, approval timestamp, reviewer flag

### 2. SkillRated
- **Trigger**: When reviewer rates a junior developer's skill
- **Creates/Updates**: User, Skill, and Rating entities
- **Data**: Reviewer, junior, skill hash, rating (1-10), transaction details

### 3. CreditsSpent
- **Trigger**: When reviewer sponsors a candidate for a job
- **Creates/Updates**: User, Job, and Sponsorship entities
- **Data**: Sponsor, candidate, job hash, credits amount

### 4. HiringOutcome
- **Trigger**: When DAO admin records hiring decision
- **Creates**: HiringOutcome entity
- **Data**: Candidate, hired status, timestamp

## 🏛️ Knowledge Graph Entities

### User
```typescript
{
  address: string;           // Ethereum address
  verified: boolean;         // Self Protocol verification
  isReviewer: boolean;       // Reviewer status
  approvedAt?: number;       // Reviewer approval timestamp
  totalRatingsGiven: number; // Ratings given by this user
  totalRatingsReceived: number; // Ratings received
  averageRating: number;     // Average rating received
  totalCreditsSpent: number; // Total credits spent on sponsorships
  joinedAt: number;          // First activity timestamp
  lastActivity: number;      // Most recent activity
}
```

### Skill
```typescript
{
  skillHash: string;         // bytes32 skill identifier
  name?: string;            // Human-readable name (derived)
  totalRatings: number;     // Total ratings for this skill
  averageRating: number;    // Average rating
  firstRatedAt: number;     // First rating timestamp
  lastRatedAt: number;      // Most recent rating
}
```

### Rating
```typescript
{
  reviewerId: string;       // Reviewer address
  juniorId: string;         // Junior developer address
  skillId: string;          // Skill hash
  overallRating: number;    // Rating value (1-10)
  timestamp: number;        // Block timestamp
  transactionHash: string;  // Transaction hash
  blockNumber: number;      // Block number
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CONTRACT_ADDRESS` | OnchainTrustNetwork contract address | *Required* |
| `RPC_URL` | Celo Alfajores RPC endpoint | `https://rpc.ankr.com/celo_alfajores` |
| `CHAIN_ID` | Chain ID | `44787` |
| `PUBLIC_SPACE_ID` | Hypergraph public space ID | `3f32353d-3b27-4a13-b71a-746f06e1f7db` |
| `START_BLOCK` | Starting block (`latest` or number) | `latest` |
| `POLL_INTERVAL` | Polling interval in milliseconds | `5000` |

## 📈 Monitoring

The bridge provides real-time statistics:

```json
{
  "lastProcessedBlock": "12345678",
  "isRunning": true,
  "entities": {
    "users": 150,
    "skills": 25,
    "jobs": 42,
    "ratings": 300,
    "sponsorships": 89,
    "hiringOutcomes": 67
  }
}
```

## 🔗 Integration

### With Frontend Application
The bridge publishes data to the same public space (`3f32353d-3b27-4a13-b71a-746f06e1f7db`) that your frontend queries from.

### With TypeSync
Use TypeSync (http://localhost:3001) to manage the schema and ensure proper entity mappings.

### With GeoBrowser
View published data at https://testnet.geobrowser.io/root

## 🛠️ Development

### Project Structure
```
event-bridge/
├── src/
│   ├── index.ts          # Main entry point
│   ├── bridge.ts         # Core bridge logic
│   ├── types.ts          # Type definitions and ABI
│   ├── schema.ts         # Entity schema definitions
│   └── mapping.ts        # Hypergraph mapping configuration
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

## 🚨 Important Notes

1. **Contract Address**: You MUST update the `CONTRACT_ADDRESS` in `.env` with your actual deployed contract
2. **RPC Limits**: Free RPC endpoints have rate limits; consider using paid endpoints for production
3. **Persistence**: Currently uses in-memory storage; add database persistence for production use
4. **Authentication**: Publishing to Hypergraph may require authentication in production

## 🎯 Next Steps

1. Deploy your OnchainTrustNetwork contract
2. Update the contract address in `.env`
3. Run the bridge service
4. Test with contract interactions
5. Verify data appears in GeoBrowser

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid contract address"**: Update `CONTRACT_ADDRESS` in `.env`
2. **RPC errors**: Check `RPC_URL` and network connectivity
3. **No events detected**: Ensure contract is deployed and has activity
4. **TypeScript errors**: Run `npm run build` to check for issues

### Logs

All operations are logged with timestamps and severity levels. Check console output for detailed information about:
- Event detection and processing
- Entity creation and updates
- Knowledge graph publishing
- Errors and warnings