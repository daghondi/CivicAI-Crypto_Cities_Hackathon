// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Infinita City Credits (I₵C) Token
 * @dev ERC20 token for rewarding civic engagement in island governance
 * Features:
 * - Mintable by governance contract for civic rewards
 * - Burnable for utility usage
 * - Pausable for emergency situations
 * - Ownable for admin functions
 */
contract ICCToken is ERC20, ERC20Burnable, Pausable, Ownable {
    // Token configuration
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1M I₵C tokens
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 10M I₵C max supply
    
    // Governance and reward addresses
    address public governanceContract;
    address public rewardDistributor;
    
    // Reward rates for different civic actions
    mapping(string => uint256) public rewardRates;
    
    // User activity tracking
    mapping(address => uint256) public lastRewardTime;
    mapping(address => uint256) public totalRewardsEarned;
    
    // Events
    event GovernanceContractUpdated(address indexed newGovernance);
    event RewardDistributorUpdated(address indexed newDistributor);
    event RewardRateUpdated(string action, uint256 newRate);
    event CivicRewardMinted(address indexed recipient, string action, uint256 amount);
    
    // Modifiers
    modifier onlyGovernanceOrDistributor() {
        require(
            msg.sender == governanceContract || msg.sender == rewardDistributor || msg.sender == owner(),
            "ICCToken: Unauthorized minter"
        );
        _;
    }
    
    modifier withinSupplyLimit(uint256 amount) {
        require(totalSupply() + amount <= MAX_SUPPLY, "ICCToken: Exceeds max supply");
        _;
    }
    
    constructor(
        address _initialOwner,
        address _rewardDistributor
    ) ERC20("Infinita City Credits", "ICC") {
        _transferOwnership(_initialOwner);
        rewardDistributor = _rewardDistributor;
        
        // Initialize reward rates (in wei, 18 decimals)
        rewardRates["proposal_creation"] = 50 * 10**18;  // 50 I₵C for creating proposal
        rewardRates["vote_cast"] = 10 * 10**18;          // 10 I₵C for voting
        rewardRates["proposal_passed"] = 100 * 10**18;   // 100 I₵C for successful proposal
        rewardRates["early_voter"] = 15 * 10**18;        // 15 I₵C for voting early
        rewardRates["community_engagement"] = 25 * 10**18; // 25 I₵C for sustained engagement
        
        // Mint initial supply to owner for distribution
        _mint(_initialOwner, INITIAL_SUPPLY);
        
        emit RewardDistributorUpdated(_rewardDistributor);
    }
    
    /**
     * @dev Mint I₵C tokens as civic engagement rewards
     * @param recipient Address to receive the reward
     * @param action Type of civic action performed
     * @param amount Amount of tokens to mint (if 0, uses default rate)
     */
    function mintCivicReward(
        address recipient,
        string memory action,
        uint256 amount
    ) external onlyGovernanceOrDistributor whenNotPaused withinSupplyLimit(amount) {
        require(recipient != address(0), "ICCToken: Invalid recipient");
        
        // Use default rate if amount is 0
        uint256 rewardAmount = amount > 0 ? amount : rewardRates[action];
        require(rewardAmount > 0, "ICCToken: Invalid reward amount");
        
        // Anti-spam: minimum 1 hour between rewards for same user
        require(
            block.timestamp >= lastRewardTime[recipient] + 1 hours,
            "ICCToken: Reward cooldown active"
        );
        
        _mint(recipient, rewardAmount);
        lastRewardTime[recipient] = block.timestamp;
        totalRewardsEarned[recipient] += rewardAmount;
        
        emit CivicRewardMinted(recipient, action, rewardAmount);
    }
    
    /**
     * @dev Batch mint rewards for multiple recipients
     * @param recipients Array of addresses to receive rewards
     * @param action Type of civic action performed
     * @param amounts Array of reward amounts (use 0 for default rates)
     */
    function batchMintCivicRewards(
        address[] memory recipients,
        string memory action,
        uint256[] memory amounts
    ) external onlyGovernanceOrDistributor whenNotPaused {
        require(recipients.length == amounts.length, "ICCToken: Array length mismatch");
        require(recipients.length <= 100, "ICCToken: Batch too large");
        
        uint256 totalMintAmount = 0;
        
        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 rewardAmount = amounts[i] > 0 ? amounts[i] : rewardRates[action];
            
            if (recipient != address(0) && rewardAmount > 0 && 
                block.timestamp >= lastRewardTime[recipient] + 1 hours) {
                
                totalMintAmount += rewardAmount;
                lastRewardTime[recipient] = block.timestamp;
                totalRewardsEarned[recipient] += rewardAmount;
                
                emit CivicRewardMinted(recipient, action, rewardAmount);
            }
        }
        
        require(totalSupply() + totalMintAmount <= MAX_SUPPLY, "ICCToken: Exceeds max supply");
        
        // Mint all rewards to this contract first, then distribute
        if (totalMintAmount > 0) {
            _mint(address(this), totalMintAmount);
            
            for (uint256 i = 0; i < recipients.length; i++) {
                address recipient = recipients[i];
                uint256 rewardAmount = amounts[i] > 0 ? amounts[i] : rewardRates[action];
                
                if (recipient != address(0) && rewardAmount > 0) {
                    _transfer(address(this), recipient, rewardAmount);
                }
            }
        }
    }
    
    /**
     * @dev Update governance contract address
     * @param _governanceContract New governance contract address
     */
    function setGovernanceContract(address _governanceContract) external onlyOwner {
        require(_governanceContract != address(0), "ICCToken: Invalid governance address");
        governanceContract = _governanceContract;
        emit GovernanceContractUpdated(_governanceContract);
    }
    
    /**
     * @dev Update reward distributor address
     * @param _rewardDistributor New reward distributor address
     */
    function setRewardDistributor(address _rewardDistributor) external onlyOwner {
        require(_rewardDistributor != address(0), "ICCToken: Invalid distributor address");
        rewardDistributor = _rewardDistributor;
        emit RewardDistributorUpdated(_rewardDistributor);
    }
    
    /**
     * @dev Update reward rate for a specific civic action
     * @param action Civic action type
     * @param rate New reward rate in wei (18 decimals)
     */
    function setRewardRate(string memory action, uint256 rate) external onlyOwner {
        require(rate <= 1000 * 10**18, "ICCToken: Rate too high"); // Max 1000 I₵C per action
        rewardRates[action] = rate;
        emit RewardRateUpdated(action, rate);
    }
    
    /**
     * @dev Get reward rate for a specific action
     * @param action Civic action type
     * @return Reward rate in wei
     */
    function getRewardRate(string memory action) external view returns (uint256) {
        return rewardRates[action];
    }
    
    /**
     * @dev Get user's total rewards earned
     * @param user User address
     * @return Total I₵C rewards earned by user
     */
    function getUserRewards(address user) external view returns (uint256) {
        return totalRewardsEarned[user];
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
     * @dev Override _beforeTokenTransfer to include pausable functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Emergency token recovery function
     * @param token Token contract address
     * @param amount Amount to recover
     */
    function emergencyTokenRecovery(address token, uint256 amount) external onlyOwner {
        require(token != address(this), "ICCToken: Cannot recover own tokens");
        IERC20(token).transfer(owner(), amount);
    }
    
    /**
     * @dev Get contract version
     * @return Version string
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}
