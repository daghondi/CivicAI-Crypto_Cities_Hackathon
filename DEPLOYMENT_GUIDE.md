# 🚀 Smart Contract Deployment Guide

## Step 1: Environment Setup

First, let's set up the required environment variables for deployment to Optimism Sepolia testnet.

### Required Environment Variables

Create or update your `.env` file in the smart-contracts directory:

```env
# Private key for deployment (WITHOUT 0x prefix)
PRIVATE_KEY=your_private_key_here

# Optimism Sepolia RPC URL
OPTIMISM_SEPOLIA_URL=https://sepolia.optimism.io

# Etherscan API key for contract verification
OPTIMISM_ETHERSCAN_API_KEY=your_optimism_etherscan_api_key

# Optional: For other networks
SEPOLIA_URL=https://eth-sepolia.public.blastapi.io
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Wallet Setup

1. **Get Test ETH**: 
   - Visit [Optimism Sepolia Faucet](https://console.optimism.io/faucet?utm_source=docs)
   - Connect your wallet and request test ETH
   - Wait for confirmation

2. **Add Optimism Sepolia Network to MetaMask**:
   - Network Name: Optimism Sepolia
   - RPC URL: https://sepolia.optimism.io
   - Chain ID: 11155420
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia-optimism.etherscan.io

## Step 2: Deploy Smart Contracts

### 2.1 Navigate to Smart Contracts Directory
```bash
cd backend/smart-contracts
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Compile Contracts
```bash
npx hardhat compile
```

### 2.4 Run Tests (Optional but Recommended)
```bash
npx hardhat test
```

### 2.5 Deploy to Optimism Sepolia
```bash
npx hardhat run scripts/deploy.js --network optimismSepolia
```

## Step 3: Verify Contracts on Block Explorer

After successful deployment, verify your contracts:

```bash
# Verify ICCToken
npx hardhat verify --network optimismSepolia <ICC_TOKEN_ADDRESS> <DEPLOYER_ADDRESS> <REWARD_DISTRIBUTOR_ADDRESS>

# Verify ProposalGovernance
npx hardhat verify --network optimismSepolia <GOVERNANCE_ADDRESS> <ICC_TOKEN_ADDRESS> <DEPLOYER_ADDRESS>
```

## Step 4: Update Frontend Environment

Update your main project `.env.local` file with the deployed contract addresses:

```env
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=11155420
NEXT_PUBLIC_RPC_URL=https://sepolia.optimism.io
NEXT_PUBLIC_NETWORK_NAME=Optimism Sepolia

# Smart Contract Addresses (Update with your deployed addresses)
NEXT_PUBLIC_ICC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_PROPOSAL_GOVERNANCE_ADDRESS=0x...

# Block Explorer
NEXT_PUBLIC_BLOCK_EXPLORER_URL=https://sepolia-optimism.etherscan.io
```

## Step 5: Test Integration

1. **Start the development server**:
```bash
npm run dev
```

2. **Connect MetaMask** to your application
3. **Switch to Optimism Sepolia** network
4. **Test contract interactions**:
   - Check ICC token balance
   - Create a test proposal
   - Vote on proposals
   - Check achievements and rewards

## Expected Deployment Output

After running the deployment script, you should see output similar to:

```
🚀 Deploying CivicAI Governance System...
Deploying contracts with account: 0x...
Account balance: 0.1 ETH

💰 Deploying ICCToken (Infinita City Credits)...
✅ ICCToken deployed to: 0x1234567890123456789012345678901234567890

🏛️ Deploying ProposalGovernance...
✅ ProposalGovernance deployed to: 0x0987654321098765432109876543210987654321

⚙️ Setting up initial configurations...
✅ Governance contract authorized in ICC token
✅ Reward distributor configured
✅ Initial governance parameters set

📝 Deployment Summary:
- ICC Token: 0x1234567890123456789012345678901234567890
- Proposal Governance: 0x0987654321098765432109876543210987654321
- Network: Optimism Sepolia (11155420)
- Deployer: 0x...
- Gas Used: ~2,500,000
```

## Troubleshooting

### Common Issues:

1. **Insufficient Balance**: Ensure you have enough test ETH
2. **Network Issues**: Verify RPC URL and network configuration
3. **Private Key Format**: Remove '0x' prefix from private key
4. **Gas Estimation**: Increase gas limit if transactions fail

### Verification Issues:

1. **Wait for Block Confirmations**: Wait 2-3 minutes before verifying
2. **Constructor Arguments**: Ensure correct order and format
3. **Compiler Version**: Match hardhat and etherscan compiler versions

## Next Steps

After successful deployment:

1. ✅ Update frontend environment variables
2. ✅ Test wallet connection and contract interactions
3. ✅ Create test proposals and votes
4. ✅ Verify I₵C token minting and rewards
5. ✅ Test achievement system
6. ✅ Prepare for hackathon demo

## Security Notes

- ⚠️ **Never commit private keys to version control**
- ⚠️ **Use testnet tokens only for testing**
- ⚠️ **Verify contract addresses before mainnet deployment**
- ⚠️ **Conduct security audit before production use**

## Resources

- [Optimism Sepolia Faucet](https://console.optimism.io/faucet)
- [Optimism Sepolia Explorer](https://sepolia-optimism.etherscan.io)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
