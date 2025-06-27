'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useWeb3 } from '@/components/providers/Web3Provider'
import EnhancedVotingInterface from '@/components/forms/EnhancedVotingInterface'
import { ProposalDetails } from '@/components/proposals/ProposalDetails'
import ProposalLifecycle from '@/components/proposals/ProposalLifecycle'
import UserBadge from '@/components/wallet/UserBadge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Vote, Clock, Users, TrendingUp } from 'lucide-react'
import { formatDate, getVotePercentage, getProposalStatus } from '@/lib/utils'
import { Proposal } from '@/types'

export default function VotePage() {
  const params = useParams()
  const router = useRouter()
  const { isConnected, address } = useWeb3()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasVoted, setHasVoted] = useState(false)
  const [userVote, setUserVote] = useState<string | null>(null)

  const proposalId = params.id as string

  useEffect(() => {
    if (proposalId) {
      fetchProposal()
      if (isConnected && address) {
        checkVoteStatus()
      }
    }
  }, [proposalId, isConnected, address])

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`)
      if (response.ok) {
        const data = await response.json()
        setProposal(data.proposal)
      } else {
        console.error('Failed to fetch proposal')
      }
    } catch (error) {
      console.error('Error fetching proposal:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkVoteStatus = async () => {
    try {
      const response = await fetch(`/api/votes?proposal_id=${proposalId}`)
      if (response.ok) {
        const data = await response.json()
        const userVoteRecord = data.votes?.find(
          (vote: any) => vote.wallet_address?.toLowerCase() === address?.toLowerCase()
        )
        if (userVoteRecord) {
          setHasVoted(true)
          setUserVote(userVoteRecord.vote_type)
        }
      }
    } catch (error) {
      console.error('Error checking vote status:', error)
    }
  }

  const handleVoteSuccess = () => {
    setHasVoted(true)
    fetchProposal() // Refresh proposal data
    checkVoteStatus() // Refresh vote status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-10 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-logo-primary relative z-10"></div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-10 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>
        
        <Card className="p-8 text-center max-w-md bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm relative z-10">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Proposal Not Found</h2>
          <p className="text-text-secondary mb-6">
            The proposal you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/proposals')} className="bg-gradient-to-r from-logo-primary to-logo-accent hover:from-logo-primary/80 hover:to-logo-accent/80">
            View All Proposals
          </Button>
        </Card>
      </div>
    )
  }

  const status = getProposalStatus(
    proposal.votes_for || 0,
    proposal.votes_against || 0,
    proposal.votes_abstain || 0,
    proposal.voting_deadline
  )

  const forPercentage = getVotePercentage(proposal.votes_for || 0, proposal.total_votes || 0)
  const againstPercentage = getVotePercentage(proposal.votes_against || 0, proposal.total_votes || 0)
  const abstainPercentage = getVotePercentage(proposal.votes_abstain || 0, proposal.total_votes || 0)

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-5 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-logo-secondary opacity-5 rounded-full blur-3xl animate-float delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="mb-4 bg-dark-elevated border-logo-primary/30 text-text-primary hover:bg-logo-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-logo-secondary to-accent-orange rounded-full flex items-center justify-center">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent">Cast Your Vote</h1>
              <p className="text-text-secondary">
                Participate in democratic decision-making for your community
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Voting Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Overview Card */}
            <Card className="p-6 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="capitalize bg-logo-secondary/20 text-logo-secondary border border-logo-secondary/30">
                    {proposal.category}
                  </Badge>
                  <Badge className={`${
                    status === 'active' ? 'bg-gradient-to-r from-logo-primary/20 to-logo-accent/20 text-logo-primary border border-logo-primary/30' :
                    status === 'passed' ? 'bg-gradient-to-r from-logo-accent/20 to-logo-accent/20 text-logo-accent border border-logo-accent/30' :
                    status === 'failed' ? 'bg-gradient-to-r from-red-400/20 to-red-400/20 text-red-400 border border-red-400/30' :
                    'bg-dark-elevated text-text-secondary border border-gray-600'
                  }`}>
                    {status}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{proposal.title}</h2>
                <p className="text-text-secondary leading-relaxed">{proposal.description}</p>
              </div>

              {/* Proposal Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-logo-primary/20">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="w-4 h-4 text-logo-accent" />
                  Deadline: {formatDate(proposal.voting_deadline)}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Users className="w-4 h-4 text-logo-primary" />
                  Total Votes: {proposal.total_votes}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <TrendingUp className="w-4 h-4 text-accent-orange" />
                  Support: {forPercentage}%
                </div>
              </div>
            </Card>

            {/* Voting Interface */}
            {isConnected ? (
              <Card className="p-6 bg-dark-elevated border border-logo-accent/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-text-primary mb-4">Cast Your Vote</h3>
                {hasVoted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-logo-accent/20 to-logo-accent/20 border border-logo-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Vote className="w-8 h-8 text-logo-accent" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      You've Already Voted
                    </h4>
                    <p className="text-text-secondary mb-4">
                      Your vote: <span className="font-medium capitalize text-logo-accent">{userVote}</span>
                    </p>
                    <p className="text-sm text-text-muted">
                      You can only vote once per proposal. Thank you for participating!
                    </p>
                  </div>
                ) : status === 'active' ? (
                  <EnhancedVotingInterface
                    proposal={proposal}
                    onVoteSubmitted={handleVoteSuccess}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-dark-surface border border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-text-muted" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      Voting Period Ended
                    </h4>
                    <p className="text-text-secondary">
                      This proposal is no longer accepting votes.
                    </p>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-6 text-center bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-logo-primary/20 to-logo-accent/20 border border-logo-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="w-8 h-8 text-logo-primary" />
                </div>
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  Connect Wallet to Vote
                </h4>
                <p className="text-text-secondary mb-4">
                  You need to connect your wallet to participate in governance.
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vote Results */}
            <Card className="p-6 bg-dark-elevated border border-logo-secondary/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Current Results</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-logo-accent">For</span>
                    <span className="text-sm text-text-secondary">{proposal.votes_for} ({forPercentage}%)</span>
                  </div>
                  <div className="w-full bg-dark-bg/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-logo-accent to-logo-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${forPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-red-400">Against</span>
                    <span className="text-sm text-text-secondary">{proposal.votes_against} ({againstPercentage}%)</span>
                  </div>
                  <div className="w-full bg-dark-bg/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${againstPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text-muted">Abstain</span>
                    <span className="text-sm text-text-secondary">{proposal.votes_abstain} ({abstainPercentage}%)</span>
                  </div>
                  <div className="w-full bg-dark-bg/50 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${abstainPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Proposal Creator */}
            <Card className="p-6 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Proposal Creator</h3>
              <UserBadge address={proposal.creator_address} />
            </Card>

            {/* Proposal Lifecycle */}
            <ProposalLifecycle 
              proposal={proposal} 
              onProposalUpdate={fetchProposal}
            />

            {/* Voting Info */}
            <Card className="p-6 bg-gradient-to-r from-logo-primary/10 to-logo-accent/10 border border-logo-primary/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-3">How Voting Works</h3>
              <div className="text-sm text-text-secondary space-y-2">
                <p>• Each wallet can vote once per proposal</p>
                <p>• Votes are cryptographically signed for security</p>
                <p>• Results are updated in real-time</p>
                <p>• Voting ends at the specified deadline</p>
                <p>• Your vote is recorded permanently</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
