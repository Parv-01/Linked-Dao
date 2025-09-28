# LinkedDAO 🩻  
> A decentralized hiring & reputation protocol for candidates, reviewers, and companies.  
Built at **ETHGlobal** ✨

---
## 🔗 Demo Link : - 

## 🔗 Notion Doc Link : - https://www.notion.so/Linked-Dao-27a3ffb636f080e39285f42ae5369f35?source=copy_link

## 🎨 Figma Wireframe : - https://www.figma.com/design/sNxzg0xQhDzMWmrLM8iZvI/Wireframe-ETH?node-id=0-1&t=S7ACeVllgvDFP7K1-0

## 🎨 Figma Flowchart : - https://www.figma.com/design/5fd24Of41mWKcQkOOkeNVQ/ETH-GLOBAL-Flow-Chart?node-id=0-1&t=YNw5WgQfSE8W8Q1D-1 

## 🌍 Problem Statement  

- Young candidates struggle to land opportunities because companies demand prior experience.  
- Companies, on the other hand, receive **thousands of applications**, making it difficult to filter and identify quality talent.  
- Reviewers/sponsors (senior developers) who help juniors get noticed lack incentives or reputation systems.  

---

## 💡 Solution Overview  

**LinkedDAO** introduces a **rating-based ecosystem** that connects **candidates, reviewers, and companies**.  

1. **Candidates** get exposure based on performance and peer reviews.  
2. **Companies** filter high-quality candidates efficiently.  
3. **Reviewers/Sponsors** earn credits and reputation for supporting talent.  
4. **DAO Governance** ensures fairness, accountability, and decentralization.  

---

## ⭐ Candidate Rating System  

Candidate’s **rating evolves** dynamically with hiring process outcomes:

### Rating Increases  
- ✅ **Job Offer Received** → High positive weightage.  
- 📞 **Interview Call Received** → Medium positive weightage.  
- 👍 **Peer Review / Upvote** from a senior dev → Low positive weightage.  

### Rating Decreases  
- ❌ **Application Rejected (Early Stage)** → High negative weightage.  
- ❌ **Interview Rejected (Later Stage)** → Low negative weightage.  

➡️ Higher-rated candidates get **more visibility** in job lists → better exposure + higher chance of selection.  

---

## 🎖️ Reviewer Incentives (Credits System)  

- Reviewers earn **credits** when their reviewed/sponsored candidates get hired.  
- **Credits Utility:**  
  - Boost reach of posts.  
  - Advertise themselves or their projects.  

---

## 🏛 DAO Governance & Moderation  

- **Onboarding Reviewers:**  
  - A senior dev needs **5/60 DAO votes** to be approved.  

- **Reviewer Performance Check:**  
  - If a reviewer’s candidates consistently fail, DAO can remove them with **5/60 votes**.  

---

## 🗂 Data Architecture & Structures  

The protocol uses a **three-layered architecture**:

### 1. Smart Contract (On-Chain)  
Immutable source of truth. Stores critical data like:  
- Admin & reviewer registry.  
- Events: `ReviewerApproved`, `SkillRated`, `CreditsSpent`, `HiringOutcome`.  

### 2. The Graph (Subgraph Indexing)  
Efficient querying & ranking. Entities:  
- **User** → wallet, reputation, credit balance.  
- **Rating** → reviewer → junior → skill → score.  
- **Sponsorship** → sponsor → candidate → credits → jobIdHash.  

### 3. Off-Chain Database (SQL/NoSQL)  
Flexible, human-friendly storage for:  
- **UserProfiles** → wallet, name, bio, opt-in flag.  
- **JobPostings** → job_id, job_id_hash, title, hiring manager wallet.  

🔗 [Detailed Data Architecture & Structures](https://www.notion.so/Data-Architecture-Structures-27b3ffb636f080a5bb18e35193615079?pvs=21)  

---

## 🖥 Core Frontend Features  

1. **User Dashboard & Profile** → View blockchain status + update off-chain info.  
2. **Reviewer & Junior Listings** → Filter by reputation or ratings.  
3. **Skills Rating Interface** → Reviewers rate juniors on-chain.  
4. **Sponsorship Management** → Spend credits to highlight candidates/jobs.  
5. **Hiring Outcomes** → Display job postings + on-chain hiring events.  

🔗 [Frontend Documentation](https://www.notion.so/Frontend-27a3ffb636f080159d25cba9d76e0c7b?pvs=21)  

---

## ⚙️ Tech Stack  

- **Smart Contracts** → Solidity, Hardhat  
- **Indexing** → The Graph (subgraph entities)  
- **Frontend** → Next.js, React, TailwindCSS  
- **Web3 Libraries** → ethers.js / web3.js  
- **Database** → SQL/NoSQL for flexible profiles & jobs  
- **State Management** → React Context / Redux  
- **DAO Governance** → On-chain voting logic  

---

## 📂 Repository Structure  

```bash
Linked-Dao/
├── contracts/          # Smart contracts (Solidity)
├── subgraph/           # The Graph schema & mappings
├── frontend/           # Next.js + React frontend
├── database/           # Off-chain DB models
├── README.md           # Project documentation

🚀 Getting Started
Prerequisites

Node.js & pnpm

Hardhat

The Graph CLI

PostgreSQL / MongoDB

Setup
# Clone repo
git clone https://github.com/Parv-01/Linked-Dao.git

# Install dependencies
cd Linked-Dao
pnpm install

# Compile contracts
npx hardhat compile

# Run local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

🏆 ETHGlobal Hackathon

This project was built as part of ETHGlobal Hackathon to solve real-world problems in hiring and reputation management through Web3 + DAO governance.

🤝 Contributors

@itsYashASeeker
@krishnavbajoria02
@Rohan5050
@Parv-01
@khushikumari239


📜 License

MIT License © 2025 LinkedDAO Team
