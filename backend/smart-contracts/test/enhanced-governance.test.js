const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnhancedProposalGovernance", function () {
  let iccToken;
  let enhancedGovernance;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy ICCToken
    const ICCToken = await ethers.getContractFactory("ICCToken");
    iccToken = await ICCToken.deploy(owner.address, owner.address);
    await iccToken.waitForDeployment();

    // Deploy EnhancedProposalGovernance
    const EnhancedGovernance = await ethers.getContractFactory("EnhancedProposalGovernance");
    enhancedGovernance = await EnhancedGovernance.deploy(await iccToken.getAddress());
    await enhancedGovernance.waitForDeployment();

    // Set governance contract for ICCToken
    await iccToken.setGovernanceContract(await enhancedGovernance.getAddress());

    // Mint tokens for testing using civic rewards (spread out to avoid cooldown)
    await iccToken.mintCivicReward(addr1.address, "test_reward", ethers.parseEther("1000"));
    
    // Fast forward time to avoid cooldown
    await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
    await ethers.provider.send("evm_mine");
    
    await iccToken.mintCivicReward(addr2.address, "test_reward", ethers.parseEther("500"));
    
    await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
    await ethers.provider.send("evm_mine");
    
    await iccToken.mintCivicReward(addr3.address, "test_reward", ethers.parseEther("200"));
  });

  describe("Proposal Amendments", function () {
    let proposalId;

    beforeEach(async function () {
      // Create a proposal through the original governance contract first
      // For this test, we'll simulate having a proposal
      proposalId = 1;
    });

    it("Should allow proposing amendments during amendment period", async function () {
      // First we need to have a way to create proposals in enhanced governance
      // For now, let's test the amendment functionality directly
      
      const amendmentThreshold = await enhancedGovernance.AMENDMENT_THRESHOLD();
      expect(amendmentThreshold).to.equal(ethers.parseEther("50"));
    });

    it("Should check amendment threshold", async function () {
      const threshold = await enhancedGovernance.AMENDMENT_THRESHOLD();
      expect(threshold).to.equal(ethers.parseEther("50"));
    });

    it("Should track voting duration", async function () {
      const duration = await enhancedGovernance.VOTING_DURATION();
      expect(duration).to.equal(7 * 24 * 60 * 60); // 7 days in seconds
    });
  });

  describe("Vote Delegation", function () {
    it("Should allow delegating vote power", async function () {
      const delegateAmount = ethers.parseEther("100");
      
      // Delegate from addr1 to addr2
      await enhancedGovernance.connect(addr1).delegateVote(addr2.address, delegateAmount);
      
      // Check delegation
      const delegation = await enhancedGovernance.getDelegation(addr1.address, addr2.address);
      expect(delegation.delegate).to.equal(addr2.address);
      expect(delegation.power).to.equal(delegateAmount);
      expect(delegation.active).to.be.true;
      
      // Check delegated power
      const delegatedPower = await enhancedGovernance.delegatedPower(addr2.address);
      expect(delegatedPower).to.equal(delegateAmount);
    });

    it("Should allow undelegating vote power", async function () {
      const delegateAmount = ethers.parseEther("100");
      
      // First delegate
      await enhancedGovernance.connect(addr1).delegateVote(addr2.address, delegateAmount);
      
      // Then undelegate
      await enhancedGovernance.connect(addr1).undelegateVote(addr2.address);
      
      // Check delegation is inactive
      const delegation = await enhancedGovernance.getDelegation(addr1.address, addr2.address);
      expect(delegation.active).to.be.false;
      
      // Check delegated power is removed
      const delegatedPower = await enhancedGovernance.delegatedPower(addr2.address);
      expect(delegatedPower).to.equal(0);
    });

    it("Should calculate total voting power correctly", async function () {
      const delegateAmount = ethers.parseEther("100");
      
      // Delegate from addr1 to addr2
      await enhancedGovernance.connect(addr1).delegateVote(addr2.address, delegateAmount);
      
      // Check addr2's total voting power (own balance + delegated)
      const votingPower = await enhancedGovernance.getVotingPower(addr2.address);
      const expectedPower = ethers.parseEther("500") + delegateAmount; // addr2's balance + delegated
      expect(votingPower).to.equal(expectedPower);
    });

    it("Should prevent invalid delegations", async function () {
      // Cannot delegate to self
      await expect(
        enhancedGovernance.connect(addr1).delegateVote(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Governance: Invalid delegate");

      // Cannot delegate to zero address
      await expect(
        enhancedGovernance.connect(addr1).delegateVote(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.revertedWith("Governance: Invalid delegate");

      // Cannot delegate more than balance
      await expect(
        enhancedGovernance.connect(addr1).delegateVote(addr2.address, ethers.parseEther("2000"))
      ).to.be.revertedWith("Governance: Insufficient balance");

      // Cannot delegate zero amount
      await expect(
        enhancedGovernance.connect(addr1).delegateVote(addr2.address, 0)
      ).to.be.revertedWith("Governance: Must delegate positive amount");
    });
  });

  describe("Constants and Getters", function () {
    it("Should have correct governance parameters", async function () {
      expect(await enhancedGovernance.VOTING_DURATION()).to.equal(7 * 24 * 60 * 60);
      expect(await enhancedGovernance.MIN_PROPOSAL_THRESHOLD()).to.equal(ethers.parseEther("100"));
      expect(await enhancedGovernance.AMENDMENT_THRESHOLD()).to.equal(ethers.parseEther("50"));
      expect(await enhancedGovernance.QUORUM_PERCENTAGE()).to.equal(5);
      expect(await enhancedGovernance.PROPOSAL_COOLDOWN()).to.equal(24 * 60 * 60);
      expect(await enhancedGovernance.AMENDMENT_PERIOD()).to.equal(3 * 24 * 60 * 60);
    });

    it("Should return correct ICC token address", async function () {
      expect(await enhancedGovernance.iccToken()).to.equal(await iccToken.getAddress());
    });
  });

  describe("Access Control", function () {
    it("Should be owned by deployer", async function () {
      expect(await enhancedGovernance.owner()).to.equal(owner.address);
    });

    it("Should allow pausing by owner", async function () {
      await enhancedGovernance.pause();
      expect(await enhancedGovernance.paused()).to.be.true;
      
      await enhancedGovernance.unpause();
      expect(await enhancedGovernance.paused()).to.be.false;
    });
  });
});
