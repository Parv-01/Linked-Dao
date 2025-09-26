// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ====================================================================
// ONCHAIN TRUST NETWORK (OnchainTrustNetwork.sol)
// Purpose: Provides immutable proof of trust actions (Ratings, Sponsorships, Hires).
// Data Storage: Uses state only for access control (Reviewer status) and relies
//               entirely on Events for data that will be indexed and queried by The Graph.
// ====================================================================

contract OnchainTrustNetwork {
    // --- STATE VARIABLES ---

    // The wallet address initially granted administrative rights (DAO control for MVP).
    address public immutable DAO_ADMIN;

    // Tracks which addresses are approved to act as senior reviewers (DAO members).
    mapping(address => bool) public isReviewer;

    // Tracks all addresses that have been approved (for easy reading/listing by The Graph).
    address[] public ReviewerPool;

    // --- MODIFIERS (Access Control) ---

    modifier onlyDAOAdmin() {
        require(msg.sender == DAO_ADMIN, "Admin only access.");
        _;
    }

    modifier onlyReviewer() {
        require(isReviewer[msg.sender], "Reviewer status required.");
        _;
    }

    // --- EVENTS (Data Source for The Graph) ---

    // 1. Emitted when a new DAO reviewer is authorized.
    event ReviewerApproved(
        address indexed reviewer,
        uint256 timestamp
    );

    // 2. Emitted when a verified reviewer rates a junior dev's skill/performance.
    event SkillRated(
        address indexed reviewer,
        address indexed junior,
        bytes32 indexed skillHash, // Fixed size ID for hardcoded skill string (e.g., Keccak256("ReactDev"))
        uint8 overallRating
    );

    // 3. Emitted when a reviewer spends credits to highlight a candidate.
    event CreditsSpent(
        address indexed sponsor,
        address indexed candidate,
        bytes32 indexed jobIdHash, // Fixed size ID for the specific job post
        uint256 creditsUsed
    );

    // 4. Emitted when a company (HM) provides feedback on a candidate's hiring outcome.
    event HiringOutcome(
        address indexed candidate,
        bool isHired, // true if hired, false if rejected
        uint256 timestamp
    );

    // --- CONSTRUCTOR ---

    constructor(address _initialDAOAdmin) {
        DAO_ADMIN = _initialDAOAdmin;
        // Optionally make the deployer the first reviewer for testing
        isReviewer[DAO_ADMIN] = true;
        ReviewerPool.push(DAO_ADMIN);
        emit ReviewerApproved(DAO_ADMIN, block.timestamp);
    }

    // --- CORE FUNCTIONS ---

    // 1. DAO Function: Authorize a new reviewer.
    function approveReviewer(address _newReviewer) external onlyDAOAdmin {
        require(!isReviewer[_newReviewer], "Reviewer already approved.");
        
        isReviewer[_newReviewer] = true;
        ReviewerPool.push(_newReviewer);

        emit ReviewerApproved(_newReviewer, block.timestamp);
    }

    // 2. Core Action: Submit a skill rating for a junior developer.
    // Note: The Reviewer's identity (msg.sender) is inherently verifiable.
    function rateJunior(
        address _juniorDev,
        bytes32 _skillHash,
        uint8 _rating
    ) external onlyReviewer {
        // Basic checks: rating must be valid (e.g., 1 to 5, or 1 to 10 scale, using uint8 for gas savings)
        require(_rating > 0 && _rating <= 10, "Rating must be between 1 and 10.");

        emit SkillRated(
            msg.sender,
            _juniorDev,
            _skillHash,
            _rating
        );
    }

    // 3. Core Action: Spend earned credits to sponsor a job application.
    // Note: The check if the Reviewer has sufficient credits is handled OFF-CHAIN before calling this TX.
    // The Graph will record the transaction regardless, but the application logic will only show the sponsorship
    // if the resulting creditBalance is non-negative (simplifying the contract).
    function sponsorApplication(
        address _candidate,
        bytes32 _jobIdHash,
        uint256 _credits
    ) external onlyReviewer {
        require(_credits > 0, "Must spend a positive amount of credits.");

        emit CreditsSpent(
            msg.sender,
            _candidate,
            _jobIdHash,
            _credits
        );
    }

    // 4. Core Action: Record the hiring outcome to close the reputation loop.
    // Note: This must be restricted to a trusted party (HM or DAO Admin).
    function recordHiringOutcome(
        address _candidate,
        bool _isHired
    ) external onlyDAOAdmin {
        require(_candidate != address(0), "Candidate address cannot be zero.");

        emit HiringOutcome(_candidate, _isHired, block.timestamp);
    }

    // --- Helper Functions (View) ---

    // Helper to get the list of reviewers (used by front-end / The Graph setup)
    function getReviewerPool() external view returns (address[] memory) {
        return ReviewerPool;
    }

    // Helper to convert a string (like "ReactDev") to the indexed bytes32 hash.
    // The frontend should call this helper to get the correct hash before calling 'rateJunior'.
    function getHash(string memory _input) public pure returns (bytes32) {
        return keccak256(bytes(_input));
    }
}
