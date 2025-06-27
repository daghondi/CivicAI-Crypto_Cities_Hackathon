'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { useSmartContracts } from '@/hooks/useSmartContracts'
import { Proposal } from '@/types'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  PauseCircle, 
  RefreshCw,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react'

interface ProposalLifecycleProps {
  proposal: Proposal
  onProposalUpdate?: () => void
}

type ProposalPhase = 
  | 'draft'
  | 'voting'
  | 'counting'
  | 'passed'
  | 'failed'
  | 'executed'
  | 'cancelled'
  | 'expired'

export default function ProposalLifecycle({ 
  proposal, 
  onProposalUpdate 
}: ProposalLifecycleProps) {
  const { address, isConnected } = useWeb3()
  const { executeProposal, cancelProposal, getProposalState, loading } = useSmartContracts()
  
  const [currentPhase, setCurrentPhase] = useState<ProposalPhase>('draft')
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [canExecute, setCanExecute] = useState(false)
  const [canCancel, setCanCancel] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Determine current proposal phase
  useEffect(() => {
    determineProposalPhase()
    updateTimeLeft()
    
    const interval = setInterval(updateTimeLeft, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [proposal])

  // Check permissions
  useEffect(() => {
    if (address && proposal) {
      checkPermissions()
    }
  }, [address, proposal, currentPhase])

  const determineProposalPhase = () => {
    const now = new Date()
    const deadline = new Date(proposal.voting_deadline)
    const totalVotes = (proposal.votes_for || 0) + (proposal.votes_against || 0) + (proposal.votes_abstain || 0)
    
    if (proposal.status === 'draft') {
      setCurrentPhase('draft')
    } else if (proposal.status === 'implemented') {
      setCurrentPhase('executed')
    } else if (now < deadline && proposal.status === 'active') {
      setCurrentPhase('voting')
    } else if (now >= deadline) {
      if (proposal.status === 'passed') {
        setCurrentPhase('passed')
      } else if (proposal.status === 'failed') {
        setCurrentPhase('failed')
      } else {
        // Need to count votes
        const forVotes = proposal.votes_for || 0
        const againstVotes = proposal.votes_against || 0
        const quorumMet = totalVotes >= 10 // Minimum quorum
        
        if (quorumMet && forVotes > againstVotes) {
          setCurrentPhase('passed')
        } else {
          setCurrentPhase('failed')
        }
      }
    } else {
      setCurrentPhase('voting')
    }
  }

  const updateTimeLeft = () => {
    const now = new Date()
    const deadline = new Date(proposal.voting_deadline)
    const timeDiff = deadline.getTime() - now.getTime()
    
    if (timeDiff <= 0) {
      setTimeLeft('Voting ended')
    } else {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`)
      } else {
        setTimeLeft(`${minutes}m left`)
      }
    }
  }

  const checkPermissions = () => {
    // Can execute if proposal passed and user is creator or admin
    setCanExecute(
      currentPhase === 'passed' && 
      (proposal.creator_address?.toLowerCase() === address?.toLowerCase())
    )
    
    // Can cancel if still voting and user is creator
    setCanCancel(
      (currentPhase === 'voting' || currentPhase === 'draft') &&
      (proposal.creator_address?.toLowerCase() === address?.toLowerCase())
    )
  }

  const handleExecuteProposal = async () => {
    if (!proposal.on_chain_id) {
      setError('This proposal is not on-chain and cannot be executed')
      return
    }

    setIsProcessing(true)
    setError('')
    setSuccess('')

    try {
      const result = await executeProposal(parseInt(proposal.on_chain_id))
      
      if (result.success) {
        setSuccess('Proposal executed successfully!')
        setCurrentPhase('executed')
        onProposalUpdate?.()
      } else {
        setError(result.error || 'Failed to execute proposal')
      }
    } catch (err: any) {
      setError(err.message || 'Execution failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelProposal = async () => {
    if (!proposal.on_chain_id) {
      setError('This proposal is not on-chain and cannot be cancelled')
      return
    }

    setIsProcessing(true)
    setError('')
    setSuccess('')

    try {
      const result = await cancelProposal(parseInt(proposal.on_chain_id))
      
      if (result.success) {
        setSuccess('Proposal cancelled successfully!')
        setCurrentPhase('cancelled')
        onProposalUpdate?.()
      } else {
        setError(result.error || 'Failed to cancel proposal')
      }
    } catch (err: any) {
      setError(err.message || 'Cancellation failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPhaseIcon = (phase: ProposalPhase) => {
    switch (phase) {
      case 'draft': return <PauseCircle className="w-5 h-5" />
      case 'voting': return <PlayCircle className="w-5 h-5" />
      case 'counting': return <RefreshCw className="w-5 h-5" />
      case 'passed': return <CheckCircle className="w-5 h-5" />
      case 'failed': return <XCircle className="w-5 h-5" />
      case 'executed': return <CheckCircle className="w-5 h-5" />
      case 'cancelled': return <XCircle className="w-5 h-5" />
      case 'expired': return <AlertTriangle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getPhaseColor = (phase: ProposalPhase) => {
    switch (phase) {
      case 'draft': return 'text-gray-600 bg-gray-100'
      case 'voting': return 'text-blue-600 bg-blue-100'
      case 'counting': return 'text-yellow-600 bg-yellow-100'
      case 'passed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'executed': return 'text-purple-600 bg-purple-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      case 'expired': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPhaseDescription = (phase: ProposalPhase) => {
    switch (phase) {
      case 'draft': return 'Proposal is being prepared'
      case 'voting': return 'Community voting is active'
      case 'counting': return 'Votes are being counted'
      case 'passed': return 'Proposal has passed, awaiting execution'
      case 'failed': return 'Proposal did not pass'
      case 'executed': return 'Proposal has been successfully implemented'
      case 'cancelled': return 'Proposal was cancelled'
      case 'expired': return 'Proposal voting period has expired'
      default: return 'Unknown status'
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Lifecycle</h3>
      
      {/* Current Phase */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-full ${getPhaseColor(currentPhase)}`}>
            {getPhaseIcon(currentPhase)}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 capitalize">{currentPhase}</h4>
            <p className="text-sm text-gray-600">{getPhaseDescription(currentPhase)}</p>
          </div>
        </div>
        
        {currentPhase === 'voting' && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
            <Clock className="w-4 h-4" />
            <span>{timeLeft}</span>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="mb-6">
        <h5 className="font-medium text-gray-900 mb-3">Progress Timeline</h5>
        <div className="space-y-3">
          {(['draft', 'voting', 'passed', 'executed'] as ProposalPhase[]).map((phase, index) => {
            const isCompleted = 
              (phase === 'draft' && currentPhase !== 'draft') ||
              (phase === 'voting' && ['passed', 'failed', 'executed', 'cancelled'].includes(currentPhase)) ||
              (phase === 'passed' && ['executed'].includes(currentPhase)) ||
              (phase === 'executed' && currentPhase === 'executed')
            
            const isCurrent = phase === currentPhase
            
            return (
              <div key={phase} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  isCompleted ? 'bg-green-500 border-green-500' :
                  isCurrent ? 'bg-blue-500 border-blue-500' :
                  'bg-gray-200 border-gray-300'
                }`} />
                <span className={`text-sm capitalize ${
                  isCompleted || isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {phase}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <div className="text-lg font-semibold text-gray-900">{proposal.total_votes || 0}</div>
          <div className="text-xs text-gray-600">Total Votes</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <div className="text-lg font-semibold text-gray-900">{proposal.impact_score}</div>
          <div className="text-xs text-gray-600">Impact Score</div>
        </div>
      </div>

      {/* Actions */}
      {isConnected && (canExecute || canCancel) && (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-2">Available Actions:</div>
          
          {canExecute && (
            <Button
              onClick={handleExecuteProposal}
              disabled={isProcessing || loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Executing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Execute Proposal</span>
                </div>
              )}
            </Button>
          )}
          
          {canCancel && (              <Button
                onClick={handleCancelProposal}
                disabled={isProcessing || loading}
                variant="secondary"
                className="w-full bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
              >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Cancelling...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Proposal</span>
                </div>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Created: {new Date(proposal.created_at).toLocaleDateString()}</div>
          <div>Voting Deadline: {new Date(proposal.voting_deadline).toLocaleDateString()}</div>
          {proposal.on_chain_id && (
            <div>On-Chain ID: #{proposal.on_chain_id}</div>
          )}
        </div>
      </div>
    </Card>
  )
}
