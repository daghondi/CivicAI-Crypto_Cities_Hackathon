import { useState, useEffect } from 'react'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { signVoteMessage } from '@/lib/thirdweb'

interface Vote {
  id: string
  proposal_id: string
  wallet_address: string
  vote_type: 'for' | 'against' | 'abstain'
  reasoning?: string
  signature: string
  timestamp: number
  created_at: string
}

interface VoteStats {
  total_votes: number
  for_votes: number
  against_votes: number
  abstain_votes: number
  support_percentage: number
}

interface UseVotingOptions {
  proposalId: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export const useVoting = ({ proposalId, autoRefresh = true, refreshInterval = 30000 }: UseVotingOptions) => {
  const { address, signer, isConnected } = useWeb3()
  const [votes, setVotes] = useState<Vote[]>([])
  const [stats, setStats] = useState<VoteStats>({
    total_votes: 0,
    for_votes: 0,
    against_votes: 0,
    abstain_votes: 0,
    support_percentage: 0
  })
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch votes for proposal
  const fetchVotes = async () => {
    if (!proposalId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/votes?proposal_id=${proposalId}`)
      const data = await response.json()

      if (response.ok) {
        setVotes(data.votes || [])
        setStats(data.stats || {
          total_votes: 0,
          for_votes: 0,
          against_votes: 0,
          abstain_votes: 0,
          support_percentage: 0
        })
      } else {
        throw new Error(data.error || 'Failed to fetch votes')
      }
    } catch (err: any) {
      console.error('Error fetching votes:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Check if current user has voted
  const checkUserVote = async () => {
    if (!address || !proposalId) return

    try {
      const response = await fetch(`/api/votes?proposal_id=${proposalId}&wallet_address=${address}`)
      const data = await response.json()

      if (response.ok) {
        setHasVoted(data.hasVoted)
        setUserVote(data.vote || null)
      }
    } catch (err) {
      console.error('Error checking user vote:', err)
    }
  }

  // Submit a new vote
  const submitVote = async (
    voteType: 'for' | 'against' | 'abstain',
    reasoning?: string
  ): Promise<boolean> => {
    if (!isConnected || !signer || !address) {
      setError('Please connect your wallet to vote')
      return false
    }

    if (hasVoted) {
      setError('You have already voted on this proposal')
      return false
    }

    setSubmitting(true)
    setError(null)

    try {
      // Sign the vote message
      const { signature, timestamp } = await signVoteMessage(
        signer,
        proposalId,
        voteType,
        reasoning || ''
      )

      // Submit the signed vote
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal_id: proposalId,
          wallet_address: address,
          vote_type: voteType,
          reasoning,
          signature,
          timestamp
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote')
      }

      // Update local state
      setHasVoted(true)
      setUserVote(data.vote)
      
      // Refresh votes
      await fetchVotes()
      
      return true

    } catch (err: any) {
      console.error('Vote submission error:', err)
      setError(err.message || 'Failed to submit vote')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate voting progress
  const getVotingProgress = () => {
    const total = stats.total_votes
    if (total === 0) return { for: 0, against: 0, abstain: 0 }

    return {
      for: Math.round((stats.for_votes / total) * 100),
      against: Math.round((stats.against_votes / total) * 100),
      abstain: Math.round((stats.abstain_votes / total) * 100)
    }
  }

  // Get vote outcome prediction
  const getOutcome = (): 'passing' | 'failing' | 'tied' | 'unknown' => {
    if (stats.total_votes === 0) return 'unknown'
    
    const forVotes = stats.for_votes
    const againstVotes = stats.against_votes
    
    if (forVotes > againstVotes) return 'passing'
    if (againstVotes > forVotes) return 'failing'
    return 'tied'
  }

  // Get quorum status (assuming 10% participation needed)
  const getQuorumStatus = (totalEligibleVoters = 1000) => {
    const participation = (stats.total_votes / totalEligibleVoters) * 100
    const hasQuorum = participation >= 10 // 10% quorum threshold
    
    return {
      participation: Math.round(participation),
      hasQuorum,
      needed: Math.max(0, Math.ceil(totalEligibleVoters * 0.1) - stats.total_votes)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchVotes()
    if (address) {
      checkUserVote()
    }
  }, [proposalId, address])

  // Auto-refresh votes
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchVotes()
      if (address) {
        checkUserVote()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [proposalId, address, autoRefresh, refreshInterval])

  return {
    // Data
    votes,
    stats,
    userVote,
    hasVoted,
    
    // State
    loading,
    submitting,
    error,
    
    // Actions
    submitVote,
    refreshVotes: fetchVotes,
    
    // Computed values
    progress: getVotingProgress(),
    outcome: getOutcome(),
    quorum: getQuorumStatus(),
    
    // Utilities
    canVote: isConnected && !hasVoted,
    isEligible: isConnected
  }
}
