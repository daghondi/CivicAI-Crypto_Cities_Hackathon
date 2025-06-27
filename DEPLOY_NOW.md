# 🚀 LIVE TESTNET DEPLOYMENT INSTRUCTIONS

## ⚠️ BEFORE DEPLOYMENT - COMPLETE THESE STEPS:

### 1. Get Your Private Key
1. Open MetaMask
2. Click on your account → Account Details → Export Private Key
3. Enter your MetaMask password
4. Copy the private key (starts with 0x...)

### 2. Fund Your Account with Testnet ETH
You need Optimism Sepolia ETH to deploy contracts:

**Option A: Bridge from Ethereum Sepolia**
1. Get Sepolia ETH from: https://sepoliafaucet.com/
2. Bridge to OP Sepolia: https://app.optimism.io/bridge
3. Wait 1-5 minutes for bridge completion

**Option B: Direct OP Sepolia Faucets**
- https://optimismfaucet.xyz/
- https://faucet.quicknode.com/optimism/sepolia

### 3. Update Environment File
Edit: `backend/smart-contracts/.env`
```bash
# Add your private key (WITHOUT the 0x prefix)
PRIVATE_KEY=your_private_key_here_without_0x

# Keep these as-is
OPTIMISM_SEPOLIA_URL=https://sepolia.optimism.io
REPORT_GAS=false
```

### 4. Run Deployment Commands
```bash
# Navigate to smart contracts
cd backend/smart-contracts

# Install dependencies (if not done)
npm install

# Deploy to Optimism Sepolia
npx hardhat run scripts/deploy-optimism.js --network optimismSepolia
```

## 🎯 EXPECTED OUTPUT:
```
🚀 Starting deployment to Optimism Sepolia...
📡 Network: optimism-sepolia (Chain ID: 11155420)
👤 Deploying with account: 0xYourAddress
💰 Account balance: 0.1 ETH

📦 Deploying contracts...
🪙 Deploying ICCToken...
✅ ICCToken deployed to: 0x1234...
🏛️ Deploying ProposalGovernance...
✅ ProposalGovernance deployed to: 0x5678...
🔧 Setting governance as minter...
✅ Governance contract set as minter

🎉 Deployment Successful!

📊 Contract Addresses:
🪙 ICCToken: 0x1234...
🏛️ ProposalGovernance: 0x5678...

📱 Next Steps:
1. Update frontend contract addresses
2. Test the application
3. Verify contracts (optional)
```

## 🔄 AFTER DEPLOYMENT:
1. Copy the contract addresses from the output
2. Update `src/lib/contracts.ts` with real addresses
3. Test the application on Optimism Sepolia network

## ⚠️ SECURITY NOTES:
- NEVER commit your private key to git
- Use a test wallet, not your main wallet
- Only deploy to testnets first
- Keep your private key secure
