#!/usr/bin/env pwsh

# CivicAI Testnet Deployment Helper Script
Write-Host "🚀 CivicAI Testnet Deployment Helper" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Check if in correct directory
$currentDir = Get-Location
if (-not (Test-Path "backend/smart-contracts")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Navigate to smart contracts directory
Set-Location "backend/smart-contracts"

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with your PRIVATE_KEY" -ForegroundColor Yellow
    exit 1
}

# Check if private key is set (basic check)
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "PRIVATE_KEY=.+") {
    Write-Host "❌ PRIVATE_KEY not found in .env file!" -ForegroundColor Red
    Write-Host "Please add your private key to .env file" -ForegroundColor Yellow
    Write-Host "Format: PRIVATE_KEY=your_key_without_0x_prefix" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment file found with private key" -ForegroundColor Green

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dependencies ready" -ForegroundColor Green

# Compile contracts
Write-Host "🔨 Compiling contracts..." -ForegroundColor Yellow
npx hardhat compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Contract compilation failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Contracts compiled successfully" -ForegroundColor Green

# Ask for confirmation
Write-Host ""
Write-Host "⚠️  READY TO DEPLOY TO OPTIMISM SEPOLIA TESTNET" -ForegroundColor Yellow
Write-Host "Make sure you have:" -ForegroundColor White
Write-Host "  • Optimism Sepolia ETH in your wallet" -ForegroundColor White
Write-Host "  • Your private key in .env file" -ForegroundColor White
Write-Host "  • You're using a TEST wallet only" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Do you want to proceed with deployment? (y/N)"

if ($confirmation -ne "y" -and $confirmation -ne "Y") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Deploy contracts
npx hardhat run scripts/deploy-optimism.js --network optimismSepolia

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Copy the contract addresses from above" -ForegroundColor White
    Write-Host "2. Update src/lib/contracts.ts with the new addresses" -ForegroundColor White
    Write-Host "3. Test the application on Optimism Sepolia network" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 View on Optimism Sepolia Explorer:" -ForegroundColor Cyan
    Write-Host "https://sepolia-optimism.etherscan.io/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "Check the error messages above and try again" -ForegroundColor Yellow
}

# Return to original directory
Set-Location $currentDir
