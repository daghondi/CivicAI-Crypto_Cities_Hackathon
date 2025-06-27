// React hook for smart contract integration
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { 
  CivicAIContracts, 
  createContractsInstance, 
  SmartContractProposal, 
  SmartContractVote,
  ProposalState,
  VoteType 
} from '@/lib/smartContracts'

// Hook for managing smart contract interactions
export function useSmartContracts() {
  const { address, signer, isConnected } = useWeb3()
  const [contracts, setContracts] = useState<CivicAIContracts | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get provider from signer or create a default one
  const provider = signer?.provider || (typeof window !== 'undefined' && window.ethereum ? 
    new ethers.BrowserProvider(window.ethereum) : null)

  // Initialize contracts when provider/signer changes
  useEffect(() => {
    if (provider) {
      try {
        const contractInstance = createContractsInstance(provider, signer || undefined)
        setContracts(contractInstance)
        setError(null)
      } catch (err) {
        console.error('Failed to initialize contracts:', err)
        setError('Failed to initialize smart contracts')
      }
    }
  }, [provider, signer])

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      contracts?.removeAllListeners()
    }
  }, [contracts])

  const executeWithLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Operation failed'
  ): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await operation()
      return result
    } catch (err) {
      console.error(errorMessage, err)
      setError(err instanceof Error ? err.message : errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    contracts,
    isLoading,
    error,
    isConnected,
    executeWithLoading
  }
}

// Hook for ICC Token operations
export function useICCToken() {
  const { contracts, isLoading, error, executeWithLoading } = useSmartContracts()
  const { address } = useWeb3()
  const [balance, setBalance] = useState<string>('0')
  const [totalRewards, setTotalRewards] = useState<string>('0')

  // Fetch user's ICC balance
  const fetchBalance = useCallback(async (userAddress?: string) => {
    if (!contracts || !userAddress) return null
    return executeWithLoading(
      () => contracts.getICCBalance(userAddress),
      'Failed to fetch ICC balance'
    )
  }, [contracts, executeWithLoading])

  // Fetch total rewards earned
  const fetchTotalRewards = useCallback(async (userAddress?: string) => {
    if (!contracts || !userAddress) return null
    return executeWithLoading(
      () => contracts.getTotalRewardsEarned(userAddress),
      'Failed to fetch total rewards'
    )
  }, [contracts, executeWithLoading])

  // Mint civic reward (admin function)
  const mintReward = useCallback(async (
    recipient: string, 
    action: string, 
    amount: string
  ) => {
    if (!contracts) return null
    return executeWithLoading(
      () => contracts.mintCivicReward(recipient, action, amount),
      'Failed to mint civic reward'
    )
  }, [contracts, executeWithLoading])

  // Refresh user data
  const refreshUserData = useCallback(async () => {
    if (address) {
      const [newBalance, newRewards] = await Promise.all([
        fetchBalance(address),
        fetchTotalRewards(address)
      ])
      if (newBalance) setBalance(newBalance)
      if (newRewards) setTotalRewards(newRewards)
    }
  }, [address, fetchBalance, fetchTotalRewards])

  // Auto-refresh data when address changes
  useEffect(() => {
    refreshUserData()
  }, [refreshUserData])

  return {
    balance,
    totalRewards,
    fetchBalance,
    fetchTotalRewards,
    mintReward,
    refreshUserData,
    isLoading,
    error
  }
}

// Hook for Proposal Governance operations
export function useProposalGovernance() {
  const { contracts, isLoading, error, executeWithLoading } = useSmartContracts()
  const { address } = useWeb3()
  const [proposals, setProposals] = useState<SmartContractProposal[]>([])
  const [userProposals, setUserProposals] = useState<number[]>([])
  const [activeProposals, setActiveProposals] = useState<number[]>([])

  // Create a new proposal
  const createProposal = useCallback(async (
    title: string,
    description: string,
    category: string,
    actions: string[] = [],
    calldatas: string[] = []
  ) => {
    if (!contracts) return null
    return executeWithLoading(
      () => contracts.createProposal(title, description, category, actions, calldatas),
      'Failed to create proposal'
    )
  }, [contracts, executeWithLoading])

  // Vote on a proposal
  const vote = useCallback(async (
    proposalId: number,
    voteType: VoteType,
    reasoning: string = ''
  ) => {
    if (!contracts) return null
    return executeWithLoading(
      () => contracts.vote(proposalId, voteType, reasoning),
      'Failed to submit vote'
    )
  }, [contracts, executeWithLoading])

  // Fetch a single proposal
  const fetchProposal = useCallback(async (proposalId: number) => {
    if (!contracts) return null
    return executeWithLoading(
      () => contracts.getProposal(proposalId),
      `Failed to fetch proposal ${proposalId}`
    )
  }, [contracts, executeWithLoading])

  // Fetch proposal state
  const fetchProposalState = useCallback(async (proposalId: number) => {
    if (!contracts) return null
    return executeWithLoading(
      () => contracts.getProposalState(proposalId),
      `Failed to fetch proposal state ${proposalId}`
    )
  }, [contracts, executeWithLoading])

  // Check if user has voted
  const checkUserVote = useCallback(async (proposalId: number, userAddress?: string) => {
    if (!contracts || !userAddress) return null
    return executeWithLoading(
      () => contracts.hasUserVoted(proposalId, userAddress),
      `Failed to check vote status for proposal ${proposalId}`
    )
  }, [contracts, executeWithLoading])

  // Get user's vote details
  const fetchUserVote = useCallback(async (proposalId: number, userAddress?: string) => {
    if (!contracts || !userAddress) return null
    return executeWithLoading(
      () => contracts.getUserVote(proposalId, userAddress),
      `Failed to fetch user vote for proposal ${proposalId}`
    )
  }, [contracts, executeWithLoading])

  // Fetch active proposals
  const fetchActiveProposals = useCallback(async () => {
    if (!contracts) return null
    const proposalIds = await executeWithLoading(
      () => contracts.getActiveProposals(),
      'Failed to fetch active proposals'
    )
    if (proposalIds) {
      setActiveProposals(proposalIds)
      return proposalIds
    }
    return null
  }, [contracts, executeWithLoading])

  // Fetch user's proposals
  const fetchUserProposals = useCallback(async (userAddress?: string) => {
    if (!contracts || !userAddress) return null
    const proposalIds = await executeWithLoading(
      () => contracts.getUserProposals(userAddress),
      'Failed to fetch user proposals'
    )
    if (proposalIds) {
      setUserProposals(proposalIds)
      return proposalIds
    }
    return null
  }, [contracts, executeWithLoading])

  // Fetch multiple proposals by IDs
  const fetchProposals = useCallback(async (proposalIds: number[]) => {
    if (!contracts || proposalIds.length === 0) return []
    
    const proposalPromises = proposalIds.map(id => 
      contracts.getProposal(id).catch(err => {
        console.error(`Failed to fetch proposal ${id}:`, err)
        return null
      })
    )
    
    const results = await Promise.all(proposalPromises)
    const validProposals = results.filter(p => p !== null) as SmartContractProposal[]
    setProposals(validProposals)
    return validProposals
  }, [contracts])

  // Execute a proposal
  const executeProposal = useCallback(async (proposalId: number) => {
    if (!contracts) return null
    return executeWithLoading(
      () => contracts.executeProposal(proposalId),
      `Failed to execute proposal ${proposalId}`
    )
  }, [contracts, executeWithLoading])

  // Cancel a proposal
  const cancelProposal = useCallback(async (proposalId: number) => {
    if (!contracts) return null
    return executeWithLoading(
      () => contracts.cancelProposal(proposalId),
      `Failed to cancel proposal ${proposalId}`
    )
  }, [contracts, executeWithLoading])

  // Get governance parameters
  const fetchGovernanceParams = useCallback(async () => {
    if (!contracts) return null
    return executeWithLoading(async () => {
      const [votingDuration, minThreshold, quorumPercentage] = await Promise.all([
        contracts.getVotingDuration(),
        contracts.getMinProposalThreshold(),
        contracts.getQuorumPercentage()
      ])
      return {
        votingDuration,
        minThreshold,
        quorumPercentage
      }
    }, 'Failed to fetch governance parameters')
  }, [contracts, executeWithLoading])

  // Auto-refresh user proposals when address changes
  useEffect(() => {
    if (address) {
      fetchUserProposals(address)
    }
  }, [address, fetchUserProposals])

  // Auto-refresh active proposals
  useEffect(() => {
    fetchActiveProposals()
  }, [fetchActiveProposals])

  return {
    proposals,
    userProposals,
    activeProposals,
    createProposal,
    vote,
    fetchProposal,
    fetchProposalState,
    checkUserVote,
    fetchUserVote,
    fetchActiveProposals,
    fetchUserProposals,
    fetchProposals,
    executeProposal,
    cancelProposal,
    fetchGovernanceParams,
    isLoading,
    error
  }
}

// Hook for real-time blockchain events
export function useBlockchainEvents() {
  const { contracts } = useSmartContracts()
  const [events, setEvents] = useState<any[]>([])

  // Listen for proposal creation events
  const subscribeToProposalEvents = useCallback(() => {
    if (!contracts) return () => {}

    const handleProposalCreated = (proposalId: number, proposer: string, title: string) => {
      setEvents(prev => [...prev, {
        type: 'ProposalCreated',
        proposalId,
        proposer,
        title,
        timestamp: Date.now()
      }])
    }

    const handleVoteCast = (proposalId: number, voter: string, voteType: number, votingPower: bigint) => {
      setEvents(prev => [...prev, {
        type: 'VoteCast',
        proposalId,
        voter,
        voteType,
        votingPower: votingPower.toString(),
        timestamp: Date.now()
      }])
    }

    const handleRewardMinted = (recipient: string, action: string, amount: bigint) => {
      setEvents(prev => [...prev, {
        type: 'CivicRewardMinted',
        recipient,
        action,
        amount: ethers.formatEther(amount),
        timestamp: Date.now()
      }])
    }

    contracts.onProposalCreated(handleProposalCreated)
    contracts.onVoteCast(handleVoteCast)
    contracts.onCivicRewardMinted(handleRewardMinted)

    return () => {
      contracts.removeAllListeners()
    }
  }, [contracts])

  useEffect(() => {
    const unsubscribe = subscribeToProposalEvents()
    return unsubscribe
  }, [subscribeToProposalEvents])

  return {
    events,
    clearEvents: () => setEvents([])
  }
}

// Combined hook for all smart contract functionality
export function useCivicAIContracts() {
  const iccToken = useICCToken()
  const governance = useProposalGovernance()
  const events = useBlockchainEvents()
  
  return {
    iccToken,
    governance,
    events
  }
}
