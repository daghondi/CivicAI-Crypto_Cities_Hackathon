'use client'

import { useSmartContracts } from '@/hooks/useSmartContracts'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function SmartContractStatus() {
  const { 
    iccBalance, 
    userStats, 
    loading, 
    isConnected, 
    address 
  } = useSmartContracts()

  if (!isConnected) {
    return (
      <Card className="p-4">
        <p className="text-gray-600">Connect your wallet to view smart contract data</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Smart Contract Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Wallet Address:</span>
          <Badge variant="secondary" className="font-mono text-xs">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">I₵C Balance:</span>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
          ) : (
            <Badge variant="primary">{iccBalance} I₵C</Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Proposals Created:</span>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
          ) : (
            <Badge variant="secondary">{userStats.proposalsCreated}</Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Votes Cast:</span>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
          ) : (
            <Badge variant="secondary">{userStats.votescast}</Badge>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Smart contracts connected</span>
        </div>
      </div>
    </Card>
  )
}
