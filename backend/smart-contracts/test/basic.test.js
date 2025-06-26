const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICCToken Basic Test", function () {
  let ICCToken;
  let iccToken;
  let owner;
  let rewardDistributor;
  let governance;
  let user1;

  beforeEach(async function () {
    [owner, rewardDistributor, governance, user1] = await ethers.getSigners();
    
    ICCToken = await ethers.getContractFactory("ICCToken");
    iccToken = await ICCToken.deploy(owner.address, rewardDistributor.address);
    await iccToken.waitForDeployment();
    
    await iccToken.setGovernanceContract(governance.address);
  });

  describe("Basic Functionality", function () {
    it("Should deploy correctly", async function () {
      expect(await iccToken.name()).to.equal("Infinita City Credits");
      expect(await iccToken.symbol()).to.equal("ICC");
      expect(await iccToken.owner()).to.equal(owner.address);
    });

    it("Should allow governance to mint rewards", async function () {
      const rewardAmount = ethers.parseEther("50");
      
      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "proposal_creation",
        rewardAmount
      );
      
      expect(await iccToken.balanceOf(user1.address)).to.equal(rewardAmount);
    });

    it("Should have correct reward rates", async function () {
      expect(await iccToken.getRewardRate("proposal_creation")).to.equal(ethers.parseEther("50"));
      expect(await iccToken.getRewardRate("vote_cast")).to.equal(ethers.parseEther("10"));
    });
  });
});

describe("ProposalGovernance Basic Test", function () {
  let ICCToken;
  let iccToken;
  let ProposalGovernance;
  let governance;
  let owner;
  let proposer;
  let voter1;

  beforeEach(async function () {
    [owner, proposer, voter1] = await ethers.getSigners();
    
    // Deploy ICC Token first
    ICCToken = await ethers.getContractFactory("ICCToken");
    iccToken = await ICCToken.deploy(owner.address, owner.address);
    await iccToken.waitForDeployment();
    
    // Deploy Governance contract
    ProposalGovernance = await ethers.getContractFactory("ProposalGovernance");
    governance = await ProposalGovernance.deploy(await iccToken.getAddress(), owner.address);
    await governance.waitForDeployment();
    
    // Set governance contract in ICC token
    await iccToken.setGovernanceContract(await governance.getAddress());
    
    // Give proposer enough ICC tokens to create proposals
    await iccToken.transfer(proposer.address, ethers.parseEther("1000"));
  });

  describe("Basic Functionality", function () {
    it("Should deploy correctly", async function () {
      expect(await governance.iccToken()).to.equal(await iccToken.getAddress());
      expect(await governance.owner()).to.equal(owner.address);
      expect(await governance.getProposalCount()).to.equal(0);
    });

    it("Should allow proposal creation", async function () {
      await governance.connect(proposer).createProposal(
        "Test Proposal",
        "This is a test proposal description",
        "infrastructure"
      );
      
      expect(await governance.getProposalCount()).to.equal(1);
    });

    it("Should not allow proposal creation without sufficient ICC", async function () {
      await expect(
        governance.connect(voter1).createProposal(
          "Test Proposal",
          "Description",
          "infrastructure"
        )
      ).to.be.revertedWith("Governance: Insufficient ICC balance");
    });
  });
});
