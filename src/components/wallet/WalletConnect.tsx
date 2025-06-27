'use client'

import { useWeb3 } from '@/components/providers/Web3Provider'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatAddress } from '@/lib/thirdweb'

export default function WalletConnect() {
  const { address, ensName, isConnected, isConnecting, connect, disconnect } = useWeb3()

  if (isConnecting) {
    return (
      <Button disabled size="sm">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-logo-electric mr-2"></div>
          Connecting...
        </div>
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-2 h-2 bg-logo-electric rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Connected</span>
        </div>
        <Badge variant="primary" className="font-mono">
          {ensName || formatAddress(address)}
        </Badge>
        <Button 
          variant="outline" 
          size="sm"
          onClick={disconnect}
          className="hidden sm:flex"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={connect} 
      variant="outline" 
      size="sm"
    >
      Connect Wallet
    </Button>
  )
}