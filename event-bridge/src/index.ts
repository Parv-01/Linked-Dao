import { OnchainTrustBridge } from './bridge.js';
import { BridgeConfig } from './types.js';
import * as dotenv from 'dotenv';

dotenv.config();

// Load configuration from environment variables
function loadConfig(): BridgeConfig {
  const config: BridgeConfig = {
    contractAddress: process.env.CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
    rpcUrl: process.env.RPC_URL || 'https://rpc.ankr.com/celo_alfajores',
    chainId: parseInt(process.env.CHAIN_ID || '44787'),
    publicSpaceId: process.env.PUBLIC_SPACE_ID || '3f32353d-3b27-4a13-b71a-746f06e1f7db',
    hypergraphEndpoint: process.env.HYPERGRAPH_ENDPOINT || 'https://testnet.geobrowser.io',
    startBlock: process.env.START_BLOCK === 'latest' ? 'latest' : BigInt(process.env.START_BLOCK || '0'),
    pollInterval: parseInt(process.env.POLL_INTERVAL || '5000'),
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    privateKey: process.env.PRIVATE_KEY,
    mnemonic: process.env.MNEMONIC
  };

  // Validate required configuration
  if (!config.contractAddress || config.contractAddress === '0x1234567890123456789012345678901234567890') {
    console.warn('⚠️  WARNING: Using placeholder contract address. Please set CONTRACT_ADDRESS in .env');
  }

  return config;
}

// Main function
async function main() {
  console.log('🚀 Starting OnchainTrustNetwork Bridge Service');
  console.log('===============================================');

  try {
    // Load configuration
    const config = loadConfig();
    
    console.log('📋 Configuration:');
    console.log(`   Contract: ${config.contractAddress}`);
    console.log(`   RPC URL: ${config.rpcUrl}`);
    console.log(`   Chain ID: ${config.chainId}`);
    console.log(`   Public Space: ${config.publicSpaceId}`);
    console.log(`   Start Block: ${config.startBlock}`);
    console.log(`   Poll Interval: ${config.pollInterval}ms`);
    console.log('');

    // Create and start bridge
    const bridge = new OnchainTrustBridge(config);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      bridge.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      bridge.stop();
      process.exit(0);
    });

    // Start the bridge
    await bridge.start();

    // Keep the process alive and log stats periodically
    setInterval(() => {
      const stats = bridge.getStats();
      console.log('📊 Bridge Stats:', JSON.stringify(stats, null, 2));
    }, 30000); // Log stats every 30 seconds

  } catch (error) {
    console.error('❌ Failed to start bridge:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Start the application
main().catch((error) => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});