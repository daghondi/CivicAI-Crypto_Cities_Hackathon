#!/bin/bash

echo "🏛️ CivicAI Advanced Features Testing Script"
echo "==========================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-""}
    
    echo "Testing $method $endpoint..."
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "http://localhost:3000$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" "http://localhost:3000$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo "✅ $endpoint - HTTP $http_code"
    else
        echo "❌ $endpoint - HTTP $http_code"
        echo "Response: $body"
    fi
    echo ""
}

# Check if Node.js and npm are installed
if ! command_exists node; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Check if the development server is running
if ! curl -s http://localhost:3000 >/dev/null; then
    echo "❌ Development server is not running at http://localhost:3000"
    echo "Please start the server with: npm run dev"
    exit 1
fi

echo "✅ Development server is running"
echo ""

# Test API endpoints
echo "🔧 Testing API Endpoints"
echo "------------------------"

# Test proposals endpoint
test_api "/api/proposals"

# Test AI generation endpoint
test_api "/api/ai/generate" "POST" '{
  "problem": "Test traffic issue for automated testing",
  "category": "transportation",
  "location": "Test City",
  "urgency": "medium"
}'

# Test votes endpoint (should return error without proposal_id)
test_api "/api/votes"

# Test user profile endpoint (should create a new profile)
test_api "/api/users/0x1234567890123456789012345678901234567890"

echo "🔐 Testing Wallet Integration Features"
echo "------------------------------------"

# Check if Thirdweb packages are installed
if npm list @thirdweb-dev/react >/dev/null 2>&1; then
    echo "✅ Thirdweb React SDK is installed"
else
    echo "❌ Thirdweb React SDK is not installed"
fi

if npm list @thirdweb-dev/sdk >/dev/null 2>&1; then
    echo "✅ Thirdweb SDK is installed"
else
    echo "❌ Thirdweb SDK is not installed"
fi

if npm list ethers >/dev/null 2>&1; then
    echo "✅ Ethers.js is installed"
else
    echo "❌ Ethers.js is not installed"
fi

echo ""

echo "📁 Checking File Structure"
echo "--------------------------"

# Check if key files exist
files=(
    "src/lib/thirdweb.ts"
    "src/components/providers/Web3Provider.tsx"
    "src/components/forms/VotingInterface.tsx"
    "src/app/api/users/[address]/route.ts"
    "src/hooks/useGovernance.ts"
    "backend/supabase/migrations/005_wallet_integration.sql"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

echo ""

echo "🎯 Manual Testing Checklist"
echo "---------------------------"
echo "1. ✅ Connect MetaMask wallet"
echo "2. ✅ Switch to Optimism Sepolia testnet"
echo "3. ✅ Create a new proposal"
echo "4. ✅ Sign a vote with your wallet"
echo "5. ✅ Verify one vote per wallet enforcement"
echo "6. ✅ Check user profile and badges"
echo "7. ✅ Test ENS name resolution"
echo "8. ✅ Verify vote signature in backend"

echo ""
echo "🔗 Useful Links for Testing"
echo "---------------------------"
echo "• Optimism Sepolia Faucet: https://sepoliafaucet.com/"
echo "• Optimism Sepolia Explorer: https://sepolia-optimism.etherscan.io/"
echo "• Add Optimism Sepolia to MetaMask:"
echo "  - Network Name: Optimism Sepolia"
echo "  - RPC URL: https://sepolia.optimism.io"
echo "  - Chain ID: 11155420"
echo "  - Currency Symbol: ETH"
echo "  - Block Explorer: https://sepolia-optimism.etherscan.io"

echo ""
echo "🚀 Next Steps"
echo "-------------"
echo "1. Run database migrations: npm run db:migrate"
echo "2. Start the development server: npm run dev"
echo "3. Connect your wallet and test voting"
echo "4. Check vote signatures in Supabase"
echo "5. Test user profiles and badges"

echo ""
echo "Testing complete! 🎉"
