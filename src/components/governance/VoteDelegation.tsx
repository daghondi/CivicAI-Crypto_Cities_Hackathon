'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ContractUtils } from '@/lib/contracts'
import { useWeb3 } from '@/components/providers/Web3Provider'

interface VoteDelegationProps {
  onDelegationUpdate?: () => void
}

export function VoteDelegation({ onDelegationUpdate }: VoteDelegationProps) {
  const { signer, isConnected, address } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [iccBalance, setIccBalance] = useState('0')
  const [votingPower, setVotingPower] = useState('0')
  const [delegateAddress, setDelegateAddress] = useState('')
  const [delegateAmount, setDelegateAmount] = useState('')
  const [showDelegationForm, setShowDelegationForm] = useState(false)

  // Get provider from signer
  const provider = signer?.provider

  useEffect(() => {
    if (provider && address) {
      fetchUserData()
    }
  }, [provider, address])

  const fetchUserData = async () => {
    if (!provider || !address) return

    try {
      const [balance, votePower] = await Promise.all([
        ContractUtils.getICCBalance(provider, address),
        ContractUtils.getVotingPower(provider, address)
      ])
      
      setIccBalance(balance)
      setVotingPower(votePower)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleDelegate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signer || !isConnected) {
      alert('Please connect your wallet first')
      return
    }

    if (!delegateAddress.trim() || !delegateAmount.trim()) {
      alert('Please fill in all fields')
      return
    }

    if (parseFloat(delegateAmount) <= 0) {
      alert('Delegation amount must be greater than 0')
      return
    }

    if (parseFloat(delegateAmount) > parseFloat(iccBalance)) {
      alert('Insufficient I₵C balance')
      return
    }

    setIsLoading(true)

    try {
      const txHash = await ContractUtils.delegateVote(signer, delegateAddress, delegateAmount)
      alert(`Vote delegated successfully! Transaction: ${txHash}`)
      
      // Reset form and refresh data
      setDelegateAddress('')
      setDelegateAmount('')
      setShowDelegationForm(false)
      await fetchUserData()
      onDelegationUpdate?.()
      
    } catch (error: any) {
      console.error('Error delegating vote:', error)
      alert(`Error delegating vote: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUndelegate = async (delegate: string) => {
    if (!signer || !isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setIsLoading(true)

    try {
      const txHash = await ContractUtils.undelegateVote(signer, delegate)
      alert(`Vote undelegated successfully! Transaction: ${txHash}`)
      
      await fetchUserData()
      onDelegationUpdate?.()
      
    } catch (error: any) {
      console.error('Error undelegating vote:', error)
      alert(`Error undelegating vote: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">Connect your wallet to manage vote delegation</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vote Delegation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Your I₵C Balance</h4>
            <p className="text-2xl font-bold text-blue-700">{parseFloat(iccBalance).toFixed(2)}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-1">Total Voting Power</h4>
            <p className="text-2xl font-bold text-green-700">{parseFloat(votingPower).toFixed(2)}</p>
            <p className="text-sm text-green-600 mt-1">Includes delegated power</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-yellow-900 mb-2">How Vote Delegation Works</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Delegate your I₵C voting power to trusted community members</li>
            <li>• Your delegated votes will count towards their voting power</li>
            <li>• You can revoke delegation at any time</li>
            <li>• Delegation does not transfer ownership of your tokens</li>
          </ul>
        </div>

        {!showDelegationForm ? (
          <Button
            onClick={() => setShowDelegationForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Delegate Voting Power
          </Button>
        ) : (
          <form onSubmit={handleDelegate} className="space-y-4">
            <div>
              <label htmlFor="delegate-address" className="block text-sm font-medium text-gray-700 mb-1">
                Delegate Address *
              </label>
              <Input
                id="delegate-address"
                value={delegateAddress}
                onChange={(e) => setDelegateAddress(e.target.value)}
                placeholder="0x..."
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="delegate-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Delegate (I₵C) *
              </label>
              <Input
                id="delegate-amount"
                type="number"
                step="0.01"
                min="0.01"
                max={iccBalance}
                value={delegateAmount}
                onChange={(e) => setDelegateAmount(e.target.value)}
                placeholder="0.00"
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {parseFloat(iccBalance).toFixed(2)} I₵C
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Delegating...' : 'Delegate'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowDelegationForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Active Delegations - This would need additional state management to track */}
      <Card className="p-6">
        <h4 className="font-medium text-gray-900 mb-3">Active Delegations</h4>
        <p className="text-sm text-gray-600">
          To view and manage your active delegations, check the blockchain directly or use a block explorer.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Note: Advanced delegation management coming in future updates.
        </p>
      </Card>
    </div>
  )
}

export default VoteDelegation
