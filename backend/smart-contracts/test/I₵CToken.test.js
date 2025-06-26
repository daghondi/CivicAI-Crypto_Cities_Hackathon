const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICCToken", function () {
  let ICCToken;
  let iccToken;
  let owner;
  let rewardDistributor;
  let governance;
  let user1;
  let user2;
  let addrs;

  beforeEach(async function () {
    [owner, rewardDistributor, governance, user1, user2, ...addrs] = await ethers.getSigners();
    
    ICCToken = await ethers.getContractFactory("ICCToken");
    iccToken = await ICCToken.deploy(owner.address, rewardDistributor.address);
    await iccToken.waitForDeployment();
    
    // Set up governance contract
    await iccToken.setGovernanceContract(governance.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await iccToken.owner()).to.equal(owner.address);
    });

    it("Should set the reward distributor", async function () {
      expect(await iccToken.rewardDistributor()).to.equal(rewardDistributor.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await iccToken.name()).to.equal("Infinita City Credits");
      expect(await iccToken.symbol()).to.equal("ICC");
    });

    it("Should mint initial supply to owner", async function () {
      const expectedSupply = ethers.utils.parseEther("1000000"); // 1M tokens
      expect(await iccToken.balanceOf(owner.address)).to.equal(expectedSupply);
    });

    it("Should set correct reward rates", async function () {
      expect(await iccToken.getRewardRate("proposal_creation")).to.equal(ethers.utils.parseEther("50"));
      expect(await iccToken.getRewardRate("vote_cast")).to.equal(ethers.utils.parseEther("10"));
      expect(await iccToken.getRewardRate("proposal_passed")).to.equal(ethers.utils.parseEther("100"));
    });
  });

  describe("Civic Rewards", function () {
    it("Should allow governance to mint civic rewards", async function () {
      const rewardAmount = ethers.utils.parseEther("50");
      
      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "proposal_creation",
        rewardAmount
      );
      
      expect(await iccToken.balanceOf(user1.address)).to.equal(rewardAmount);
      expect(await iccToken.getUserRewards(user1.address)).to.equal(rewardAmount);
    });

    it("Should use default rate when amount is 0", async function () {
      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "vote_cast",
        0
      );
      
      const expectedReward = ethers.utils.parseEther("10"); // Default rate for vote_cast
      expect(await iccToken.balanceOf(user1.address)).to.equal(expectedReward);
    });

    it("Should enforce cooldown period", async function () {
      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "vote_cast",
        0
      );
      
      // Try to mint again immediately - should fail
      await expect(
        iccToken.connect(governance).mintCivicReward(
          user1.address,
          "vote_cast",
          0
        )
      ).to.be.revertedWith("ICCToken: Reward cooldown active");
    });

    it("Should not exceed max supply", async function () {
      const maxSupply = ethers.utils.parseEther("10000000"); // 10M tokens
      const currentSupply = await iccToken.totalSupply();
      const exceededAmount = maxSupply.sub(currentSupply).add(1);
      
      await expect(
        iccToken.connect(governance).mintCivicReward(
          user1.address,
          "proposal_creation",
          exceededAmount
        )
      ).to.be.revertedWith("ICCToken: Exceeds max supply");
    });

    it("Should only allow authorized minters", async function () {
      await expect(
        iccToken.connect(user1).mintCivicReward(
          user2.address,
          "vote_cast",
          ethers.utils.parseEther("10")
        )
      ).to.be.revertedWith("ICCToken: Unauthorized minter");
    });
  });

  describe("Batch Rewards", function () {
    it("Should mint batch rewards correctly", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [ethers.utils.parseEther("50"), 0]; // Second uses default rate
      
      await iccToken.connect(governance).batchMintCivicRewards(
        recipients,
        "vote_cast",
        amounts
      );
      
      expect(await iccToken.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("50"));
      expect(await iccToken.balanceOf(user2.address)).to.equal(ethers.utils.parseEther("10")); // Default rate
    });

    it("Should require matching array lengths", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [ethers.utils.parseEther("50")]; // Mismatched length
      
      await expect(
        iccToken.connect(governance).batchMintCivicRewards(
          recipients,
          "vote_cast",
          amounts
        )
      ).to.be.revertedWith("ICCToken: Array length mismatch");
    });

    it("Should not allow batch size over 100", async function () {
      const recipients = new Array(101).fill(user1.address);
      const amounts = new Array(101).fill(ethers.utils.parseEther("1"));
      
      await expect(
        iccToken.connect(governance).batchMintCivicRewards(
          recipients,
          "vote_cast",
          amounts
        )
      ).to.be.revertedWith("ICCToken: Batch too large");
    });
  });

  describe("Administration", function () {
    it("Should allow owner to update reward rates", async function () {
      const newRate = ethers.utils.parseEther("75");
      
      await iccToken.setRewardRate("proposal_creation", newRate);
      expect(await iccToken.getRewardRate("proposal_creation")).to.equal(newRate);
    });

    it("Should not allow reward rate over maximum", async function () {
      const tooHighRate = ethers.utils.parseEther("1001"); // Over 1000 ICC limit
      
      await expect(
        iccToken.setRewardRate("proposal_creation", tooHighRate)
      ).to.be.revertedWith("ICCToken: Rate too high");
    });

    it("Should allow owner to pause/unpause", async function () {
      await iccToken.pause();
      
      await expect(
        iccToken.connect(governance).mintCivicReward(
          user1.address,
          "vote_cast",
          0
        )
      ).to.be.revertedWith("Pausable: paused");
      
      await iccToken.unpause();
      
      // Should work after unpause
      await expect(
        iccToken.connect(governance).mintCivicReward(
          user1.address,
          "vote_cast",
          0
        )
      ).to.not.be.reverted;
    });

    it("Should only allow owner to set governance contract", async function () {
      await expect(
        iccToken.connect(user1).setGovernanceContract(user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow emergency token recovery", async function () {
      // Deploy a mock token
      const MockToken = await ethers.getContractFactory("ICCToken");
      const mockToken = await MockToken.deploy(owner.address, rewardDistributor.address);
      await mockToken.deployed();
      
      // Send some mock tokens to ICC contract
      await mockToken.transfer(iccToken.address, ethers.utils.parseEther("100"));
      
      const initialBalance = await mockToken.balanceOf(owner.address);
      
      // Recover tokens
      await iccToken.emergencyTokenRecovery(mockToken.address, ethers.utils.parseEther("100"));
      
      expect(await mockToken.balanceOf(owner.address)).to.equal(
        initialBalance.add(ethers.utils.parseEther("100"))
      );
    });

    it("Should not allow recovery of own tokens", async function () {
      await expect(
        iccToken.emergencyTokenRecovery(iccToken.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("ICCToken: Cannot recover own tokens");
    });
  });

  describe("View Functions", function () {
    it("Should return correct version", async function () {
      expect(await iccToken.version()).to.equal("1.0.0");
    });

    it("Should track user rewards correctly", async function () {
      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "vote_cast",
        ethers.utils.parseEther("25")
      );
      
      // Fast forward time to pass cooldown
      await ethers.provider.send("evm_increaseTime", [3700]); // 1 hour + 100 seconds
      await ethers.provider.send("evm_mine");
      
      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "proposal_creation",
        ethers.utils.parseEther("50")
      );
      
      expect(await iccToken.getUserRewards(user1.address)).to.equal(
        ethers.utils.parseEther("75")
      );
    });
  });
});
