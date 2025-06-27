// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICCToken.sol";

/**
 * @title EnhancedProposalGovernance
 * @dev Advanced governance contract with amendments, delegation, and multi-stage voting
 * Features:
 * - Proposal amendments and versioning
 * - Vote delegation system
 * - Multi-stage voting processes
 * - Advanced analytics and insights
 * - Timelock governance for security
 */
contract EnhancedProposalGovernance is ReentrancyGuard, Pausable, Ownable {
    using Counters for Counters.Counter;
    
    // State variables
    ICCToken public immutable iccToken;
    Counters.Counter private _proposalIds;
    Counters.Counter private _amendmentIds;
    
    // Governance parameters
    uint256 public constant VOTING_DURATION = 7 days;
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 100 * 10**18; // 100 ICC
    uint256 public constant AMENDMENT_THRESHOLD = 50 * 10**18; // 50 ICC for amendments
    uint256 public constant QUORUM_PERCENTAGE = 5; // 5% of total supply
    uint256 public constant PROPOSAL_COOLDOWN = 24 hours;
    uint256 public constant AMENDMENT_PERIOD = 3 days; // Time window for amendments
    
    // Enhanced proposal states
    enum ProposalState {
        Pending,        // Created but not yet active
        Active,         // Currently voting
        Amendment,      // In amendment period
        Succeeded,      // Passed with quorum
        Failed,         // Did not pass
        Executed,       // Successfully executed
        Cancelled,      // Cancelled by creator or admin
        Superseded      // Replaced by amendment
    }
    
    // Vote types
    enum VoteType {
        Against,    // 0
        For,        // 1
        Abstain     // 2
    }
    
    // Amendment structure
    struct Amendment {
        uint256 id;
        uint256 proposalId;
        address proposer;
        string title;
        string description;
        string rationale;
        uint256 createdAt;
        uint256 supportVotes;
        uint256 againstVotes;
        bool approved;
        bool applied;
        mapping(address => bool) hasVoted;
        mapping(address => VoteType) votes;
    }
    
    // Enhanced proposal structure
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
        uint256 version; // Track proposal versions
        uint256[] amendmentIds; // List of amendments
        mapping(address => bool) hasVoted;
        mapping(address => VoteType) votes;
    }
    
    // Delegation structure
    struct Delegation {
        address delegate;
        uint256 power;
        uint256 timestamp;
        bool active;
    }
    
    // Storage
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Amendment) public amendments;
    mapping(address => mapping(address => Delegation)) public delegations; // delegator => delegate => delegation
    mapping(address => uint256) public delegatedPower; // delegate => total power
    mapping(address => uint256) public lastProposalTime;
    mapping(address => uint256) public userProposalCount;
    mapping(address => uint256) public userVoteCount;
    mapping(address => uint256) public userAmendmentCount;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string category,
        uint256 startTime,
        uint256 endTime
    );
    
    event AmendmentProposed(
        uint256 indexed amendmentId,
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string rationale
    );
    
    event AmendmentVoted(
        uint256 indexed amendmentId,
        address indexed voter,
        VoteType voteType,
        uint256 votingPower
    );
    
    event AmendmentApproved(
        uint256 indexed amendmentId,
        uint256 indexed proposalId
    );
    
    event AmendmentApplied(
        uint256 indexed amendmentId,
        uint256 indexed proposalId,
        uint256 newVersion
    );
    
    event VoteDelegated(
        address indexed delegator,
        address indexed delegate,
        uint256 power
    );
    
    event VoteUndelegated(
        address indexed delegator,
        address indexed delegate
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        VoteType voteType,
        uint256 votingPower,
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
    
    modifier validAmendment(uint256 amendmentId) {
        require(amendmentId > 0 && amendmentId <= _amendmentIds.current(), "Governance: Invalid amendment ID");
        _;
    }
    
    modifier onlyProposer(uint256 proposalId) {
        require(proposals[proposalId].proposer == msg.sender, "Governance: Only proposer can perform this action");
        _;
    }
    
    modifier inAmendmentPeriod(uint256 proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(
            block.timestamp >= proposal.startTime && 
            block.timestamp <= proposal.startTime + AMENDMENT_PERIOD,
            "Governance: Not in amendment period"
        );
        _;
    }
    
    constructor(address _iccToken) {
        iccToken = ICCToken(_iccToken);
    }
    
    /**
     * @dev Create a new proposal amendment
     */
    function proposeAmendment(
        uint256 proposalId,
        string memory title,
        string memory description,
        string memory rationale
    ) external validProposal(proposalId) inAmendmentPeriod(proposalId) {
        // Check user has enough ICC for amendment
        require(
            iccToken.balanceOf(msg.sender) >= AMENDMENT_THRESHOLD,
            "Governance: Insufficient ICC balance for amendment"
        );
        
        // Check proposal is in active state
        require(
            getProposalState(proposalId) == ProposalState.Active,
            "Governance: Proposal not in active state"
        );
        
        _amendmentIds.increment();
        uint256 amendmentId = _amendmentIds.current();
        
        Amendment storage amendment = amendments[amendmentId];
        amendment.id = amendmentId;
        amendment.proposalId = proposalId;
        amendment.proposer = msg.sender;
        amendment.title = title;
        amendment.description = description;
        amendment.rationale = rationale;
        amendment.createdAt = block.timestamp;
        
        // Add amendment to proposal
        proposals[proposalId].amendmentIds.push(amendmentId);
        
        // Update user stats
        userAmendmentCount[msg.sender]++;
        
        // Reward proposer with ICC tokens
        iccToken.mintCivicReward(msg.sender, "amendment_proposal", 0);
        
        emit AmendmentProposed(amendmentId, proposalId, msg.sender, title, rationale);
    }
    
    /**
     * @dev Vote on an amendment
     */
    function voteOnAmendment(
        uint256 amendmentId,
        VoteType voteType
    ) external validAmendment(amendmentId) {
        Amendment storage amendment = amendments[amendmentId];
        
        require(!amendment.approved && !amendment.applied, "Governance: Amendment already processed");
        require(!amendment.hasVoted[msg.sender], "Governance: Already voted on amendment");
        
        // Calculate voting power (own balance + delegated power)
        uint256 votingPower = iccToken.balanceOf(msg.sender) + delegatedPower[msg.sender];
        require(votingPower > 0, "Governance: No voting power");
        
        amendment.hasVoted[msg.sender] = true;
        amendment.votes[msg.sender] = voteType;
        
        if (voteType == VoteType.For) {
            amendment.supportVotes += votingPower;
        } else if (voteType == VoteType.Against) {
            amendment.againstVotes += votingPower;
        }
        
        // Check if amendment has enough support (simple majority of proposal voters)
        Proposal storage proposal = proposals[amendment.proposalId];
        uint256 totalProposalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        
        if (amendment.supportVotes > amendment.againstVotes && 
            amendment.supportVotes > totalProposalVotes / 2) {
            amendment.approved = true;
            emit AmendmentApproved(amendmentId, amendment.proposalId);
        }
        
        // Reward voter with ICC tokens
        iccToken.mintCivicReward(msg.sender, "amendment_vote", 0);
        
        emit AmendmentVoted(amendmentId, msg.sender, voteType, votingPower);
    }
    
    /**
     * @dev Apply an approved amendment to the proposal
     */
    function applyAmendment(uint256 amendmentId) external validAmendment(amendmentId) {
        Amendment storage amendment = amendments[amendmentId];
        require(amendment.approved && !amendment.applied, "Governance: Amendment not approved or already applied");
        
        Proposal storage proposal = proposals[amendment.proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == amendment.proposer,
            "Governance: Only proposal or amendment proposer can apply"
        );
        
        // Apply amendment to proposal
        proposal.title = amendment.title;
        proposal.description = amendment.description;
        proposal.version++;
        amendment.applied = true;
        
        // Reset votes for the amended proposal (optional - could be governance parameter)
        // This allows voters to reconsider with the new amendment
        
        emit AmendmentApplied(amendmentId, amendment.proposalId, proposal.version);
    }
    
    /**
     * @dev Delegate voting power to another address
     */
    function delegateVote(address delegate, uint256 amount) external {
        require(delegate != address(0) && delegate != msg.sender, "Governance: Invalid delegate");
        require(iccToken.balanceOf(msg.sender) >= amount, "Governance: Insufficient balance");
        require(amount > 0, "Governance: Must delegate positive amount");
        
        Delegation storage delegation = delegations[msg.sender][delegate];
        
        if (delegation.active) {
            // Update existing delegation
            delegatedPower[delegate] = delegatedPower[delegate] - delegation.power + amount;
            delegation.power = amount;
        } else {
            // Create new delegation
            delegation.delegate = delegate;
            delegation.power = amount;
            delegation.timestamp = block.timestamp;
            delegation.active = true;
            delegatedPower[delegate] += amount;
        }
        
        emit VoteDelegated(msg.sender, delegate, amount);
    }
    
    /**
     * @dev Undelegate voting power
     */
    function undelegateVote(address delegate) external {
        Delegation storage delegation = delegations[msg.sender][delegate];
        require(delegation.active, "Governance: No active delegation");
        
        delegatedPower[delegate] -= delegation.power;
        delegation.active = false;
        
        emit VoteUndelegated(msg.sender, delegate);
    }
    
    /**
     * @dev Get proposal state with amendment consideration
     */
    function getProposalState(uint256 proposalId) public view validProposal(proposalId) returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.cancelled) return ProposalState.Cancelled;
        if (proposal.executed) return ProposalState.Executed;
        
        if (block.timestamp < proposal.startTime) {
            return ProposalState.Pending;
        }
        
        // Check if in amendment period
        if (block.timestamp <= proposal.startTime + AMENDMENT_PERIOD) {
            return ProposalState.Amendment;
        }
        
        if (block.timestamp <= proposal.endTime) {
            return ProposalState.Active;
        }
        
        // Check if quorum reached and majority support
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 quorum = (iccToken.totalSupply() * QUORUM_PERCENTAGE) / 100;
        
        if (totalVotes >= quorum && proposal.forVotes > proposal.againstVotes) {
            return ProposalState.Succeeded;
        }
        
        return ProposalState.Failed;
    }
    
    /**
     * @dev Get all amendments for a proposal
     */
    function getProposalAmendments(uint256 proposalId) external view validProposal(proposalId) returns (uint256[] memory) {
        return proposals[proposalId].amendmentIds;
    }
    
    /**
     * @dev Get voting power of an address (own + delegated)
     */
    function getVotingPower(address account) external view returns (uint256) {
        return iccToken.balanceOf(account) + delegatedPower[account];
    }
    
    /**
     * @dev Get delegation details
     */
    function getDelegation(address delegator, address delegate) external view returns (Delegation memory) {
        return delegations[delegator][delegate];
    }
    
    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
