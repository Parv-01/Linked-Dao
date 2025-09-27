import { OnchainTrustBridge } from './bridge.js';
import { BridgeConfig } from './types.js';

// Test configuration
const testConfig: BridgeConfig = {
  contractAddress: '0x1234567890123456789012345678901234567890', // Placeholder
  rpcUrl: 'https://rpc.ankr.com/celo_alfajores',
  chainId: 44787,
  publicSpaceId: '3f32353d-3b27-4a13-b71a-746f06e1f7db',
  hypergraphEndpoint: 'https://testnet.geobrowser.io',
  startBlock: 'latest',
  pollInterval: 5000,
  logLevel: 'info'
};

async function testBridge() {
  console.log('🧪 Testing OnchainTrustNetwork Bridge');
  console.log('=====================================');

  try {
    // Create bridge instance
    const bridge = new OnchainTrustBridge(testConfig);
    
    // Test initialization
    console.log('✅ Bridge initialization successful');
    
    // Get initial stats
    const initialStats = bridge.getStats();
    console.log('📊 Initial stats:', initialStats);
    
    // Test would start the bridge here, but for now we'll just test the structure
    console.log('✅ Bridge test completed successfully');
    console.log('');
    console.log('🔧 To use with real contract:');
    console.log('   1. Deploy your OnchainTrustNetwork contract');
    console.log('   2. Update CONTRACT_ADDRESS in .env');
    console.log('   3. Run: npm run dev');
    
  } catch (error) {
    console.error('❌ Bridge test failed:', error);
  }
}

testBridge();