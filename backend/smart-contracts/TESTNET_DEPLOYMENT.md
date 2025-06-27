# Optimism Sepolia Testnet Deployment Guide

## Prerequisites

### 1. Get Optimism Sepolia Test ETH

You'll need test ETH to deploy contracts. Here are the steps:

1. **Get ETH on Ethereum Sepolia first:**
   - Visit: https://sepoliafaucet.com/ or https://faucets.chain.link/sepolia
   - Enter your wallet address
   - Request test ETH

2. **Bridge to Optimism Sepolia:**
   - Visit: https://app.optimism.io/bridge
   - Connect your wallet
   - Switch to Sepolia network
   - Bridge ETH from Ethereum Sepolia to Optimism Sepolia
   - Wait for the bridge (usually 1-5 minutes)

3. **Alternative Optimism Sepolia Faucets:**
   - https://optimismfaucet.xyz/
   - https://faucet.quicknode.com/optimism/sepolia

### 2. Setup Environment Variables

1. **Add your private key to .env file:**
   ```bash
   # Replace with your actual private key (without 0x prefix)
   PRIVATE_KEY=your_wallet_private_key_here
   ```

   ⚠️ **Security Warning**: Never commit your private key to version control!

2. **Optional - Add Etherscan API key for verification:**
   ```bash
   OPTIMISM_ETHERSCAN_API_KEY=your_api_key_here
   ```

## Deployment Commands

### Quick Deploy
```bash
# Navigate to smart contracts directory
cd backend/smart-contracts

# Install dependencies (if not already done)
npm install

# Deploy to Optimism Sepolia
npx hardhat run scripts/deploy-optimism.js --network optimismSepolia
```

### Verify Contracts (Optional)
```bash
# Verify ICCToken
npx hardhat verify --network optimismSepolia TOKEN_ADDRESS

# Verify ProposalGovernance
npx hardhat verify --network optimismSepolia GOVERNANCE_ADDRESS TOKEN_ADDRESS
```

## After Deployment

1. **Update Frontend Configuration:**
   - Copy the contract addresses from deployment output
   - Update `src/lib/contracts.ts` with new addresses
   - Set the network to Optimism Sepolia in your app

2. **Test the Application:**
   - Switch MetaMask to Optimism Sepolia network
   - Visit your application
   - Test proposal creation and voting

## Network Details

- **Network Name**: Optimism Sepolia
- **RPC URL**: https://sepolia.optimism.io
- **Chain ID**: 11155420
- **Block Explorer**: https://sepolia-optimism.etherscan.io/
- **Symbol**: ETH

## Troubleshooting

### Common Issues:

1. **"Insufficient funds" error:**
   - Make sure you have enough OP Sepolia ETH in your wallet
   - Check your wallet is connected to the correct network

2. **"Network not found" error:**
   - Ensure Optimism Sepolia is added to your MetaMask
   - Verify the RPC URL in hardhat.config.js

3. **"Private key not found" error:**
   - Check your .env file has PRIVATE_KEY set
   - Ensure no spaces or quotes around the key

4. **Deployment hanging:**
   - The network might be congested
   - Try increasing gas price or wait and retry

## Gas Estimates

- **ICCToken deployment**: ~2-3M gas (~$1-2 USD equivalent)
- **ProposalGovernance deployment**: ~3-4M gas (~$2-3 USD equivalent)
- **Total estimated cost**: ~$3-5 USD equivalent in test ETH
