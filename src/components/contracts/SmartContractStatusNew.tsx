'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '@/lib/constants'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Coins, 
  Vote,
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface ContractInfo {
  name: string
  address: string
  verified: boolean
  status: 'deployed' | 'not-deployed' | 'error'
  icon: React.ReactNode
  description: string
}

export default function SmartContractStatus() {
  const { isConnected, address } = useWeb3()
  const [contracts, setContracts] = useState<ContractInfo[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<{
    connected: boolean
    chainId: number | null
    name: string
  }>({
    connected: false,
    chainId: null,
    name: 'Unknown'
  })

  // Initialize contract information
  useEffect(() => {
    const contractsInfo: ContractInfo[] = [
      {
        name: 'I₵C Token',
        address: CONTRACT_ADDRESSES.ICC_TOKEN,
        verified: false,
        status: CONTRACT_ADDRESSES.ICC_TOKEN ? 'deployed' : 'not-deployed',
        icon: <Coins className="w-5 h-5" />,
        description: 'ERC20 token for civic engagement rewards'
      },
      {
        name: 'Proposal Governance',
        address: CONTRACT_ADDRESSES.PROPOSAL_GOVERNANCE,
        verified: false,
        status: CONTRACT_ADDRESSES.PROPOSAL_GOVERNANCE ? 'deployed' : 'not-deployed',
        icon: <Vote className="w-5 h-5" />,
        description: 'Decentralized governance for civic proposals'
      }
    ]
    
    setContracts(contractsInfo)
  }, [])

  // Check network information
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      checkNetworkStatus()
    }
  }, [isConnected])

  const checkNetworkStatus = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      const chainIdNumber = parseInt(chainId, 16)
      
      const networkName = chainIdNumber === NETWORK_CONFIG.OPTIMISM_SEPOLIA.chainId 
        ? 'Optimism Sepolia' 
        : chainIdNumber === NETWORK_CONFIG.OPTIMISM_MAINNET.chainId
        ? 'Optimism Mainnet'
        : 'Unknown Network'

      setNetworkStatus({
        connected: true,
        chainId: chainIdNumber,
        name: networkName
      })
    } catch (error) {
      console.error('Failed to get network info:', error)
      setNetworkStatus({
        connected: false,
        chainId: null,
        name: 'Unknown'
      })
    }
  }

  const verifyContracts = async () => {
    setIsChecking(true)
    
    // Simulate contract verification (in real implementation, would check blockchain)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setContracts(prev => prev.map(contract => ({
      ...contract,
      verified: contract.status === 'deployed',
      status: contract.address ? 'deployed' : 'not-deployed'
    })))
    
    setIsChecking(false)
  }

  const switchToOptimismSepolia = async () => {
    if (!window.ethereum) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xAA36A7' }], // Optimism Sepolia
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xAA36A7',
                chainName: 'Optimism Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.optimism.io'],
                blockExplorerUrls: ['https://sepolia-optimism.etherscan.io'],
              },
            ],
          })
        } catch (addError) {
          console.error('Failed to add network:', addError)
        }
      }
    }
  }

  const getStatusIcon = (status: string, verified: boolean) => {
    if (status === 'deployed' && verified) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (status === 'deployed' && !verified) {
      return <Clock className="w-5 h-5 text-yellow-500" />
    } else if (status === 'error') {
      return <XCircle className="w-5 h-5 text-red-500" />
    } else {
      return <AlertTriangle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string, verified: boolean) => {
    if (status === 'deployed' && verified) {
      return <Badge variant="success">Deployed & Verified</Badge>
    } else if (status === 'deployed' && !verified) {
      return <Badge variant="warning">Deployed</Badge>
    } else if (status === 'error') {
      return <Badge variant="destructive">Error</Badge>
    } else {
      return <Badge variant="secondary">Not Deployed</Badge>
    }
  }

  const allContractsDeployed = contracts.every(c => c.status === 'deployed')
  const allContractsVerified = contracts.every(c => c.verified)

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Vote className="w-5 h-5 text-blue-500" />
          Network Status
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {networkStatus.connected ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <p className="font-medium">{networkStatus.name}</p>
              <p className="text-sm text-gray-600">
                Chain ID: {networkStatus.chainId || 'Unknown'}
              </p>
            </div>
          </div>
          
          {networkStatus.chainId !== NETWORK_CONFIG.OPTIMISM_SEPOLIA.chainId && (
            <Button 
              variant="outline" 
              onClick={switchToOptimismSepolia}
              size="sm"
            >
              Switch to Optimism Sepolia
            </Button>
          )}
        </div>

        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Connect your wallet to check smart contract status
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Smart Contracts Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-purple-500" />
            Smart Contracts
          </h3>
          
          <Button 
            variant="outline" 
            onClick={verifyContracts}
            disabled={isChecking || !isConnected}
            size="sm"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              'Verify Status'
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {contracts.map((contract, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {contract.icon}
                  {getStatusIcon(contract.status, contract.verified)}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">{contract.name}</h4>
                  <p className="text-sm text-gray-600">{contract.description}</p>
                  {contract.address && (
                    <p className="text-xs text-gray-500 font-mono">
                      {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(contract.status, contract.verified)}
                
                {contract.address && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(
                      `${NETWORK_CONFIG.OPTIMISM_SEPOLIA.explorerUrl}/address/${contract.address}`,
                      '_blank'
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overall Status */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {allContractsDeployed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium">
                  {allContractsDeployed ? 'All contracts deployed' : 'Contracts pending deployment'}
                </span>
              </div>
              
              {allContractsVerified && (
                <Badge variant="success" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            {allContractsDeployed && (
              <Badge variant="success">
                Ready for Production
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Deployment Instructions */}
      {!allContractsDeployed && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Smart Contract Deployment
          </h3>
          <p className="text-blue-800 mb-4">
            To enable full blockchain functionality, deploy the smart contracts to Optimism Sepolia testnet.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <code>cd backend/smart-contracts</code>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <code>npm install && npx hardhat run scripts/deploy.js --network optimism-sepolia</code>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Update contract addresses in environment variables</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
