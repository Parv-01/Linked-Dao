#!/usr/bin/env node

// Quick Reference Script for OnchainTrustNetwork Testing
// Use this to generate test data for Remix IDE

console.log('🧪 OnchainTrustNetwork Testing Reference\n');

// Sample addresses for testing (use your own in Remix)
const SAMPLE_ADDRESSES = {
  DAO_ADMIN: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',  // Account 0 in Remix
  ALICE: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',     // Account 1 in Remix  
  BOB: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',       // Account 2 in Remix
  CAROL: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',     // Account 3 in Remix
  JUNIOR_DEV_1: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2', // Junior Dev 1
  JUNIOR_DEV_2: '0x17F6AD8Ef982297579C203069C1DbfFE4348c372', // Junior Dev 2
  JUNIOR_DEV_3: '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678'  // Junior Dev 3
};

console.log('👥 Sample Test Addresses:');
console.log('═══════════════════════════');
Object.entries(SAMPLE_ADDRESSES).forEach(([role, address]) => {
  console.log(`${role.padEnd(15)}: ${address}`);
});

// Helper function to generate skill hashes (simplified for display)
function generateSkillHash(skill) {
  // This simulates what getHash(skill) would return
  const hash = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return '0x' + hash.toString(16).padStart(16, '0') + '...';
}

// Helper function to generate job hashes (simplified for display)
function generateJobHash(job) {
  const hash = job.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return '0x' + hash.toString(16).padStart(16, '0') + '...';
}

console.log('\n🎯 Skills and Hashes:');
console.log('═══════════════════════');
const skills = ['JavaScript', 'Solidity', 'React', 'Python', 'TypeScript'];
skills.forEach(skill => {
  console.log(`${skill.padEnd(12)}: ${generateSkillHash(skill)}`);
});

console.log('\n💼 Jobs and Hashes:');
console.log('═══════════════════════');
const jobs = [
  'Frontend Developer Position',
  'Smart Contract Developer Role', 
  'Full Stack Engineer Opening',
  'Blockchain Architect Role'
];
jobs.forEach(job => {
  console.log(`${job.substring(0, 25).padEnd(27)}: ${generateJobHash(job)}`);
});

console.log('\n📋 STEP-BY-STEP TESTING SEQUENCE:');
console.log('═══════════════════════════════════════════════\n');

console.log('1️⃣  DEPLOY CONTRACT');
console.log('   Constructor Parameters:');
console.log(`   _initialDAOAdmin: ${SAMPLE_ADDRESSES.DAO_ADMIN}`);
console.log('   _selfHub: 0x0000000000000000000000000000000000000001');
console.log('   _scopeSeed: "linked-dao-test"');
console.log('   _verificationConfig: [see deployment guide]');

console.log('\n2️⃣  APPROVE REVIEWERS (DAO Admin Account)');
console.log('   Function: approveReviewer(address)');
console.log(`   approveReviewer(${SAMPLE_ADDRESSES.ALICE})`);
console.log(`   approveReviewer(${SAMPLE_ADDRESSES.BOB})`);
console.log(`   approveReviewer(${SAMPLE_ADDRESSES.CAROL})`);

console.log('\n3️⃣  RATE JUNIOR DEVELOPERS (Switch to Reviewer Accounts)');
console.log('   Function: rateJunior(address, bytes32, uint8)');
console.log('   From Alice\'s account:');
console.log(`   rateJunior(${SAMPLE_ADDRESSES.JUNIOR_DEV_1}, ${generateSkillHash('JavaScript')}, 8)`);
console.log(`   rateJunior(${SAMPLE_ADDRESSES.JUNIOR_DEV_2}, ${generateSkillHash('JavaScript')}, 9)`);
console.log(`   rateJunior(${SAMPLE_ADDRESSES.JUNIOR_DEV_1}, ${generateSkillHash('Solidity')}, 7)`);

console.log('\n   From Bob\'s account:');
console.log(`   rateJunior(${SAMPLE_ADDRESSES.JUNIOR_DEV_1}, ${generateSkillHash('JavaScript')}, 7)`);
console.log(`   rateJunior(${SAMPLE_ADDRESSES.JUNIOR_DEV_3}, ${generateSkillHash('React')}, 9)`);

console.log('\n4️⃣  SPONSOR APPLICATIONS (Reviewer Accounts)');
console.log('   Function: sponsorApplication(address, bytes32, uint256)');
console.log('   From Carol\'s account:');
console.log(`   sponsorApplication(${SAMPLE_ADDRESSES.JUNIOR_DEV_1}, ${generateJobHash('Frontend Developer Position')}, 50)`);
console.log(`   sponsorApplication(${SAMPLE_ADDRESSES.JUNIOR_DEV_2}, ${generateJobHash('Frontend Developer Position')}, 30)`);
console.log(`   sponsorApplication(${SAMPLE_ADDRESSES.JUNIOR_DEV_3}, ${generateJobHash('Smart Contract Developer Role')}, 75)`);

console.log('\n5️⃣  RECORD HIRING OUTCOMES (DAO Admin Account)');
console.log('   Function: recordHiringOutcome(address, bool)');
console.log(`   recordHiringOutcome(${SAMPLE_ADDRESSES.JUNIOR_DEV_1}, true)`);
console.log(`   recordHiringOutcome(${SAMPLE_ADDRESSES.JUNIOR_DEV_2}, false)`);
console.log(`   recordHiringOutcome(${SAMPLE_ADDRESSES.JUNIOR_DEV_3}, true)`);

console.log('\n📊 VERIFICATION FUNCTIONS:');
console.log('═════════════════════════════');
console.log('getReviewerPool()                 // Check all approved reviewers');
console.log('isReviewer(address)               // Verify reviewer status');
console.log('verifiedUsers(address)            // Check Self Protocol verification');
console.log('DAO_ADMIN()                       // Get DAO admin address');

console.log('\n🎯 EXPECTED EVENTS TO MONITOR:');
console.log('═══════════════════════════════════');
console.log('ReviewerApproved(reviewer, timestamp)');
console.log('SkillRated(reviewer, junior, skillHash, rating)');
console.log('CreditsSpent(sponsor, candidate, jobHash, credits)');
console.log('HiringOutcome(candidate, isHired, timestamp)');

console.log('\n🔗 KNOWLEDGE GRAPH RESULTS:');
console.log('═══════════════════════════════');
console.log('📈 Entities Created:');
console.log('   • 7 Users (1 DAO + 3 reviewers + 3 juniors)');
console.log('   • 3+ Skills (JavaScript, Solidity, React)');  
console.log('   • 2+ Jobs (Frontend Dev, Smart Contract Dev)');
console.log('   • 3 Reviewers (Approved reviewer entities)');

console.log('\n🔄 Relationships Created:');
console.log('   • 5+ Rating relationships');
console.log('   • 3+ Sponsorship relationships');
console.log('   • 3+ HiringOutcome relationships');

console.log('\n💡 PRO TIPS:');
console.log('═══════════════');
console.log('• Switch accounts in Remix before calling functions');
console.log('• Check transaction logs to verify events are emitted');
console.log('• Save skill/job hashes from getHash() calls');  
console.log('• Monitor gas usage for each transaction');
console.log('• Use different rating values (1-10) for variety');

console.log('\n🚀 Ready to test your OnchainTrustNetwork! 🚀');
console.log('Follow the sequence above in Remix IDE to generate comprehensive test data.\n');

// Export functions for potential use
export {
  SAMPLE_ADDRESSES,
  generateSkillHash,
  generateJobHash,
  skills,
  jobs
};