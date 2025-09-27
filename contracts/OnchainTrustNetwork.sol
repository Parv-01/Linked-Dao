// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

// ====================================================================
// ONCHAIN TRUST NETWORK (Sybil-resistant, Self Protocol enabled)
// Provides immutable proof of trust actions (Ratings, Sponsorships, Hires).
// Data storage: Only access control on chain. All trust data via Events for The Graph/Hypergraph indexing.
// ====================================================================

import "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";

contract OnchainTrustNetwork is SelfVerificationRoot {
    // --- STATE VARIABLES ---
    address public immutable DAO_ADMIN;
    mapping(address => bool) public isReviewer;
    mapping(address => bool) public verifiedUsers;
    address[] public ReviewerPool;

    // --- MODIFIERS (Access Control + Self Verification) ---

    modifier onlyDAOAdmin() {
        require(msg.sender == DAO_ADMIN, "Admin only access.");
        _;
    }

    modifier onlyReviewer() {
        require(isReviewer[msg.sender], "Reviewer status required.");
        _;
    }

    modifier onlyVerifiedUser() {
        require(verifiedUsers[msg.sender], "Self Protocol verification required");
        _;
    }

    // --- EVENTS (for Hypergraph/The Graph indexing) ---

    event ReviewerApproved(
        address indexed reviewer,
        uint256 timestamp
    );

    event SkillRated(
        address indexed reviewer,
        address indexed junior,
        bytes32 indexed skillHash,
        uint8 overallRating
    );

    event CreditsSpent(
        address indexed sponsor,
        address indexed candidate,
        bytes32 indexed jobIdHash,
        uint256 creditsUsed
    );

    event HiringOutcome(
        address indexed candidate,
        bool isHired,
        uint256 timestamp
    );

    // --- CONSTRUCTOR ---

    // _selfHub: Address of deployed SelfHub on your network (see dashboard/docs)
    constructor(address _initialDAOAdmin, address _selfHub, string memory _scopeSeed)
        SelfVerificationRoot(_selfHub, _scopeSeed)
    {
        DAO_ADMIN = _initialDAOAdmin;
        isReviewer[DAO_ADMIN] = true;
        ReviewerPool.push(DAO_ADMIN);
        emit ReviewerApproved(DAO_ADMIN, block.timestamp);
    }

    // --- Required by Self Protocol: Your config id (from Self dashboard) ---
    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public pure override returns (bytes32) {
        // Return a hardcoded config ID - replace with your actual config ID from Self dashboard
        return bytes32(uint256(12345));
    }

    // --- CORE FUNCTIONS ---

    // 1. DAO: Authorize a new reviewer.
    function approveReviewer(address _newReviewer) external onlyDAOAdmin {
        require(!isReviewer[_newReviewer], "Reviewer already approved.");
        isReviewer[_newReviewer] = true;
        ReviewerPool.push(_newReviewer);
        emit ReviewerApproved(_newReviewer, block.timestamp);
    }

    // 2. Rate a junior developer (Sybil-resistant).
    function rateJunior(
        address _juniorDev,
        bytes32 _skillHash,
        uint8 _rating
    )
        external
        onlyVerifiedUser
        onlyReviewer
    {
        require(_rating > 0 && _rating <= 10, "Rating must be between 1 and 10.");
        emit SkillRated(msg.sender, _juniorDev, _skillHash, _rating);
    }

    // 3. Spend credits to sponsor a candidate (Sybil-resistant).
    function sponsorApplication(
        address _candidate,
        bytes32 _jobIdHash,
        uint256 _credits
    )
        external
        onlyVerifiedUser
        onlyReviewer
    {
        require(_credits > 0, "Must spend a positive amount of credits.");
        emit CreditsSpent(msg.sender, _candidate, _jobIdHash, _credits);
    }

    // 4. Record the hiring outcome (DAO Admin only).
    function recordHiringOutcome(
        address _candidate,
        bool _isHired
    )
        external
        onlyDAOAdmin
    {
        require(_candidate != address(0), "Candidate address cannot be zero.");
        emit HiringOutcome(_candidate, _isHired, block.timestamp);
    }

    // --- HELPER FUNCTIONS (VIEWS) ---

    function getReviewerPool() external view returns (address[] memory) {
        return ReviewerPool;
    }

    function getHash(string memory _input) public pure returns (bytes32) {
        return keccak256(bytes(_input));
    }

    // --- (Optional) Custom verification-hook logic: can override for logging, advanced gating etc. ---
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory /* userData */
    ) internal override {
        // Mark the user as verified based on the output
        address user = address(uint160(output.userIdentifier));
        verifiedUsers[user] = true;

        // Optionally record or log verified users here
    }
}