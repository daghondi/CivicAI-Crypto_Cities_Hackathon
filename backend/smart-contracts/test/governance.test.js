const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalGovernance", function () {
  let ICCToken;
  let iccToken;
  let ProposalGovernance;
  let governance;
  let owner;
  let proposer;
  let voter1;
  let voter2;
  let voter3;
  let addrs;

  beforeEach(async function () {
    [owner, proposer, voter1, voter2, voter3, ...addrs] = await ethers.getSigners();
    
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
    
    // Give proposer enough ICC tokens to create proposals (100 ICC required)
    await iccToken.transfer(proposer.address, ethers.utils.parseEther("1000"));
    
    // Give voters some ICC tokens
    await iccToken.transfer(voter1.address, ethers.utils.parseEther("100"));
    await iccToken.transfer(voter2.address, ethers.utils.parseEther("100"));
    await iccToken.transfer(voter3.address, ethers.utils.parseEther("100"));
  });

  describe("Deployment", function () {
    it("Should set the correct ICC token address", async function () {
      expect(await governance.iccToken()).to.equal(await iccToken.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await governance.owner()).to.equal(owner.address);
    });

    it("Should start with 0 proposals", async function () {
      expect(await governance.getProposalCount()).to.equal(0);
    });
  });

  describe("Proposal Creation", function () {
    it("Should allow user with sufficient ICC to create proposal", async function () {
      const tx = await governance.connect(proposer).createProposal(
        "Test Proposal",
        "This is a test proposal description",
        "infrastructure"
      );
      
      expect(await governance.getProposalCount()).to.equal(1);
      
      // Check proposal details
      const proposal = await governance.getProposal(1);
      expect(proposal.title).to.equal("Test Proposal");
      expect(proposal.description).to.equal("This is a test proposal description");
      expect(proposal.category).to.equal("infrastructure");
      expect(proposal.proposer).to.equal(proposer.address);
    });

    it("Should not allow proposal creation without sufficient ICC", async function () {
      await expect(
        governance.connect(voter1).createProposal( // voter1 has only 100 ICC, needs 100 minimum
          "Test Proposal",
          "Description",
          "infrastructure"
        )
      ).to.be.revertedWith("Governance: Insufficient I₵C balance");
    });

    it("Should not allow empty title or description", async function () {
      await expect(
        governance.connect(proposer).createProposal(
          "",
          "Description",
          "infrastructure"
        )
      ).to.be.revertedWith("Governance: Empty title");

      await expect(
        governance.connect(proposer).createProposal(
          "Title",
          "",
          "infrastructure"
        )
      ).to.be.revertedWith("Governance: Empty description");
    });

    it("Should enforce cooldown period between proposals", async function () {
      await governance.connect(proposer).createProposal(
        "First Proposal",
        "Description",
        "infrastructure"
      );

      await expect(
        governance.connect(proposer).createProposal(
          "Second Proposal",
          "Description",
          "infrastructure"
        )
      ).to.be.revertedWith("Governance: Proposal cooldown active");
    });

    it("Should reward proposer with ICC tokens", async function () {
      const initialBalance = await iccToken.balanceOf(proposer.address);
      
      await governance.connect(proposer).createProposal(
        "Test Proposal",
        "Description",
        "infrastructure"
      );
      
      const finalBalance = await iccToken.balanceOf(proposer.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Voting", function () {
    let proposalId;

    beforeEach(async function () {
      const tx = await governance.connect(proposer).createProposal(
        "Test Proposal",
        "This is a test proposal",
        "infrastructure"
      );
      proposalId = 1;
    });

    it("Should allow users to vote for a proposal", async function () {
      await governance.connect(voter1).castVote(proposalId, 1); // Vote For
      
      const proposal = await governance.getProposal(proposalId);
      expect(proposal.forVotes).to.equal(1);
      expect(proposal.againstVotes).to.equal(0);
      expect(proposal.abstainVotes).to.equal(0);
    });

    it("Should allow users to vote against a proposal", async function () {
      await governance.connect(voter1).castVote(proposalId, 0); // Vote Against
      
      const proposal = await governance.getProposal(proposalId);
      expect(proposal.forVotes).to.equal(0);
      expect(proposal.againstVotes).to.equal(1);
      expect(proposal.abstainVotes).to.equal(0);
    });

    it("Should allow users to abstain", async function () {
      await governance.connect(voter1).castVote(proposalId, 2); // Abstain
      
      const proposal = await governance.getProposal(proposalId);
      expect(proposal.forVotes).to.equal(0);
      expect(proposal.againstVotes).to.equal(0);
      expect(proposal.abstainVotes).to.equal(1);
    });

    it("Should not allow double voting", async function () {
      await governance.connect(voter1).castVote(proposalId, 1);
      
      await expect(
        governance.connect(voter1).castVote(proposalId, 0)
      ).to.be.revertedWith("Governance: Already voted");
    });

    it("Should not allow voting on expired proposals", async function () {
      // Fast forward time past voting period (7 days)
      await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]); // 8 days
      await ethers.provider.send("evm_mine");
      
      await expect(
        governance.connect(voter1).castVote(proposalId, 1)
      ).to.be.revertedWith("Governance: Voting ended");
    });

    it("Should reward voters with ICC tokens", async function () {
      const initialBalance = await iccToken.balanceOf(voter1.address);
      
      await governance.connect(voter1).castVote(proposalId, 1);
      
      const finalBalance = await iccToken.balanceOf(voter1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should track vote status correctly", async function () {
      await governance.connect(voter1).castVote(proposalId, 1);
      
      const [hasVoted, voteType] = await governance.getVote(proposalId, voter1.address);
      expect(hasVoted).to.be.true;
      expect(voteType).to.equal(1); // For
      
      const [hasNotVoted,] = await governance.getVote(proposalId, voter2.address);
      expect(hasNotVoted).to.be.false;
    });
  });

  describe("User Statistics", function () {
    it("Should track user proposal and vote counts", async function () {
      // Create proposal
      await governance.connect(proposer).createProposal(
        "Test Proposal",
        "Description",
        "infrastructure"
      );
      
      let [proposalCount, voteCount] = await governance.getUserStats(proposer.address);
      expect(proposalCount).to.equal(1);
      expect(voteCount).to.equal(0);
      
      // Vote on proposal
      await governance.connect(voter1).castVote(1, 1);
      
      [proposalCount, voteCount] = await governance.getUserStats(voter1.address);
      expect(proposalCount).to.equal(0);
      expect(voteCount).to.equal(1);
    });
  });

  describe("View Functions", function () {
    it("Should return correct version", async function () {
      expect(await governance.version()).to.equal("1.0.0");
    });
  });
});
