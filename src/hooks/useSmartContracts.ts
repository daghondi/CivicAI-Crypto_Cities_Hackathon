'use client'

import { useState, useEffect } from 'react'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { ContractUtils } from '@/lib/contracts'

export function useSmartContracts() {
  const { signer, isConnected, address } = useWeb3()
  const [iccBalance, setIccBalance] = useState<string>('0')
  const [userStats, setUserStats] = useState({
    proposalsCreated: '0',
    votescast: '0'
  })
  const [loading, setLoading] = useState(false)

  // Get provider from signer
  const provider = signer?.provider

  // Fetch user data when wallet connects
  useEffect(() => {
    if (isConnected && address && provider) {
      fetchUserData()
    }
  }, [isConnected, address, provider])

  const fetchUserData = async () => {
    if (!address || !provider) return
    
    setLoading(true)
    try {
      const [balance, stats] = await Promise.all([
        ContractUtils.getICCBalance(provider, address),
        ContractUtils.getUserStats(provider, address)
      ])
      
      setIccBalance(balance)
      setUserStats(stats)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProposal = async (title: string, description: string, category: string) => {
    if (!signer) {
      throw new Error('Wallet not connected')
    }
    
    setLoading(true)
    try {
      const result = await ContractUtils.createProposal(signer, title, description, category)
      
      if (result.success) {
        // Refresh user stats after successful proposal creation
        await fetchUserData()
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }

  const castVote = async (proposalId: number, voteType: 0 | 1 | 2) => {
    if (!signer) {
      throw new Error('Wallet not connected')
    }
    
    setLoading(true)
    try {
      const result = await ContractUtils.castVote(signer, proposalId, voteType)
      
      if (result.success) {
        // Refresh user stats after successful vote
        await fetchUserData()
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }

  const getProposal = async (proposalId: number) => {
    if (!provider) {
      throw new Error('Provider not available')
    }
    
    return ContractUtils.getProposal(provider, proposalId)
  }

  const hasUserVoted = async (proposalId: number) => {
    if (!provider || !address) {
      return false
    }
    
    return ContractUtils.hasUserVoted(provider, proposalId, address)
  }

  const executeProposal = async (proposalId: number) => {
    if (!signer) {
      throw new Error('Wallet not connected')
    }
    
    setLoading(true)
    try {
      const result = await ContractUtils.executeProposal(signer, proposalId)
      
      if (result.success) {
        // Refresh user data after successful execution
        await fetchUserData()
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }

  const cancelProposal = async (proposalId: number) => {
    if (!signer) {
      throw new Error('Wallet not connected')
    }
    
    setLoading(true)
    try {
      const result = await ContractUtils.cancelProposal(signer, proposalId)
      
      if (result.success) {
        // Refresh user data after successful cancellation
        await fetchUserData()
      }
      
      return result
    } finally {
      setLoading(false)
    }
  }

  const getProposalState = async (proposalId: number) => {
    if (!provider) {
      throw new Error('Provider not available')
    }
    
    return ContractUtils.getProposalState(provider, proposalId)
  }

  return {
    // User data
    iccBalance,
    userStats,
    loading,
    
    // Actions
    createProposal,
    castVote,
    getProposal,
    hasUserVoted,
    executeProposal,
    cancelProposal,
    getProposalState,
    refreshUserData: fetchUserData,
    
    // Wallet state
    isConnected,
    address
  }
}

export default useSmartContracts
