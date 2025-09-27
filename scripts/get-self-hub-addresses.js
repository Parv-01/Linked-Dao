// scripts/get-self-hub-addresses.js - Helper script to get Self Protocol hub addresses

async function main() {
  console.log("=== Self Protocol Hub Addresses ===");
  console.log("");

  console.log("🔗 CELO SEPOLIA TESTNET (Chain ID: 11142220)");
  console.log("📍 Identity Verification Hub V2:");
  console.log("   Address: TBD - Check Self Protocol docs");
  console.log("   Docs: https://docs.self.id/protocol/smart-contracts/deployed-contracts");
  console.log("");

  console.log("🔗 CELO MAINNET (Chain ID: 42220)");
  console.log("📍 Identity Verification Hub V2:");
  console.log("   Address: TBD - Check Self Protocol docs");
  console.log("");

  console.log("🔗 CELO ALFAJORES TESTNET (Chain ID: 44787)");
  console.log("📍 Identity Verification Hub V2:");
  console.log("   Address: TBD - Check Self Protocol docs");
  console.log("");

  console.log("⚠️  IMPORTANT NOTES:");
  console.log("1. Check Self Protocol documentation for current hub addresses");
  console.log("2. Celo Sepolia is new - hub may not be deployed yet");
  console.log("3. For testing, you can use Alfajores if Sepolia isn't supported");
  console.log("4. Update your .env file with the correct SELF_HUB_ADDRESS");
  console.log("");

  console.log("📚 Resources:");
  console.log("- Self Protocol Docs: https://docs.self.id");
  console.log("- Deployed Contracts: https://docs.self.id/protocol/smart-contracts/deployed-contracts");
  console.log("- Self Dashboard: https://app.self.id");
  console.log("");

  console.log("🔧 Next Steps:");
  console.log("1. Visit Self Protocol dashboard to create your app config");
  console.log("2. Get your scope seed from the dashboard");
  console.log("3. Update SELF_HUB_ADDRESS in .env with the correct hub address");
  console.log("4. Update SELF_SCOPE_SEED in .env with your dashboard scope seed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });