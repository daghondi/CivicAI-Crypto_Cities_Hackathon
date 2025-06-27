'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { CONTRACTS } from '@/lib/contracts'
import { ChevronDown, Wifi, WifiOff, ExternalLink } from 'lucide-react'

export default function NetworkSelector() {
  const { isConnected, signer } = useWeb3()
  const [isOpen, setIsOpen] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)

  useEffect(() => {
    if (signer && signer.provider) {
      signer.provider.getNetwork().then((network: any) => {
        setChainId(Number(network.chainId))
      })
    }
  }, [signer])

  const currentNetwork = Object.entries(CONTRACTS).find(
    ([_, config]) => config.chainId === chainId
  )

  const networks = Object.entries(CONTRACTS).map(([key, config]) => ({
    key,
    ...config
  }))

  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        })
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-3 bg-dark-surface/30 border-logo-dark/20">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <WifiOff className="w-4 h-4" />
          <span>Connect wallet to see network</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="relative">
      <Card 
        className={`p-3 cursor-pointer transition-all duration-200 hover:bg-dark-surface/50 backdrop-blur-sm ${
          isOpen ? 'ring-2 ring-logo-electric/50' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-logo-electric" />
            <div>
              <div className="font-medium text-sm text-text-primary">
                {currentNetwork?.[1].name || 'Unknown Network'}
              </div>
              <div className="text-xs text-text-secondary">
                Chain ID: {chainId}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={currentNetwork ? 'primary' : 'secondary'}
              className="text-xs"
            >
              {currentNetwork ? 'Supported' : 'Unsupported'}
            </Badge>
            <ChevronDown className={`w-4 h-4 transition-transform text-text-primary ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>
        </div>
      </Card>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-2 shadow-lg border border-logo-dark/20 z-10 bg-dark-surface/95 backdrop-blur-md">
          <div className="space-y-2">
            <div className="text-sm font-medium text-text-primary p-2">
              Available Networks
            </div>
            
            {networks.map((network) => (
              <button
                key={network.key}
                onClick={() => handleNetworkSwitch(network.chainId)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  network.chainId === chainId
                    ? 'bg-logo-electric/10 border border-logo-electric/30'
                    : 'hover:bg-dark-surface/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-text-primary">{network.name}</div>
                    <div className="text-xs text-text-secondary">
                      Chain ID: {network.chainId}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {network.chainId === chainId && (
                      <Badge variant="primary" className="text-xs">
                        Current
                      </Badge>
                    )}
                    {network.key === 'optimismSepolia' && (
                      <ExternalLink className="w-3 h-3 text-text-secondary" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-logo-dark/20 pt-2 mt-2">
            <div className="text-xs text-text-secondary p-2">
              💡 Tip: Make sure you have test ETH for the selected network
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
