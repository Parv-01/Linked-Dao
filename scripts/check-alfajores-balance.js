const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // Configure for Alfajores network
  const provider = new ethers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");

  if (!process.env.PRIVATE_KEY) {
    console.log("❌ No PRIVATE_KEY found in .env file");
    return;
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("=== CELO ALFAJORES TESTNET INFO ===");
  console.log("Account:", wallet.address);

  try {
    const balance = await provider.getBalance(wallet.address);
    const balanceInCelo = ethers.formatEther(balance);

    console.log("Balance:", balanceInCelo, "CELO");

    if (parseFloat(balanceInCelo) === 0) {
      console.log("\n❌ ZERO BALANCE - You need testnet CELO!");
      console.log("🚰 Get testnet CELO from the faucet:");
      console.log("   https://faucet.celo.org/alfajores");
      console.log("   Enter your address:", wallet.address);
    } else if (parseFloat(balanceInCelo) < 0.1) {
      console.log("⚠️  Low balance - consider getting more testnet CELO");
      console.log("🚰 Faucet: https://faucet.celo.org/alfajores");
    } else {
      console.log("✅ Balance looks good for deployment!");
    }

    const network = await provider.getNetwork();
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId.toString());

    const blockNumber = await provider.getBlockNumber();
    console.log("Latest block:", blockNumber);
    console.log("✅ RPC connection working!");

  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });