import { useState, useEffect } from 'react'
import { useWeb3 } from '@/components/providers/Web3Provider'

interface GovernanceStats {
  totalProposals: number
  activeProposals: number
  totalVotes: number
  userVotes: number
  userReputation: number
}

interface GovernanceConfig {
  minimumVotingPeriod: number
  quorumThreshold: number
  proposalThreshold: number
}

export const useGovernance = () => {
  const { address, isConnected } = useWeb3()
  const [stats, setStats] = useState<GovernanceStats>({
    totalProposals: 0,
    activeProposals: 0,
    totalVotes: 0,
    userVotes: 0,
    userReputation: 0
  })
  const [config] = useState<GovernanceConfig>({
    minimumVotingPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
    quorumThreshold: 50, // 50% participation required
    proposalThreshold: 10 // Minimum reputation to create proposals
  })

  useEffect(() => {
    if (isConnected && address) {
      fetchGovernanceStats()
    }
  }, [isConnected, address])

  const fetchGovernanceStats = async () => {
    try {
      // Fetch general stats
      const [proposalsRes, userRes] = await Promise.all([
        fetch('/api/proposals'),
        address ? fetch(`/api/users/${address}`) : null
      ])

      const proposalsData = await proposalsRes.json()
      const userData = userRes ? await userRes.json() : null

      setStats({
        totalProposals: proposalsData.proposals?.length || 0,
        activeProposals: proposalsData.proposals?.filter((p: any) => p.status === 'active').length || 0,
        totalVotes: proposalsData.proposals?.reduce((sum: number, p: any) => 
          sum + (p.vote_stats?.total_votes || 0), 0) || 0,
        userVotes: userData?.stats?.totalVotes || 0,
        userReputation: userData?.stats?.reputationScore || 0
      })
    } catch (error) {
      console.error('Error fetching governance stats:', error)
    }
  }

  const canCreateProposal = () => {
    return isConnected && stats.userReputation >= config.proposalThreshold
  }

  const canVote = (proposalId: string) => {
    return isConnected && address
  }

  const checkVoteEligibility = async (proposalId: string) => {
    if (!address) return { eligible: false, reason: 'Wallet not connected' }

    try {
      const response = await fetch(`/api/votes?proposal_id=${proposalId}&wallet_address=${address}`)
      const data = await response.json()

      if (data.hasVoted) {
        return { eligible: false, reason: 'Already voted on this proposal' }
      }

      return { eligible: true, reason: 'Eligible to vote' }
    } catch (error) {
      return { eligible: false, reason: 'Error checking vote status' }
    }
  }

  const getProposalQuorum = (totalVotes: number, totalEligibleVoters: number = 1000) => {
    const participationRate = (totalVotes / totalEligibleVoters) * 100
    const hasQuorum = participationRate >= config.quorumThreshold
    
    return {
      participationRate: Math.round(participationRate),
      hasQuorum,
      requiredQuorum: config.quorumThreshold,
      votesNeeded: Math.max(0, Math.ceil(totalEligibleVoters * config.quorumThreshold / 100) - totalVotes)
    }
  }

  const calculateProposalOutcome = (forVotes: number, againstVotes: number, abstainVotes: number) => {
    const totalVotes = forVotes + againstVotes + abstainVotes
    const supportPercentage = totalVotes > 0 ? (forVotes / (forVotes + againstVotes)) * 100 : 0
    
    let outcome: 'passed' | 'failed' | 'pending' = 'pending'
    if (totalVotes > 0) {
      outcome = supportPercentage > 50 ? 'passed' : 'failed'
    }

    return {
      outcome,
      supportPercentage: Math.round(supportPercentage),
      totalVotes,
      breakdown: {
        for: forVotes,
        against: againstVotes,
        abstain: abstainVotes
      }
    }
  }

  return {
    stats,
    config,
    canCreateProposal,
    canVote,
    checkVoteEligibility,
    getProposalQuorum,
    calculateProposalOutcome,
    refreshStats: fetchGovernanceStats
  }
}
