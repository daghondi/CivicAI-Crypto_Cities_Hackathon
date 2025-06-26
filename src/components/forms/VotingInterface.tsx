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
        return 'border-green-500 bg-green-50 text-green-700'
      case 'against':
        return 'border-red-500 bg-red-50 text-red-700'
      case 'abstain':
        return 'border-gray-500 bg-gray-50 text-gray-700'
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Connect your wallet to participate in voting</p>
          <Button onClick={connect} className="bg-blue-600 hover:bg-blue-700">
            Connect Wallet
          </Button>
        </div>
      </Card>
    )
  }

  if (hasVoted && userVote) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Vote</h3>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">{getVoteIcon(userVote.vote_type)}</span>
          <span className="font-medium capitalize">{userVote.vote_type}</span>
        </div>
        {userVote.reasoning && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Your reasoning:</p>
            <p className="text-gray-800">{userVote.reasoning}</p>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-4">
          Voted on {new Date(userVote.created_at).toLocaleDateString()}
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
      
      {/* Wallet Info */}
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-blue-600">
          Voting as: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'}
        </p>
      </div>

      {/* Vote Options */}
      <div className="space-y-3 mb-4">
        {(['for', 'against', 'abstain'] as VoteType[]).map((voteType) => (
          <button
            key={voteType}
            onClick={() => setSelectedVote(voteType)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
              selectedVote === voteType
                ? getVoteColor(voteType)
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getVoteIcon(voteType)}</span>
              <div>
                <div className="font-medium capitalize">{voteType}</div>
                <div className="text-sm text-gray-600">
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
        <label htmlFor="reasoning" className="block text-sm font-medium text-gray-700 mb-2">
          Reasoning (optional)
        </label>
        <textarea
          id="reasoning"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Why are you voting this way? (optional)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{reasoning.length}/500 characters</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleVoteSubmit}
        disabled={!selectedVote || isSubmitting}
        className={`w-full ${
          selectedVote 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-300 cursor-not-allowed'
        }`}
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
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          🔒 Your vote will be cryptographically signed with your wallet to ensure authenticity.
          One vote per wallet address is allowed per proposal.
        </p>
      </div>
    </Card>
  )
}
