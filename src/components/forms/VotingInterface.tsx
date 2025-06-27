'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { signVoteMessage, hasUserVoted } from '@/lib/thirdweb'
import { Proposal } from '@/types'

interface VotingInterfaceProps {
  proposal: Proposal
  onVoteSubmitted?: () => void
}

type VoteType = 'for' | 'against' | 'abstain'

export default function VotingInterface({ proposal, onVoteSubmitted }: VotingInterfaceProps) {
  const { address, signer, isConnected, connect } = useWeb3()
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null)
  const [reasoning, setReasoning] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [userVote, setUserVote] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Check if user has already voted
  useEffect(() => {
    if (address && proposal.id) {
      checkUserVote()
    }
  }, [address, proposal.id])

  const checkUserVote = async () => {
    if (!address) return

    try {
      const response = await fetch(`/api/votes?proposal_id=${proposal.id}&wallet_address=${address}`)
      const data = await response.json()
      
      if (data.hasVoted) {
        setHasVoted(true)
        setUserVote(data.vote)
      }
    } catch (error) {
      console.error('Error checking vote status:', error)
    }
  }

  const handleVoteSubmit = async () => {
    if (!isConnected || !signer || !address || !selectedVote) {
      setError('Please connect your wallet and select a vote option')
      return
    }

    if (hasVoted) {
      setError('You have already voted on this proposal')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Sign the vote message
      const { signature, timestamp } = await signVoteMessage(
        signer,
        proposal.id,
        selectedVote,
        reasoning
      )

      // Submit the signed vote
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal_id: proposal.id,
          wallet_address: address,
          vote_type: selectedVote,
          reasoning,
          signature,
          timestamp
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote')
      }

      setSuccess('Vote submitted successfully!')
      setHasVoted(true)
      setUserVote(data.vote)
      
      // Reset form
      setSelectedVote(null)
      setReasoning('')
      
      // Trigger parent component refresh
      if (onVoteSubmitted) {
        onVoteSubmitted()
      }

    } catch (error: any) {
      console.error('Vote submission error:', error)
      setError(error.message || 'Failed to submit vote')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVoteIcon = (voteType: VoteType) => {
    switch (voteType) {
      case 'for':
        return '👍'
      case 'against':
        return '👎'
      case 'abstain':
        return '🤷‍♂️'
    }
  }

  const getVoteColor = (voteType: VoteType) => {
    switch (voteType) {
      case 'for':
        return 'border-logo-electric bg-logo-electric/10 text-logo-electric'
      case 'against':
        return 'border-red-400 bg-red-400/10 text-red-400'
      case 'abstain':
        return 'border-logo-dark bg-logo-dark/10 text-text-primary'
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Cast Your Vote</h3>
        <div className="text-center">
          <p className="text-text-secondary mb-4">Connect your wallet to participate in voting</p>
          <Button onClick={connect}>
            Connect Wallet
          </Button>
        </div>
      </Card>
    )
  }

  if (hasVoted && userVote) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Your Vote</h3>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">{getVoteIcon(userVote.vote_type)}</span>
          <span className="font-medium capitalize text-text-primary">{userVote.vote_type}</span>
        </div>
        {userVote.reasoning && (
          <div className="bg-dark-surface/30 p-3 rounded-lg border border-logo-dark/20 backdrop-blur-sm">
            <p className="text-sm text-text-secondary mb-1">Your reasoning:</p>
            <p className="text-text-primary">{userVote.reasoning}</p>
          </div>
        )}
        <p className="text-sm text-text-secondary mt-4">
          Voted on {new Date(userVote.created_at).toLocaleDateString()}
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-text-primary">Cast Your Vote</h3>
      
      {/* Wallet Info */}
      <div className="bg-logo-electric/10 border border-logo-electric/30 p-3 rounded-lg mb-4 backdrop-blur-sm">
        <p className="text-sm text-logo-electric">
          Voting as: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'}
        </p>
      </div>

      {/* Vote Options */}
      <div className="space-y-3 mb-4">
        {(['for', 'against', 'abstain'] as VoteType[]).map((voteType) => (
          <button
            key={voteType}
            onClick={() => setSelectedVote(voteType)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
              selectedVote === voteType
                ? getVoteColor(voteType)
                : 'border-logo-dark/20 hover:border-logo-dark/40 bg-dark-surface/30 backdrop-blur-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getVoteIcon(voteType)}</span>
              <div>
                <div className={`font-medium capitalize ${selectedVote === voteType ? '' : 'text-text-primary'}`}>{voteType}</div>
                <div className={`text-sm ${selectedVote === voteType ? '' : 'text-text-secondary'}`}>
                  {voteType === 'for' && 'Support this proposal'}
                  {voteType === 'against' && 'Oppose this proposal'}
                  {voteType === 'abstain' && 'Neither support nor oppose'}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <label htmlFor="reasoning" className="block text-sm font-medium text-text-primary mb-2">
          Reasoning (optional)
        </label>
        <textarea
          id="reasoning"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Why are you voting this way? (optional)"
          className="w-full p-3 bg-dark-surface/30 border border-logo-dark/20 rounded-lg 
                   focus:ring-2 focus:ring-logo-electric/50 focus:border-logo-electric 
                   text-text-primary placeholder-text-secondary backdrop-blur-sm resize-none"
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-text-secondary mt-1">{reasoning.length}/500 characters</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 backdrop-blur-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-logo-electric/10 border border-logo-electric/30 text-logo-electric px-4 py-3 rounded-lg mb-4 backdrop-blur-sm">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleVoteSubmit}
        disabled={!selectedVote || isSubmitting}
        variant={selectedVote ? "primary" : "secondary"}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Signing & Submitting Vote...
          </>
        ) : (
          'Submit Signed Vote'
        )}
      </Button>

      {/* Voting Info */}
      <div className="mt-4 p-3 bg-dark-surface/30 border border-logo-dark/20 rounded-lg backdrop-blur-sm">
        <p className="text-xs text-text-secondary">
          🔒 Your vote will be cryptographically signed with your wallet to ensure authenticity.
          One vote per wallet address is allowed per proposal.
        </p>
      </div>
    </Card>
  )
}
