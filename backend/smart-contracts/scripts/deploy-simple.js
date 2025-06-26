const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying CivicAI Governance System...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Deploy ICCToken (I₵C Civic Coin) first
  console.log("\n💰 Deploying ICCToken (Infinita City Credits)...");
  const ICCToken = await ethers.getContractFactory("ICCToken");
  const iccToken = await ICCToken.deploy(
    deployer.address, // initial owner
    deployer.address  // reward distributor (can be changed later)
  );
  console.log("✅ ICCToken deployed to:", iccToken.target);

  // Deploy ProposalGovernance contract
  console.log("\n🏛️ Deploying ProposalGovernance...");
  const ProposalGovernance = await ethers.getContractFactory("ProposalGovernance");
  const proposalGovernance = await ProposalGovernance.deploy(
    iccToken.target,  // ICC token address
    deployer.address   // initial owner
  );
  console.log("✅ ProposalGovernance deployed to:", proposalGovernance.target);

  // Setup initial configurations
  console.log("\n⚙️ Setting up initial configurations...");
  
  // Set the governance contract address in the ICC token
  console.log("Setting governance contract in ICC token...");
  await iccToken.setGovernanceContract(proposalGovernance.target);
  console.log("✅ Governance contract authorized in ICC token");

  // Set the governance as reward distributor as well
  console.log("Setting governance contract as reward distributor...");
  await iccToken.setRewardDistributor(proposalGovernance.target);
  console.log("✅ Governance contract set as reward distributor");

  // Verify deployments
  console.log("\n🔍 Verifying deployments...");
  const iccTotalSupply = await iccToken.totalSupply();
  const proposalCount = await proposalGovernance.getProposalCount();
  
  console.log("ICC Token total supply:", ethers.formatEther(iccTotalSupply));
  console.log("Initial proposal count:", proposalCount.toString());

  // Save deployment addresses and ABI
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    timestamp: new Date().toISOString(),
    contracts: {
      ICCToken: {
        address: iccToken.target,
        deployer: deployer.address,
        totalSupply: ethers.formatEther(iccTotalSupply)
      },
      ProposalGovernance: {
        address: proposalGovernance.target,
        deployer: deployer.address,
        proposalCount: proposalCount.toString()
      }
    }
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
  const iccTokenArtifact = require(path.join(artifactsDir, "ICCToken.sol", "ICCToken.json"));
  fs.writeFileSync(
    path.join(frontendAbiDir, "ICCToken.json"),
    JSON.stringify({
      abi: iccTokenArtifact.abi,
      address: iccToken.target,
      contractName: "ICCToken"
    }, null, 2)
  );

  // Copy ProposalGovernance ABI
  const proposalGovernanceArtifact = require(path.join(artifactsDir, "ProposalGovernance.sol", "ProposalGovernance.json"));
  fs.writeFileSync(
    path.join(frontendAbiDir, "ProposalGovernance.json"),
    JSON.stringify({
      abi: proposalGovernanceArtifact.abi,
      address: proposalGovernance.target,
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
  console.log(`Chain ID: ${hre.network.config.chainId || 'Unknown'}`);
  console.log(`ICCToken: ${iccToken.target}`);
  console.log(`ProposalGovernance: ${proposalGovernance.target}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`ICC Total Supply: ${ethers.formatEther(iccTotalSupply)} ICC`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
