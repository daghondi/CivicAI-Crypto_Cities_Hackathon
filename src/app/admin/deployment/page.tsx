'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useWeb3 } from '@/components/providers/Web3Provider'
import SmartContractStatus from '@/components/contracts/SmartContractStatus'
import { useCivicAIContracts } from '@/hooks/useSmartContracts'
import { CONTRACT_CONFIG } from '@/lib/constants'
import { 
  Rocket, 
  Settings, 
  Code, 
  Terminal,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download
} from 'lucide-react'

export default function DeploymentPage() {
  const { isConnected, address } = useWeb3()
  const { iccToken, governance } = useCivicAIContracts()
  const [deploymentStep, setDeploymentStep] = useState(0)
  const [deploymentLog, setDeploymentLog] = useState<string[]>([])

  const deploymentSteps = [
    {
      title: 'Prerequisites Check',
      description: 'Verify environment and wallet setup',
      icon: <Settings className="w-5 h-5" />,
      completed: false
    },
    {
      title: 'Deploy I₵C Token',
      description: 'Deploy the ERC20 token contract',
      icon: <Code className="w-5 h-5" />,
      completed: false
    },
    {
      title: 'Deploy Governance',
      description: 'Deploy the proposal governance contract',
      icon: <Code className="w-5 h-5" />,
      completed: false
    },
    {
      title: 'Configure Contracts',
      description: 'Set up contract interactions and permissions',
      icon: <Settings className="w-5 h-5" />,
      completed: false
    },
    {
      title: 'Verify Contracts',
      description: 'Verify contracts on block explorer',
      icon: <CheckCircle className="w-5 h-5" />,
      completed: false
    }
  ]

  const envTemplate = `# Add these to your .env.local file after deployment
NEXT_PUBLIC_ICC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_PROPOSAL_GOVERNANCE_ADDRESS=0x...

# Network Configuration
NEXT_PUBLIC_NETWORK_CHAIN_ID=11155420
NEXT_PUBLIC_RPC_URL=https://sepolia.optimism.io
NEXT_PUBLIC_EXPLORER_URL=https://sepolia-optimism.etherscan.io`

  const deploymentCommands = [
    '# Navigate to smart contracts directory',
    'cd backend/smart-contracts',
    '',
    '# Install dependencies',
    'npm install',
    '',
    '# Compile contracts',
    'npx hardhat compile',
    '',
    '# Deploy to Optimism Sepolia',
    'npx hardhat run scripts/deploy.js --network optimism-sepolia',
    '',
    '# Verify contracts (optional)',
    'npx hardhat verify --network optimism-sepolia <CONTRACT_ADDRESS>'
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadEnvTemplate = () => {
    const blob = new Blob([envTemplate], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env.template'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadDeployScript = () => {
    const script = deploymentCommands.join('\n')
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'deploy.sh'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Contract Deployment
            </h1>
            <p className="text-gray-600 mb-8">
              Connect your wallet to begin smart contract deployment
            </p>
            <Button size="lg">
              Connect Wallet
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Rocket className="w-8 h-8 text-blue-500" />
            Smart Contract Deployment
          </h1>
          <p className="text-gray-600">
            Deploy and configure CivicAI smart contracts on Optimism Sepolia testnet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Status */}
            <SmartContractStatus />

            {/* Deployment Steps */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Deployment Process
              </h2>
              
              <div className="space-y-4">
                {deploymentSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      step.completed 
                        ? 'bg-green-50 border-green-200' 
                        : index === deploymentStep 
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      step.completed 
                        ? 'bg-green-100 text-green-600'
                        : index === deploymentStep
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    
                    {step.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Manual Deployment Instructions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-gray-700" />
                Manual Deployment
              </h2>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                {deploymentCommands.map((command, index) => (
                  <div key={index} className="mb-1">
                    {command}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(deploymentCommands.join('\n'))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Commands
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadDeployScript}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Script
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Environment Configuration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Environment Setup
              </h3>
              
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs mb-4 overflow-x-auto">
                {envTemplate}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(envTemplate)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadEnvTemplate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>

            {/* Configuration Parameters */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contract Parameters
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Voting Duration:</span>
                  <span className="font-medium">{CONTRACT_CONFIG.VOTING_DURATION_DAYS} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Proposal Threshold:</span>
                  <span className="font-medium">{CONTRACT_CONFIG.MIN_PROPOSAL_THRESHOLD_ICC} I₵C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quorum:</span>
                  <span className="font-medium">{CONTRACT_CONFIG.QUORUM_PERCENTAGE}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proposal Cooldown:</span>
                  <span className="font-medium">{CONTRACT_CONFIG.PROPOSAL_COOLDOWN_HOURS}h</span>
                </div>
              </div>
            </Card>

            {/* Resources */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resources
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('https://docs.optimism.io/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Optimism Documentation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('https://hardhat.org/docs', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Hardhat Documentation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('https://sepolia-optimism.etherscan.io/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Optimism Sepolia Explorer
                </Button>
              </div>
            </Card>

            {/* Warning */}
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Testnet Deployment
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This deployment is for Optimism Sepolia testnet only. 
                    Use testnet ETH from faucets for gas fees.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
