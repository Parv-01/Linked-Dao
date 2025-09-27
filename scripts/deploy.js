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

  // Self Protocol verification config (18+ years old, no country restrictions, OFAC disabled)
  const verificationConfig = {
    olderThan: 18,
    forbiddenCountries: [], // No country restrictions for now
    ofacEnabled: false // Disable OFAC checks for testnet
  };

  console.log("\n=== Deploying OnchainTrustNetwork ===");
  console.log("Self Verification Config:", verificationConfig);

  // Deploy OnchainTrustNetwork contract
  const OnchainTrustNetwork = await ethers.getContractFactory("OnchainTrustNetwork");
  const onchainTrustNetwork = await OnchainTrustNetwork.deploy(
    initialDAOAdmin,
    selfHub,
    scopeSeed,
    verificationConfig
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

  // Create deployment info
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

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Contract is ready for Self Protocol verification!");
  console.log("Events will be stored off-chain in your Hypergraph knowledge graph.");
  console.log("\n=== NEXT STEPS ===");
  console.log("1. Update your off-chain Hypergraph with contract address:", contractAddress);
  console.log("2. Configure Self Protocol verification flow in your frontend");
  console.log("3. Start monitoring contract events for trust network data");
  console.log("4. Test the verification and rating functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
