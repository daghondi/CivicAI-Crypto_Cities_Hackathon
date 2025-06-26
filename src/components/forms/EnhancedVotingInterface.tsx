'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { useSmartContracts } from '@/hooks/useSmartContracts'
import { signVoteMessage } from '@/lib/thirdweb'
import { Proposal } from '@/types'
import { ThumbsUp, ThumbsDown, Minus, Lock, Coins, Zap } from 'lucide-react'

interface EnhancedVotingInterfaceProps {
  proposal: Proposal
  onVoteSubmitted?: () => void
}

type VoteType = 'for' | 'against' | 'abstain'
type VotingMode = 'signature' | 'contract'

export default function EnhancedVotingInterface({ 
  proposal, 
  onVoteSubmitted 
}: EnhancedVotingInterfaceProps) {
  const { address, signer, isConnected } = useWeb3()
  const { castVote, hasUserVoted, iccBalance, loading } = useSmartContracts()
  
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null)
  const [reasoning, setReasoning] = useState('')
  const [votingMode, setVotingMode] = useState<VotingMode>('signature')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [userVote, setUserVote] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isOnChainProposal = proposal.on_chain_id && proposal.on_chain_id !== null
  const hasEnoughICC = parseFloat(iccBalance) >= 1 // Minimum 1 I₵C for voting

  // Check if user has already voted
  useEffect(() => {
    if (address && proposal.id) {
      checkUserVote()
    }
  }, [address, proposal.id])

  const checkUserVote = async () => {
    if (!address) return

    try {
      // Check database vote
      const response = await fetch(`/api/votes?proposal_id=${proposal.id}&wallet_address=${address}`)
      const data = await response.json()
      
      if (data.hasVoted) {
        setHasVoted(true)
        setUserVote(data.vote)
        return
      }

      // Check on-chain vote if it's an on-chain proposal
      if (isOnChainProposal && proposal.on_chain_id) {
        const onChainVoted = await hasUserVoted(parseInt(proposal.on_chain_id))
        if (onChainVoted) {
          setHasVoted(true)
          setUserVote({ vote_type: 'on-chain', created_at: 'On blockchain' })
        }
      }
    } catch (error) {
      console.error('Error checking vote status:', error)
    }
  }

  const handleVoteSubmit = async () => {
    if (!selectedVote || !address || !signer) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (votingMode === 'contract' && isOnChainProposal) {
        await submitOnChainVote()
      } else {
        await submitSignatureVote()
      }

      setSuccess('Vote submitted successfully!')
      setHasVoted(true)
      onVoteSubmitted?.()
    } catch (err: any) {
      setError(err.message || 'Failed to submit vote')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitOnChainVote = async () => {
    if (!proposal.on_chain_id) throw new Error('No on-chain proposal ID')

    const voteTypeMapping = { 'against': 0, 'for': 1, 'abstain': 2 } as const
    const result = await castVote(
      parseInt(proposal.on_chain_id), 
      voteTypeMapping[selectedVote!]
    )

    if (!result.success) {
      throw new Error(result.error || 'On-chain vote failed')
    }

    // Also save to database for analytics
    await saveVoteToDatabase(true, result.transactionHash)
  }

  const submitSignatureVote = async () => {
    if (!signer) throw new Error('No signer available')
    
    // Sign the vote message
    const result = await signVoteMessage(
      signer, 
      proposal.id, 
      selectedVote!, 
      reasoning.trim()
    )
    
    await saveVoteToDatabase(false, result.messageHash, result.signature)
  }

  const saveVoteToDatabase = async (isOnChain = false, txHash?: string, signature?: string) => {
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        proposal_id: proposal.id,
        wallet_address: address,
        vote_type: selectedVote,
        reasoning: reasoning.trim(),
        signature: signature || '',
        message_hash: txHash || '',
        timestamp: Date.now(),
        is_on_chain: isOnChain,
        transaction_hash: txHash
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to save vote')
    }

    return response.json()
  }

  const getVoteIcon = (voteType: VoteType) => {
    switch (voteType) {
      case 'for': return <ThumbsUp className="w-5 h-5" />
      case 'against': return <ThumbsDown className="w-5 h-5" />
      case 'abstain': return <Minus className="w-5 h-5" />
    }
  }

  const getVoteColor = (voteType: VoteType) => {
    switch (voteType) {
      case 'for': return 'text-green-600 border-green-500 bg-green-50'
      case 'against': return 'text-red-600 border-red-500 bg-red-50'
      case 'abstain': return 'text-gray-600 border-gray-500 bg-gray-50'
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Wallet to Vote</h3>
          <p className="text-gray-600 mb-4">
            Connect your wallet to participate in governance voting
          </p>
        </div>
      </Card>
    )
  }

  if (hasVoted) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vote Recorded</h3>
          <p className="text-gray-600 mb-4">
            You have already voted on this proposal
          </p>
          {userVote && (
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="success">
                {userVote.vote_type === 'on-chain' ? 'On-Chain Vote' : userVote.vote_type}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(userVote.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cast Your Vote</h3>

      {/* Voting Mode Selection */}
      {isOnChainProposal && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Voting Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label 
              htmlFor="signature-vote"
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                votingMode === 'signature' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="signature-vote"
                  name="voting-mode"
                  checked={votingMode === 'signature'}
                  onChange={() => setVotingMode('signature')}
                  className="text-blue-600"
                />
                <Zap className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Quick Vote</div>
                  <div className="text-xs text-gray-600">Cryptographic signature</div>
                </div>
              </div>
            </label>

            <label 
              htmlFor="contract-vote"
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                votingMode === 'contract' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
              } ${!hasEnoughICC ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="contract-vote"
                  name="voting-mode"
                  checked={votingMode === 'contract'}
                  onChange={() => setVotingMode('contract')}
                  disabled={!hasEnoughICC}
                  className="text-purple-600"
                />
                <Coins className="w-4 h-4 text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium text-sm">On-Chain Vote</div>
                  <div className="text-xs text-gray-600">Permanent & earns rewards</div>
                </div>
                <div className="text-xs text-gray-500">
                  {hasEnoughICC ? '1 I₵C' : `Need ${1 - parseFloat(iccBalance)} I₵C`}
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Vote Options */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Your Vote</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['for', 'against', 'abstain'] as VoteType[]).map((voteType) => (
            <button
              key={voteType}
              onClick={() => setSelectedVote(voteType)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedVote === voteType 
                  ? getVoteColor(voteType)
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {getVoteIcon(voteType)}
                <span className="font-medium capitalize">{voteType}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-6">
        <label htmlFor="vote-reasoning" className="block font-medium text-gray-900 mb-2">
          Reasoning (Optional)
        </label>
        <textarea
          id="vote-reasoning"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Share your thoughts on this proposal..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1">
          {reasoning.length}/500 characters
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleVoteSubmit}
        disabled={!selectedVote || isSubmitting || loading}
        className="w-full"
        size="lg"
      >
        {isSubmitting || loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>
              {votingMode === 'contract' ? 'Submitting On-Chain...' : 'Signing Vote...'}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {getVoteIcon(selectedVote || 'for')}
            <span>
              {votingMode === 'contract' ? 'Vote On-Chain' : 'Submit Vote'}
            </span>
          </div>
        )}
      </Button>

      {/* Vote Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <div className="flex items-center justify-between mb-1">
            <span>Your I₵C Balance:</span>
            <Badge variant="secondary">{iccBalance} I₵C</Badge>
          </div>
          {votingMode === 'contract' && (
            <div className="flex items-center justify-between">
              <span>Voting Reward:</span>
              <Badge variant="success">+10 I₵C</Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
