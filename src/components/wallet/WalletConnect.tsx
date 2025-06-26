'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function WalletConnect() {
  const { open } = useWeb3Modal()
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnecting) {
    return (
      <Button disabled size="sm">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Connecting...
        </div>
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Connected</span>
        </div>
        <Badge variant="primary" className="font-mono">
          {formatAddress(address)}
        </Badge>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => disconnect()}
          className="hidden sm:flex"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={() => open()} 
      variant="outline" 
      size="sm"
    >
      Connect Wallet
    </Button>
  )
}