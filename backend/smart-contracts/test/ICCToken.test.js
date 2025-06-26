const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICCToken", function () {
  let ICCToken;
  let iccToken;
  let owner;
  let governance;
  let rewardDistributor;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, governance, rewardDistributor, user1, user2] = await ethers.getSigners();

    // Deploy ICC Token
    ICCToken = await ethers.getContractFactory("ICCToken");
    iccToken = await ICCToken.deploy(owner.address, rewardDistributor.address);
    
    // Set governance contract
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
      const initialSupply = ethers.parseEther("1000000"); // 1M ICC
      expect(await iccToken.balanceOf(owner.address)).to.equal(initialSupply);
      expect(await iccToken.totalSupply()).to.equal(initialSupply);
    });

    it("Should set correct reward rates", async function () {
      expect(await iccToken.getRewardRate("proposal_creation")).to.equal(ethers.parseEther("50"));
      expect(await iccToken.getRewardRate("vote_cast")).to.equal(ethers.parseEther("10"));
      expect(await iccToken.getRewardRate("proposal_passed")).to.equal(ethers.parseEther("100"));
    });
  });

  describe("Civic Rewards", function () {
    it("Should allow governance to mint civic rewards", async function () {
      const rewardAmount = ethers.parseEther("50");
      
      await expect(
        iccToken.connect(governance).mintCivicReward(
          user1.address,
          "proposal_creation",
          rewardAmount
        )
      ).to.emit(iccToken, "CivicRewardMinted")
        .withArgs(user1.address, "proposal_creation", rewardAmount);

      expect(await iccToken.balanceOf(user1.address)).to.equal(rewardAmount);
      expect(await iccToken.getUserRewards(user1.address)).to.equal(rewardAmount);
    });

    it("Should use default rate when amount is 0", async function () {
      const defaultRate = await iccToken.getRewardRate("vote_cast");
      
      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "vote_cast",
        0
      );

      expect(await iccToken.balanceOf(user1.address)).to.equal(defaultRate);
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
      const maxSupply = ethers.parseEther("10000000"); // 10M tokens
      const currentSupply = await iccToken.totalSupply();
      const exceededAmount = maxSupply - currentSupply + 1n;
      
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
          ethers.parseEther("10")
        )
      ).to.be.revertedWith("ICCToken: Unauthorized minter");
    });
  });

  describe("Batch Rewards", function () {
    it("Should mint batch rewards correctly", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [ethers.parseEther("10"), ethers.parseEther("20")];

      await iccToken.connect(governance).batchMintCivicRewards(
        recipients,
        "vote_cast",
        amounts
      );

      expect(await iccToken.balanceOf(user1.address)).to.equal(amounts[0]);
      expect(await iccToken.balanceOf(user2.address)).to.equal(amounts[1]);
    });

    it("Should require matching array lengths", async function () {
      const recipients = [user1.address, user2.address];
      const amounts = [ethers.parseEther("10")]; // Mismatched length

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
      const amounts = new Array(101).fill(ethers.parseEther("10"));

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
      const newRate = ethers.parseEther("75");
      
      await expect(
        iccToken.setRewardRate("proposal_creation", newRate)
      ).to.emit(iccToken, "RewardRateUpdated")
        .withArgs("proposal_creation", newRate);

      expect(await iccToken.getRewardRate("proposal_creation")).to.equal(newRate);
    });

    it("Should not allow reward rate over maximum", async function () {
      const tooHighRate = ethers.parseEther("1001"); // Over 1000 ICC limit
      
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
      
      // Send some mock tokens to ICC contract
      await mockToken.transfer(iccToken.target, ethers.parseEther("100"));
      
      const initialBalance = await mockToken.balanceOf(owner.address);
      
      // Recover tokens
      await iccToken.emergencyTokenRecovery(mockToken.target, ethers.parseEther("100"));
      
      expect(await mockToken.balanceOf(owner.address)).to.equal(
        initialBalance + ethers.parseEther("100")
      );
    });

    it("Should not allow recovery of own tokens", async function () {
      await expect(
        iccToken.emergencyTokenRecovery(iccToken.target, ethers.parseEther("100"))
      ).to.be.revertedWith("ICCToken: Cannot recover own tokens");
    });
  });

  describe("View Functions", function () {
    it("Should return correct version", async function () {
      expect(await iccToken.version()).to.equal("1.0.0");
    });

    it("Should track user rewards correctly", async function () {
      const reward1 = ethers.parseEther("50");
      const reward2 = ethers.parseEther("25");

      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "proposal_creation",
        reward1
      );

      // Wait for cooldown
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour + 1 second
      await ethers.provider.send("evm_mine");

      await iccToken.connect(governance).mintCivicReward(
        user1.address,
        "community_engagement",
        reward2
      );

      expect(await iccToken.getUserRewards(user1.address)).to.equal(reward1 + reward2);
      expect(await iccToken.balanceOf(user1.address)).to.equal(reward1 + reward2);
    });
  });
});
