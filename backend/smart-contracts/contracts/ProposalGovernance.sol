// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICCToken.sol";

/**
 * @title ProposalGovernance
 * @dev Decentralized governance contract for civic proposals with I₵C token rewards
 * Features:
 * - Proposal creation and voting
 * - I₵C token integration for rewards
 * - Quorum and time-based voting
 * - Anti-spam and security measures
 * - Proposal execution tracking
 */
contract ProposalGovernance is ReentrancyGuard, Pausable, Ownable {
    using Counters for Counters.Counter;
    
    // State variables
    ICCToken public immutable iccToken;
    Counters.Counter private _proposalIds;
    
    // Governance parameters
    uint256 public constant VOTING_DURATION = 7 days;
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 100 * 10**18; // 100 I₵C to create proposal
    uint256 public constant QUORUM_PERCENTAGE = 5; // 5% of total supply for quorum
    uint256 public constant PROPOSAL_COOLDOWN = 24 hours; // 24h between proposals per user
    
    // Proposal states
    enum ProposalState {
        Pending,    // Created but not yet active
        Active,     // Currently voting
        Succeeded,  // Passed with quorum
        Failed,     // Did not pass
        Executed,   // Successfully executed
        Cancelled   // Cancelled by creator or admin
    }
    
    // Vote types
    enum VoteType {
        Against,    // 0
        For,        // 1
        Abstain     // 2
    }
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        string title;
        string description;
        string category;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        bool cancelled;
        mapping(address => bool) hasVoted;
        mapping(address => VoteType) votes;
    }
    
    // Storage
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public lastProposalTime;
    mapping(address => uint256) public userProposalCount;
    mapping(address => uint256) public userVoteCount;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string category,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        VoteType voteType,
        uint256 timestamp
    );
    
    event ProposalExecuted(uint256 indexed proposalId, bool success);
    event ProposalCancelled(uint256 indexed proposalId, address indexed canceller);
    event QuorumReached(uint256 indexed proposalId, uint256 totalVotes);
    
    // Modifiers
    modifier validProposal(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= _proposalIds.current(), "Governance: Invalid proposal ID");
        _;
    }
    
    modifier onlyProposer(uint256 proposalId) {
        require(proposals[proposalId].proposer == msg.sender, "Governance: Not proposer");
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(proposals[proposalId].proposer != address(0), "Governance: Proposal does not exist");
        _;
    }
    
    constructor(address _iccToken, address _initialOwner) {
        require(_iccToken != address(0), "Governance: Invalid token address");
        require(_initialOwner != address(0), "Governance: Invalid owner address");
        
        iccToken = ICCToken(_iccToken);
        _transferOwnership(_initialOwner);
    }
    
    /**
     * @dev Create a new governance proposal
     * @param title Proposal title
     * @param description Proposal description
     * @param category Proposal category
     */
    function createProposal(
        string memory title,
        string memory description,
        string memory category
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(bytes(title).length > 0, "Governance: Empty title");
        require(bytes(description).length > 0, "Governance: Empty description");
        require(iccToken.balanceOf(msg.sender) >= MIN_PROPOSAL_THRESHOLD, "Governance: Insufficient ICC balance");
        require(
            block.timestamp >= lastProposalTime[msg.sender] + PROPOSAL_COOLDOWN,
            "Governance: Proposal cooldown active"
        );
        
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.category = category;
        newProposal.proposer = msg.sender;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_DURATION;
        
        lastProposalTime[msg.sender] = block.timestamp;
        userProposalCount[msg.sender]++;
        
        // Reward proposer with I₵C tokens
        iccToken.mintCivicReward(msg.sender, "proposal_creation", 0);
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            title,
            category,
            newProposal.startTime,
            newProposal.endTime
        );
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     * @param proposalId ID of the proposal to vote on
     * @param voteType Type of vote (0=Against, 1=For, 2=Abstain)
     */
    function castVote(
        uint256 proposalId,
        VoteType voteType
    ) external validProposal(proposalId) whenNotPaused nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.startTime, "Governance: Voting not started");
        require(block.timestamp <= proposal.endTime, "Governance: Voting ended");
        require(!proposal.hasVoted[msg.sender], "Governance: Already voted");
        require(!proposal.cancelled, "Governance: Proposal cancelled");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = voteType;
        
        if (voteType == VoteType.For) {
            proposal.forVotes++;
        } else if (voteType == VoteType.Against) {
            proposal.againstVotes++;
        } else {
            proposal.abstainVotes++;
        }
        
        userVoteCount[msg.sender]++;
        
        // Reward voter with I₵C tokens
        string memory rewardType = "vote_cast";
        if (block.timestamp <= proposal.startTime + 1 days) {
            rewardType = "early_voter"; // Higher reward for early voting
        }
        iccToken.mintCivicReward(msg.sender, rewardType, 0);
        
        emit VoteCast(proposalId, msg.sender, voteType, block.timestamp);
        
        // Check if quorum is reached
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 requiredQuorum = (iccToken.totalSupply() * QUORUM_PERCENTAGE) / 100;
        
        if (totalVotes >= requiredQuorum) {
            emit QuorumReached(proposalId, totalVotes);
        }
    }
    
    /**
     * @dev Execute a passed proposal
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) 
        external 
        validProposal(proposalId) 
        whenNotPaused 
        nonReentrant 
    {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp > proposal.endTime, "Governance: Voting still active");
        require(!proposal.executed, "Governance: Already executed");
        require(!proposal.cancelled, "Governance: Proposal cancelled");
        require(getProposalState(proposalId) == ProposalState.Succeeded, "Governance: Proposal did not pass");
        
        proposal.executed = true;
        
        // Reward proposer for successful proposal
        iccToken.mintCivicReward(proposal.proposer, "proposal_passed", 0);
        
        emit ProposalExecuted(proposalId, true);
    }
    
    /**
     * @dev Cancel a proposal (only by proposer or admin)
     * @param proposalId ID of the proposal to cancel
     */
    function cancelProposal(uint256 proposalId) 
        external 
        validProposal(proposalId) 
        whenNotPaused 
    {
        Proposal storage proposal = proposals[proposalId];
        
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Governance: Not authorized to cancel"
        );
        require(block.timestamp <= proposal.endTime, "Governance: Voting ended");
        require(!proposal.cancelled, "Governance: Already cancelled");
        require(!proposal.executed, "Governance: Already executed");
        
        proposal.cancelled = true;
        
        emit ProposalCancelled(proposalId, msg.sender);
    }
    
    /**
     * @dev Get the current state of a proposal
     * @param proposalId ID of the proposal
     * @return Current proposal state
     */
    function getProposalState(uint256 proposalId) 
        public 
        view 
        validProposal(proposalId) 
        returns (ProposalState) 
    {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.cancelled) {
            return ProposalState.Cancelled;
        }
        
        if (proposal.executed) {
            return ProposalState.Executed;
        }
        
        if (block.timestamp <= proposal.endTime) {
            return ProposalState.Active;
        }
        
        // Check if proposal passed
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 requiredQuorum = (iccToken.totalSupply() * QUORUM_PERCENTAGE) / 100;
        
        if (totalVotes >= requiredQuorum && proposal.forVotes > proposal.againstVotes) {
            return ProposalState.Succeeded;
        } else {
            return ProposalState.Failed;
        }
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     */
    function getProposal(uint256 proposalId) 
        external 
        view 
        validProposal(proposalId) 
        returns (
            uint256 id,
            string memory title,
            string memory description,
            string memory category,
            address proposer,
            uint256 startTime,
            uint256 endTime,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            bool executed,
            bool cancelled
        ) 
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.category,
            proposal.proposer,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.executed,
            proposal.cancelled
        );
    }
    
    /**
     * @dev Check if user has voted on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     */
    function getVote(uint256 proposalId, address voter) 
        external 
        view 
        validProposal(proposalId) 
        returns (bool hasVoted, VoteType voteType) 
    {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.hasVoted[voter], proposal.votes[voter]);
    }
    
    /**
     * @dev Get total number of proposals
     * @return Current proposal count
     */
    function getProposalCount() external view returns (uint256) {
        return _proposalIds.current();
    }
    
    /**
     * @dev Get user statistics
     * @param user Address of the user
     * @return proposalCount Number of proposals created by user
     * @return voteCount Number of votes cast by user
     * @return lastProposal Timestamp of last proposal creation
     */
    function getUserStats(address user) 
        external 
        view 
        returns (
            uint256 proposalCount,
            uint256 voteCount,
            uint256 lastProposal
        ) 
    {
        return (
            userProposalCount[user],
            userVoteCount[user],
            lastProposalTime[user]
        );
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract version
     * @return Version string
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}
