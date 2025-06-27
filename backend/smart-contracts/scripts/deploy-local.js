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

  // Set the governance as reward distributor
  console.log("Setting governance contract as reward distributor...");
  await iccToken.setRewardDistributor(proposalGovernance.target);
  console.log("✅ Governance contract set as reward distributor");

  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  const iccTotalSupply = await iccToken.totalSupply();
  const proposalCount = await proposalGovernance.getProposalCount();
  console.log(`Initial ICC total supply: ${ethers.formatEther(iccTotalSupply)} I₵C`);
  console.log(`Initial proposal count: ${proposalCount}`);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    contracts: {
      ICCToken: {
        address: iccToken.target,
        deployer: deployer.address,
        totalSupply: ethers.formatEther(iccTotalSupply)
      },
      ProposalGovernance: {
        address: proposalGovernance.target,
        deployer: deployer.address
      }
    },
    timestamp: new Date().toISOString()
  };

  const deploymentFile = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  console.log("\n🎉 Deployment completed successfully!");

  // Display summary
  console.log("\n📊 Deployment Summary:");
  console.log("========================");
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`I₵CToken: ${iccToken.target}`);
  console.log(`ProposalGovernance: ${proposalGovernance.target}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`ICC Total Supply: ${ethers.formatEther(iccTotalSupply)} ICC`);

  console.log("\n🔗 Next Steps:");
  console.log("1. Update your .env.local file with these contract addresses");
  console.log("2. Test the contracts in your frontend application");
  console.log("3. Deploy to testnet when ready");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
