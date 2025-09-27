# OnchainTrustNetwork Contract Testing Flow Guide
## Complete Function Call Sequence for Remix IDE

### 🎯 Overview
This guide shows the proper sequence for testing your OnchainTrustNetwork contract in Remix IDE to generate events that will be captured by your knowledge graph subgraph.

---

## 📋 Prerequisites

### 1. Deploy Contract Parameters
When deploying in Remix, use these constructor parameters:

```solidity
// Constructor Parameters:
_initialDAOAdmin: YOUR_WALLET_ADDRESS  // e.g., 0x123...abc
_selfHub: 0x0000000000000000000000000000000000000001  // Mock Self Hub for testing
_scopeSeed: "linked-dao-test"
_verificationConfig: {
    verifier: 0x0000000000000000000000000000000000000002,  // Mock verifier
    verificationMethod: "mock-verification",
    requiredFields: ["identity", "proof"],
    expirationTime: 86400  // 24 hours
}
```

---

## 🔄 Complete Testing Flow

### **Phase 1: Setup & Initial State** 

#### Step 1: Deploy Contract ✅
Deploy with constructor parameters above.

#### Step 2: Verify Initial State 📊
```solidity
// Read functions to check initial state:
DAO_ADMIN()           // Should return your deployer address
getReviewerPool()     // Should return array with 1 address (DAO_ADMIN)
isReviewer(DAO_ADMIN_ADDRESS)  // Should return true
```

---

### **Phase 2: Build Trust Network**

#### Step 3: Approve More Reviewers 👥
**Function:** `approveReviewer(address _newReviewer)`
**Caller:** DAO Admin only
**Purpose:** Creates User + Reviewer nodes in knowledge graph

```solidity
// Example calls:
approveReviewer(0x742d35Cc6634C0532925a3b8D404fAbcE4649c8444)  // Alice
approveReviewer(0x8ba1f109551bD432803012645Hac136c739F6789)  // Bob
approveReviewer(0x9234567890123456789012345678901234567890)  // Carol
```

**Expected Events:**
- `ReviewerApproved(address indexed reviewer, uint256 timestamp)`
- **Knowledge Graph:** Creates User and Reviewer entities

#### Step 4: Verify Reviewers Added 📋
```solidity
getReviewerPool()  // Should now return 4 addresses
isReviewer(ALICE_ADDRESS)  // Should return true
isReviewer(BOB_ADDRESS)    // Should return true
```

---

### **Phase 3: Skill Rating System**

#### Step 5: Generate Skill Hashes 🔧
**Function:** `getHash(string _input)`
**Purpose:** Get hashes for different skills

```solidity
// Generate skill hashes for testing:
getHash("JavaScript")      // Returns: 0x1234...
getHash("Solidity")        // Returns: 0x5678...
getHash("React")           // Returns: 0x9abc...
getHash("Python")          // Returns: 0xdef0...
```
**📝 Save these hashes - you'll use them in rating functions**

#### Step 6: Rate Junior Developers ⭐
**Function:** `rateJunior(address _juniorDev, bytes32 _skillHash, uint8 _rating)`
**Caller:** Verified Reviewers only
**Ratings:** 1-10 scale

```solidity
// Alice rates different developers:
// Switch to Alice's account in Remix
rateJunior(0x1111111111111111111111111111111111111111, 0x1234..., 8)  // JavaScript: 8/10
rateJunior(0x2222222222222222222222222222222222222222, 0x1234..., 9)  // JavaScript: 9/10
rateJunior(0x1111111111111111111111111111111111111111, 0x5678..., 7)  // Solidity: 7/10

// Bob rates same developers:
// Switch to Bob's account in Remix  
rateJunior(0x1111111111111111111111111111111111111111, 0x1234..., 7)  // JavaScript: 7/10
rateJunior(0x3333333333333333333333333333333333333333, 0x9abc..., 9)  // React: 9/10
```

**Expected Events:**
- `SkillRated(address indexed reviewer, address indexed junior, bytes32 indexed skillHash, uint8 overallRating)`
- **Knowledge Graph:** Creates Rating relationships and Skill entities

---

### **Phase 4: Job Sponsorship System**

#### Step 7: Generate Job Hashes 💼
```solidity
// Generate job hashes:
getHash("Frontend Developer Position")     // Returns: 0xjob1...
getHash("Smart Contract Developer Role")   // Returns: 0xjob2...
getHash("Full Stack Engineer Opening")     // Returns: 0xjob3...
```

#### Step 8: Sponsor Applications 💰
**Function:** `sponsorApplication(address _candidate, bytes32 _jobIdHash, uint256 _credits)`
**Caller:** Verified Reviewers only

```solidity
// Carol sponsors candidates for jobs:
// Switch to Carol's account in Remix
sponsorApplication(0x1111111111111111111111111111111111111111, 0xjob1..., 50)   // 50 credits
sponsorApplication(0x2222222222222222222222222222222222222222, 0xjob1..., 30)   // 30 credits  
sponsorApplication(0x3333333333333333333333333333333333333333, 0xjob2..., 75)   // 75 credits

// Alice also sponsors:
// Switch to Alice's account
sponsorApplication(0x1111111111111111111111111111111111111111, 0xjob2..., 40)   // 40 credits
```

**Expected Events:**
- `CreditsSpent(address indexed sponsor, address indexed candidate, bytes32 indexed jobIdHash, uint256 creditsUsed)`
- **Knowledge Graph:** Creates Sponsorship relationships and Job entities

---

### **Phase 5: Hiring Outcomes**

#### Step 9: Record Hiring Decisions 🎯
**Function:** `recordHiringOutcome(address _candidate, bool _isHired)`
**Caller:** DAO Admin only

```solidity
// DAO Admin records hiring outcomes:
// Switch back to DAO Admin account
recordHiringOutcome(0x1111111111111111111111111111111111111111, true)   // Hired!
recordHiringOutcome(0x2222222222222222222222222222222222222222, false)  // Not hired
recordHiringOutcome(0x3333333333333333333333333333333333333333, true)   // Hired!
```

**Expected Events:**
- `HiringOutcome(address indexed candidate, bool isHired, uint256 timestamp)`
- **Knowledge Graph:** Creates HiringOutcome relationships

---

## 📊 Verification & Monitoring

### Step 10: Check Final State 📈
```solidity
// Verify final contract state:
getReviewerPool()                    // Should return all approved reviewers
isReviewer(REVIEWER_ADDRESS)         // Verify reviewer status
verifiedUsers(REVIEWER_ADDRESS)      // Check if users are verified through Self Protocol
```

### Step 11: Monitor Events 📡
In Remix, check the transaction logs to see emitted events:
1. Go to terminal in Remix
2. Click on transaction hashes  
3. View "Logs" section to see events
4. Verify event parameters match your inputs

---

## 🎯 Expected Knowledge Graph Results

After completing this flow, your subgraph should create:

### Entities (Nodes):
- **4 Users** (DAO Admin + 3 reviewers)  
- **4 Skills** (JavaScript, Solidity, React, Python)
- **3 Jobs** (Frontend Dev, Smart Contract Dev, Full Stack)
- **4 Reviewers** (Approved reviewer entities)

### Relationships (Edges):
- **5 Rating relationships** (reviewer → user for skill)
- **4 Sponsorship relationships** (sponsor → candidate for job)
- **3 HiringOutcome relationships** (candidate hiring results)

---

## 🚨 Troubleshooting

### Common Issues:
1. **"Admin only access"** → Make sure you're calling from DAO Admin account
2. **"Reviewer status required"** → Switch to approved reviewer account  
3. **"Self Protocol verification required"** → For testing, this should auto-verify when rating/sponsoring
4. **"Rating must be between 1 and 10"** → Use valid rating range

### Account Switching in Remix:
1. Go to "Account" dropdown in Deploy & Run tab
2. Select different account before calling functions
3. Each role (DAO Admin, Reviewers) has different permissions

---

## 📈 Next Steps

1. **Complete this testing flow** to generate comprehensive event data
2. **Deploy your subgraph** to capture these events
3. **Query the knowledge graph** to see trust relationships
4. **Build frontend applications** that leverage the trust network data

This testing flow will populate your knowledge graph with realistic trust network data! 🎉