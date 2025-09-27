import { GRC20OnchainTrustBridge } from './grc20-bridge';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {
  console.log('🚀 Starting GRC-20 OnchainTrust Bridge Demo');
  
  const rpcUrl = process.env.RPC_URL || 'https://rpc.ankr.com/eth_sepolia';
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}` || '0x1234567890123456789012345678901234567890';
  const spaceId = process.env.SPACE_ID || '3f32353d-3b27-4a13-b71a-746f06e1f7db';
  const privateKey = process.env.DEMO_PRIVATE_KEY as `0x${string}` || '0x0000000000000000000000000000000000000000000000000000000000000001';

  // Initialize the bridge
  const bridge = new GRC20OnchainTrustBridge(
    rpcUrl,
    contractAddress,
    spaceId,
    privateKey
  );

  console.log('📝 Initializing GRC-20 schema...');
  await bridge.initializeSchema();

  console.log('👂 Starting event listener...');
  await bridge.startListening();

  console.log('✅ Bridge is now running!');
  console.log('Configuration:', bridge.getStatus());

  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bridge...');
    bridge.stopListening();
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch(console.error);
}