// scripts/check-balance.js - Helper script to check account balance

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await deployer.provider.getNetwork();

  console.log("=== ACCOUNT & NETWORK INFO ===");
  console.log("Account:", deployer.address);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH/Native Token");

  // Check if balance is sufficient for deployment (rough estimate)
  const minBalance = ethers.parseEther("0.01"); // 0.01 ETH minimum
  if (balance < minBalance) {
    console.log("⚠️  WARNING: Low balance! You may need more tokens for deployment.");
    console.log("   Get test tokens from:");

    const chainId = network.chainId;
    if (chainId === 44787n) {
      console.log("   - Celo Alfajores: https://faucet.celo.org");
    } else if (chainId === 80001n) {
      console.log("   - Polygon Mumbai: https://faucet.polygon.technology");
    } else if (chainId === 11155111n) {
      console.log("   - Ethereum Sepolia: https://sepoliafaucet.com");
    } else {
      console.log("   - Find a faucet for your network");
    }
  } else {
    console.log("✅ Balance looks good for deployment!");
  }

  // Test RPC connection
  try {
    const latestBlock = await deployer.provider.getBlockNumber();
    console.log("Latest block:", latestBlock);
    console.log("✅ RPC connection working!");
  } catch (error) {
    console.log("❌ RPC connection failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });