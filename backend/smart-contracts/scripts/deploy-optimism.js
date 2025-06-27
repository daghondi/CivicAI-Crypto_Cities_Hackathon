const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting deployment to Optimism Sepolia...");
  
  // Get the network info
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log(`👤 Deploying with account: ${deployerAddress}`);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployerAddress);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);
  
  if (balance === 0n) {
    throw new Error("❌ Deployer account has no ETH. Please fund your account with Optimism Sepolia testnet ETH.");
  }

  console.log("\n📦 Deploying contracts...");

  // Deploy ICCToken
  console.log("🪙 Deploying ICCToken...");
  const ICCToken = await ethers.getContractFactory("ICCToken");
  const iccToken = await ICCToken.deploy();
  await iccToken.waitForDeployment();
  const iccTokenAddress = await iccToken.getAddress();
  console.log(`✅ ICCToken deployed to: ${iccTokenAddress}`);

  // Deploy ProposalGovernance
  console.log("🏛️ Deploying ProposalGovernance...");
  const ProposalGovernance = await ethers.getContractFactory("ProposalGovernance");
  const governance = await ProposalGovernance.deploy(iccTokenAddress);
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log(`✅ ProposalGovernance deployed to: ${governanceAddress}`);

  // Set governance contract as minter for ICCToken
  console.log("🔧 Setting governance as minter...");
  const setMinterTx = await iccToken.setGovernanceContract(governanceAddress);
  await setMinterTx.wait();
  console.log("✅ Governance contract set as minter");

  // Verify initial state
  console.log("\n🔍 Verifying deployment...");
  const iccName = await iccToken.name();
  const iccSymbol = await iccToken.symbol();
  const iccDecimals = await iccToken.decimals();
  const totalSupply = await iccToken.totalSupply();
  
  console.log(`📊 Token Info:
    Name: ${iccName}
    Symbol: ${iccSymbol}
    Decimals: ${iccDecimals}
    Total Supply: ${ethers.formatEther(totalSupply)} ICC`);

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    deployer: deployerAddress,
    timestamp: new Date().toISOString(),
    contracts: {
      ICCToken: {
        address: iccTokenAddress,
        name: iccName,
        symbol: iccSymbol
      },
      ProposalGovernance: {
        address: governanceAddress
      }
    },
    gasUsed: {
      ICCToken: "Estimated ~2M gas",
      ProposalGovernance: "Estimated ~3M gas"
    }
  };

  // Save to deployments directory
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, 'optimism-sepolia.json');
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Deployment info saved to: ${deploymentFile}`);

  // Copy ABIs to frontend
  console.log("\n📋 Copying ABIs to frontend...");
  
  const artifactsDir = path.join(__dirname, '../artifacts/contracts');
  const frontendAbiDir = path.join(__dirname, '../../src/contracts/abi');
  
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  // Copy ICCToken ABI
  const iccTokenArtifact = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, 'ICCToken.sol/ICCToken.json'), 'utf8')
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, 'ICCToken.json'),
    JSON.stringify(iccTokenArtifact.abi, null, 2)
  );

  // Copy ProposalGovernance ABI
  const governanceArtifact = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, 'ProposalGovernance.sol/ProposalGovernance.json'), 'utf8')
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, 'ProposalGovernance.json'),
    JSON.stringify(governanceArtifact.abi, null, 2)
  );

  console.log("✅ ABIs copied to frontend");

  console.log(`
🎉 Deployment Successful!

📊 Contract Addresses:
🪙 ICCToken: ${iccTokenAddress}
🏛️ ProposalGovernance: ${governanceAddress}

🔗 Network: Optimism Sepolia (${network.chainId})

📱 Next Steps:
1. Update frontend contract addresses in src/lib/contracts.ts
2. Verify contracts on Optimism Etherscan (optional)
3. Test the application with testnet contracts

💡 Etherscan URLs:
🪙 ICCToken: https://sepolia-optimism.etherscan.io/address/${iccTokenAddress}
🏛️ ProposalGovernance: https://sepolia-optimism.etherscan.io/address/${governanceAddress}
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
