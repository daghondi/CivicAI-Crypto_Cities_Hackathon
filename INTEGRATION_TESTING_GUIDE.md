# 🧪 Smart Contract Integration Testing Guide

## ✅ Current Status

**Smart Contracts Deployed Successfully!**

- **Network**: Hardhat Local (Chain ID: 31337)
- **I₵C Token**: `0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e`
- **Governance**: `0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0`
- **Development Server**: http://localhost:3000
- **Hardhat Network**: http://127.0.0.1:8545

## 🔧 Testing Setup

### Prerequisites
1. **✅ Smart contracts deployed** to local Hardhat network
2. **✅ Frontend configured** with contract addresses
3. **✅ Development server running** on port 3000
4. **✅ Hardhat node running** on port 8545

### MetaMask Setup for Local Testing

1. **Add Hardhat Network to MetaMask**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account**:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 ETH and is the contract deployer

3. **Add I₵C Token to MetaMask**:
   - Token Address: `0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e`
   - Symbol: `I₵C`
   - Decimals: `18`

## 🎯 Test Scenarios

### 1. Wallet Connection Test
- **Goal**: Verify MetaMask connects to the application
- **Steps**:
  1. Open http://localhost:3000
  2. Click "Connect Wallet"
  3. Select MetaMask and connect
  4. Verify network switch to Hardhat Local

### 2. Smart Contract Status Test
- **Goal**: Check contract deployment status
- **Steps**:
  1. Navigate to `/admin/deployment`
  2. Verify contract addresses are displayed
  3. Check contract status indicators
  4. Test contract interaction buttons

### 3. I₵C Token Integration Test
- **Goal**: Test token balance and transactions
- **Expected Results**:
  - Deployer account should have 1,000,000 I₵C tokens
  - Balance should display in wallet components
  - Token transfers should work

### 4. Proposal Creation Test
- **Goal**: Test on-chain proposal creation
- **Steps**:
  1. Navigate to `/proposals/create`
  2. Fill out proposal form
  3. Select "Submit to Blockchain" option
  4. Confirm transaction in MetaMask
  5. Verify proposal appears in governance contract

### 5. Voting System Test
- **Goal**: Test on-chain voting functionality
- **Steps**:
  1. Create a test proposal (if none exist)
  2. Navigate to proposal detail page
  3. Cast a vote (For/Against/Abstain)
  4. Confirm transaction in MetaMask
  5. Verify vote is recorded on-chain

### 6. Reward System Test
- **Goal**: Test I₵C token minting for civic actions
- **Expected Behaviors**:
  - Creating proposal rewards 50 I₵C
  - Voting rewards 10 I₵C
  - Successful proposal execution rewards 200 I₵C

### 7. Real-time Events Test
- **Goal**: Test blockchain event listeners
- **Steps**:
  1. Open browser developer tools
  2. Monitor console for event logs
  3. Perform actions (vote, create proposal)
  4. Verify events are captured and displayed

## 🐛 Troubleshooting

### Common Issues and Solutions

**Issue**: MetaMask doesn't show I₵C tokens
- **Solution**: Manually add token using contract address

**Issue**: Transactions fail with "insufficient funds"
- **Solution**: Ensure you're using the test account with ETH

**Issue**: Contract interactions fail
- **Solution**: Check that Hardhat node is running on port 8545

**Issue**: Wrong network errors
- **Solution**: Switch MetaMask to Hardhat Local (Chain ID 31337)

**Issue**: State not updating in UI
- **Solution**: Refresh page or check browser console for errors

## 📊 Expected Test Results

### Successful Integration Indicators

1. **✅ Wallet Connection**: MetaMask connects and shows Hardhat network
2. **✅ Token Balance**: I₵C balance displays correctly (1,000,000 for deployer)
3. **✅ Contract Status**: Admin page shows "Connected" status
4. **✅ Proposal Creation**: Can create proposals on-chain
5. **✅ Voting**: Can cast votes and see results
6. **✅ Rewards**: Receive I₵C tokens for civic actions
7. **✅ Events**: Real-time updates from blockchain events

### Performance Metrics

- **Transaction Confirmation**: ~1-2 seconds (local network)
- **UI Response Time**: <500ms for state updates
- **Error Rate**: 0% for successful transactions
- **Gas Costs**: Minimal (local testing with unlimited gas)

## 🚀 Next Steps After Local Testing

### 1. Testnet Deployment
Once local testing is complete and successful:
```bash
cd backend/smart-contracts
# Configure .env with real private key and testnet RPC
npx hardhat run scripts/deploy-local.js --network optimismSepolia
```

### 2. Frontend Configuration Update
Update `.env.local` with testnet contract addresses:
```env
NEXT_PUBLIC_CHAIN_ID=11155420
NEXT_PUBLIC_RPC_URL=https://sepolia.optimism.io
NEXT_PUBLIC_ICC_TOKEN_ADDRESS=<testnet_address>
NEXT_PUBLIC_GOVERNANCE_ADDRESS=<testnet_address>
```

### 3. Production Readiness Checklist
- [ ] All tests pass on local network
- [ ] Testnet deployment successful
- [ ] Security audit completed
- [ ] Gas optimization verified
- [ ] User experience validated
- [ ] Documentation updated

## 🎉 Demo Preparation

The CivicAI platform is now ready for:
- **Live demos** with real blockchain interactions
- **User testing** with complete civic engagement flows
- **Hackathon presentations** showcasing AI + blockchain governance
- **Production deployment** to mainnet (after security review)

**The integration successfully bridges Web2 UX with Web3 functionality!** 🌟
