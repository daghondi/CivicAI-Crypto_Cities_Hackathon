'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { CONTRACTS, getCurrentNetwork } from '@/lib/contracts'
import { ExternalLink, CheckCircle, XCircle, AlertTriangle, Copy } from 'lucide-react'

export default function DeploymentStatus() {
  const { provider, isConnected, chainId } = useWeb3()
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [contractStatus, setContractStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected && provider) {
      checkDeploymentStatus()
    }
  }, [isConnected, provider, chainId])

  const checkDeploymentStatus = async () => {
    if (!provider) return

    setLoading(true)
    try {
      const network = await getCurrentNetwork(provider)
      setNetworkInfo(network)

      if (network) {
        // Check if contracts are deployed by verifying addresses exist and are not placeholder
        const iccTokenDeployed = network.config.ICCToken !== '0x1234567890123456789012345678901234567890'
        const governanceDeployed = network.config.ProposalGovernance !== '0x0987654321098765432109876543210987654321'

        setContractStatus({
          ICCToken: iccTokenDeployed,
          ProposalGovernance: governanceDeployed
        })
      }
    } catch (error) {
      console.error('Error checking deployment status:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getBlockExplorerUrl = (address: string) => {
    if (networkInfo?.key === 'optimismSepolia') {
      return `https://sepolia-optimism.etherscan.io/address/${address}`
    }
    return null
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Connect your wallet to view deployment status</p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!networkInfo) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-2 text-red-800">
          <XCircle className="w-5 h-5" />
          <div>
            <div className="font-medium">Unsupported Network</div>
            <div className="text-sm">Switch to a supported network to use the application</div>
          </div>
        </div>
      </Card>
    )
  }

  const allContractsDeployed = Object.values(contractStatus).every(Boolean)

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Deployment Status</h3>
          <Badge 
            variant={allContractsDeployed ? 'secondary' : 'secondary'}
            className="flex items-center space-x-1"
          >
            {allContractsDeployed ? (
              <>
                <CheckCircle className="w-3 h-3" />
                <span>Ready</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>Incomplete</span>
              </>
            )}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Network: <span className="font-medium">{networkInfo.config.name}</span>
        </p>
      </div>

      <div className="space-y-3">
        {Object.entries(contractStatus).map(([contractName, isDeployed]) => {
          const address = networkInfo.config[contractName]
          const explorerUrl = getBlockExplorerUrl(address)

          return (
            <div key={contractName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {isDeployed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <div className="font-medium text-sm">{contractName}</div>
                  {address && (
                    <div className="text-xs text-gray-500 font-mono">
                      {address.slice(0, 8)}...{address.slice(-6)}
                    </div>
                  )}
                </div>
              </div>

              {isDeployed && address && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(address)}
                    className="p-2"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {explorerUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(explorerUrl, '_blank')}
                      className="p-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!allContractsDeployed && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <div className="font-medium mb-1">Contracts not deployed</div>
              <div>
                Some contracts are not deployed on this network. 
                {networkInfo.key === 'optimismSepolia' && (
                  <span> Deploy them using the deployment script.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {networkInfo.key === 'localhost' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">Local Development</div>
            <div>
              Make sure your local Hardhat node is running and contracts are deployed.
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
