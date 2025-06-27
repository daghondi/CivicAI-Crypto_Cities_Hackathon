const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying Enhanced Governance contracts...");

  // Get the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy ICCToken first (if not already deployed)
  const ICCToken = await ethers.getContractFactory("ICCToken");
  let iccToken;
  
  try {
    // Try to load existing deployment
    const deploymentPath = path.join(__dirname, "../deployments/localhost.json");
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
      if (deployment.ICCToken) {
        iccToken = await ICCToken.attach(deployment.ICCToken.address);
        console.log("Using existing ICCToken at:", deployment.ICCToken.address);
      }
    }
  } catch (error) {
    console.log("No existing ICCToken found, deploying new one...");
  }

  if (!iccToken) {
    iccToken = await ICCToken.deploy(deployer.address, deployer.address);
    await iccToken.waitForDeployment();
    console.log("ICCToken deployed to:", await iccToken.getAddress());
  }

  // Deploy EnhancedProposalGovernance
  const EnhancedProposalGovernance = await ethers.getContractFactory("EnhancedProposalGovernance");
  const enhancedGovernance = await EnhancedProposalGovernance.deploy(await iccToken.getAddress());
  await enhancedGovernance.waitForDeployment();

  const enhancedGovernanceAddress = await enhancedGovernance.getAddress();
  console.log("EnhancedProposalGovernance deployed to:", enhancedGovernanceAddress);

  // Set governance contract for ICCToken
  await iccToken.setGovernanceContract(enhancedGovernanceAddress);
  console.log("Set governance contract for ICCToken");

  // Save deployment addresses
  const deployments = {
    ICCToken: {
      address: await iccToken.getAddress(),
      constructorArgs: [deployer.address, deployer.address]
    },
    EnhancedProposalGovernance: {
      address: enhancedGovernanceAddress,
      constructorArgs: [await iccToken.getAddress()]
    }
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Write enhanced deployment file
  const enhancedDeploymentPath = path.join(deploymentsDir, "localhost-enhanced.json");
  fs.writeFileSync(enhancedDeploymentPath, JSON.stringify(deployments, null, 2));
  console.log("Enhanced deployment saved to:", enhancedDeploymentPath);

  // Copy ABI files for frontend
  const contractsDir = path.resolve(__dirname, "../../../src/contracts");
  const abiDir = path.join(contractsDir, "abi");
  
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  // Copy Enhanced Governance ABI
  const enhancedGovernanceArtifact = await hre.artifacts.readArtifact("EnhancedProposalGovernance");
  fs.writeFileSync(
    path.join(abiDir, "EnhancedProposalGovernance.json"),
    JSON.stringify(enhancedGovernanceArtifact.abi, null, 2)
  );

  console.log("Enhanced Governance ABI copied to frontend");

  // Verify contracts are working
  console.log("\nVerifying deployments...");
  
  const tokenSymbol = await iccToken.symbol();
  const tokenName = await iccToken.name();
  console.log(`Token: ${tokenName} (${tokenSymbol})`);

  const votingDuration = await enhancedGovernance.VOTING_DURATION();
  const amendmentThreshold = await enhancedGovernance.AMENDMENT_THRESHOLD();
  console.log(`Voting Duration: ${votingDuration.toString()} seconds`);
  console.log(`Amendment Threshold: ${ethers.formatEther(amendmentThreshold)} ICC`);

  console.log("\n🎉 Enhanced Governance deployment completed successfully!");
  console.log("📝 Contracts deployed:");
  console.log(`   ICCToken: ${await iccToken.getAddress()}`);
  console.log(`   EnhancedProposalGovernance: ${enhancedGovernanceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
