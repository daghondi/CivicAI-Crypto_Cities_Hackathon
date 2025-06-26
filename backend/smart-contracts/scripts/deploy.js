const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying CivicAI Governance System...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()));

  // Deploy ICCToken (I₵C Civic Coin) first
  console.log("\n💰 Deploying ICCToken (Infinita City Credits)...");
  const ICCToken = await ethers.getContractFactory("ICCToken");
  const iccToken = await ICCToken.deploy(
    deployer.address, // initial owner
    deployer.address  // reward distributor (can be changed later)
  );
  await iccToken.deployed();
  console.log("✅ ICCToken deployed to:", iccToken.address);

  // Deploy ProposalGovernance contract
  console.log("\n🏛️ Deploying ProposalGovernance...");
  const ProposalGovernance = await ethers.getContractFactory("ProposalGovernance");
  const proposalGovernance = await ProposalGovernance.deploy(
    iccToken.address,  // ICC token address
    deployer.address   // initial owner
  );
  await proposalGovernance.deployed();
  console.log("✅ ProposalGovernance deployed to:", proposalGovernance.address);

  // Setup initial configurations
  console.log("\n⚙️ Setting up initial configurations...");
  
  // Set the governance contract address in the ICC token
  console.log("Setting governance contract in ICC token...");
  await iccToken.setGovernanceContract(proposalGovernance.address);
  console.log("✅ Governance contract authorized in ICC token");

  // Optional: Set the governance as reward distributor as well
  console.log("Setting governance contract as reward distributor...");
  await iccToken.setRewardDistributor(proposalGovernance.address);
  console.log("✅ Governance contract set as reward distributor");
  await iccToken.authorizeMinter(proposalGovernance.address, true);
  console.log("✅ ProposalGovernance authorized as ICC minter");
  
  // Set ProposalGovernance as civic validator
  await iccToken.setCivicValidator(proposalGovernance.address, true);
  console.log("✅ ProposalGovernance set as civic validator");

  // Grant initial voting power in ProposalGovernance based on ICC token holdings
  const deployerBalance = await iccToken.balanceOf(deployer.address);
  const votingPower = ethers.utils.formatUnits(deployerBalance, 18);
  await proposalGovernance.setVotingPower(deployer.address, Math.floor(parseFloat(votingPower) / 1000)); // 1 vote per 1000 ICC
  console.log("✅ Initial voting power set for deployer");

  // Verify deployments
  console.log("\n🔍 Verifying deployments...");
  const iccTotalSupply = await iccToken.totalSupply();
  const proposalCount = await proposalGovernance.getProposalCount();
  
  console.log("ICC Token total supply:", ethers.utils.formatEther(iccTotalSupply));
  console.log("Initial proposal count:", proposalCount.toString());

  // Save deployment addresses and ABI
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contracts: {
      ICCToken: {
        address: iccToken.address,
        deployer: deployer.address,
        deploymentBlock: iccToken.deployTransaction.blockNumber,
        deploymentHash: iccToken.deployTransaction.hash,
        totalSupply: ethers.utils.formatEther(iccTotalSupply)
      },
      ProposalGovernance: {
        address: proposalGovernance.address,
        deployer: deployer.address,
        deploymentBlock: proposalGovernance.deployTransaction.blockNumber,
        deploymentHash: proposalGovernance.deployTransaction.hash
      }
    },
    configuration: {
      iccTokenAuthorizedMinters: [deployer.address, proposalGovernance.address],
      civicValidators: [deployer.address, proposalGovernance.address],
      votingPowerRatio: "1 vote per 1000 ICC tokens"
    },
    timestamp: new Date().toISOString()
  };

  // Create deployments directory
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  // Copy ABI files for frontend integration
  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");
  const frontendAbiDir = path.join(__dirname, "..", "..", "..", "src", "contracts", "abi");
  
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  // Copy ICC Token ABI
  const iccTokenArtifact = require(path.join(artifactsDir, "I₵CToken.sol", "I₵CToken.json"));
  fs.writeFileSync(
    path.join(frontendAbiDir, "ICCToken.json"),
    JSON.stringify({
      abi: iccTokenArtifact.abi,
      address: iccToken.address,
      contractName: "I₵CToken"
    }, null, 2)
  );

  // Copy ProposalGovernance ABI
  const proposalGovernanceArtifact = require(path.join(artifactsDir, "ProposalGovernance.sol", "ProposalGovernance.json"));
  fs.writeFileSync(
    path.join(frontendAbiDir, "ProposalGovernance.json"),
    JSON.stringify({
      abi: proposalGovernanceArtifact.abi,
      address: proposalGovernance.address,
      contractName: "ProposalGovernance"
    }, null, 2)
  );

  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  console.log(`📁 Contract ABIs copied to: ${frontendAbiDir}`);
  console.log("\n🎉 Deployment completed successfully!");

  // Display summary
  console.log("\n📊 Deployment Summary:");
  console.log("========================");
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);
  console.log(`I₵CToken: ${iccToken.address}`);
  console.log(`ProposalGovernance: ${proposalGovernance.address}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`ICC Total Supply: ${ethers.utils.formatEther(iccTotalSupply)} ICC`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });