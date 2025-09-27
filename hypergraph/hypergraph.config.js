module.exports = {
  chains: [
    {
      id: "celo-sepolia", // Celo Sepolia testnet (new)
      rpc: "https://forno.celo-sepolia.celo-testnet.org", // RPC endpoint
      contracts: [
        {
          name: "OnchainTrustNetwork",
          address: "0xabE83DaDFcaBA9137Ce8E75a294b9F946A073565", // Replace after deployment
          abi: require("./abis/OnchainTrustNetwork.json"),
          startBlock: 5658157, // Block where contract was deployed (update after deployment)
          events: [
            {
              name: "ReviewerApproved",
              signature: "ReviewerApproved(address,uint256)"
            },
            {
              name: "SkillRated",
              signature: "SkillRated(address,address,bytes32,uint8)"
            },
            {
              name: "CreditsSpent",
              signature: "CreditsSpent(address,address,bytes32,uint256)"
            },
            {
              name: "HiringOutcome",
              signature: "HiringOutcome(address,bool,uint256)"
            }
          ],
        },
      ],
    },
  ],
  // Hypergraph server configuration
  server: {
    port: 5173,
    graphql: {
      endpoint: "/graphql",
      playground: true
    }
  },
  // Database configuration (for local development)
  database: {
    type: "sqlite",
    path: "./hypergraph.db"
  }
};