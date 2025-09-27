const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Configuration for deployment
  const initialDAOAdmin = deployer.address; // Use deployer as initial admin
  const selfHub = process.env.SELF_HUB_ADDRESS || "0x0000000000000000000000000000000000000001"; // Replace with actual Self hub address
  const scopeSeed = process.env.SELF_SCOPE_SEED || "linked-dao-production"; // Replace with your actual scope seed

  console.log("\n=== Deploying OnchainTrustNetwork ===");

  // Deploy OnchainTrustNetwork contract
  const OnchainTrustNetwork = await ethers.getContractFactory("OnchainTrustNetwork");
  const onchainTrustNetwork = await OnchainTrustNetwork.deploy(
    initialDAOAdmin,
    selfHub,
    scopeSeed
  );

  await onchainTrustNetwork.waitForDeployment();
  const contractAddress = await onchainTrustNetwork.getAddress();

  console.log("✅ OnchainTrustNetwork deployed to:", contractAddress);
  console.log("DAO Admin:", initialDAOAdmin);
  console.log("Self Hub:", selfHub);
  console.log("Scope Seed:", scopeSeed);

  // Get deployment transaction details
  const deploymentTx = onchainTrustNetwork.deploymentTransaction();
  const receipt = await deploymentTx.wait();

  console.log("Deployment block number:", receipt.blockNumber.toString());
  console.log("Gas used:", receipt.gasUsed.toString());

  // Create deployment info for Hypergraph config
  const network = await deployer.provider.getNetwork();
  const deploymentInfo = {
    contractAddress: contractAddress,
    deploymentBlock: receipt.blockNumber.toString(), // Convert BigInt to string
    deploymentTxHash: receipt.hash,
    network: {
      chainId: network.chainId.toString(), // Convert BigInt to string
      name: network.name
    },
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    selfHub: selfHub,
    scopeSeed: scopeSeed,
    gasUsed: receipt.gasUsed.toString() // Convert BigInt to string
  };

  // Write deployment info to file
  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✅ Deployment info written to deployment-info.json");

  // Generate Hypergraph config update instructions
  console.log("\n=== HYPERGRAPH CONFIGURATION ===");
  console.log("Update your hypergraph/hypergraph.config.js with:");
  console.log(`- Contract address: ${contractAddress}`);
  console.log(`- Start block: ${receipt.blockNumber}`);
  console.log(`- Chain ID: ${(await deployer.provider.getNetwork()).chainId}`);

  console.log("\n=== NEXT STEPS ===");
  console.log("1. Copy the contract ABI to hypergraph directory:");
  console.log(`   Copy-Item "artifacts/contracts/OnchainTrustNetwork.sol/OnchainTrustNetwork.json" "hypergraph/abis/"`);
  console.log("");
  console.log("2. Update hypergraph/hypergraph.config.js:");
  console.log(`   - address: "${contractAddress}"`);
  console.log(`   - startBlock: ${receipt.blockNumber}`);
  console.log("");
  console.log("3. Start Hypergraph indexing:");
  console.log("   cd hypergraph");
  console.log("   npm install");
  console.log("   npm run dev");
  console.log("");
  console.log("4. Access Hypergraph UI at: http://localhost:5173");

  // Automatically update hypergraph config if file exists
  const hypergraphConfigPath = "./hypergraph/hypergraph.config.js";
  if (fs.existsSync(hypergraphConfigPath)) {
    console.log("\n⚡ Auto-updating hypergraph config...");

    let configContent = fs.readFileSync(hypergraphConfigPath, 'utf8');
    configContent = configContent.replace(
      /address: "[^"]*"/,
      `address: "${contractAddress}"`
    );
    configContent = configContent.replace(
      /startBlock: \d+/,
      `startBlock: ${receipt.blockNumber.toString()}`
    );

    fs.writeFileSync(hypergraphConfigPath, configContent);
    console.log("✅ Hypergraph config updated automatically!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
