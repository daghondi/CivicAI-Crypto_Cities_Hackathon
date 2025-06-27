import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import Link from 'next/link'
import type { Proposal } from '@/types'

interface ProposalCardProps {
  proposal: Proposal
  onVote?: (proposalId: string, voteType: 'for' | 'against') => void
  showVoting?: boolean
}

export default function ProposalCard({ proposal, onVote, showVoting = true }: ProposalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'voting': 
      case 'active': return 'bg-logo-electric/20 text-logo-electric border-logo-electric/30'
      case 'approved': return 'bg-logo-mint/20 text-logo-mint border-logo-mint/30'
      case 'rejected': return 'bg-red-400/20 text-red-400 border-red-400/30'
      case 'implemented': return 'bg-logo-orange/20 text-logo-orange border-logo-orange/30'
      case 'draft': return 'bg-logo-dark/20 text-text-primary border-logo-dark/30'
      default: return 'bg-logo-dark/20 text-text-primary border-logo-dark/30'
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      infrastructure: '🏗️',
      environment: '🌱',
      transportation: '🚗',
      healthcare: '🏥',
      education: '📚',
      safety: '🛡️',
      technology: '💻',
      governance: '🏛️',
      economy: '💰',
      housing: '🏠'
    }
    return icons[category] || '📋'
  }

  const supportPercentage = (proposal.total_votes || 0) > 0 
    ? Math.round(((proposal.votes_for || 0) / (proposal.total_votes || 1)) * 100)
    : 0

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(proposal.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-text-primary line-clamp-2">
              {proposal.title}
            </h3>
            <p className="text-sm text-text-secondary capitalize">
              {proposal.category}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(proposal.status)}>
          {proposal.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <p className="text-text-secondary mb-4 line-clamp-3">
        {proposal.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="text-center">
          <div className="font-bold text-lg text-logo-electric">
            {proposal.impact_score}/100
          </div>
          <div className="text-text-secondary">Impact</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-logo-mint">
            {proposal.ai_analysis?.feasibility_score || 'N/A'}
          </div>
          <div className="text-text-secondary">Feasibility</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-logo-orange">
            ${proposal.ai_analysis?.cost_estimate?.toLocaleString() || 'TBD'}
          </div>
          <div className="text-text-secondary">Cost</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-logo-electric">
            {proposal.total_votes || 0}
          </div>
          <div className="text-text-secondary">Votes</div>
        </div>
      </div>

      {/* Voting Progress */}
      {proposal.status === 'active' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-text-secondary mb-1">
            <span>Support: {supportPercentage}%</span>
            <span>{proposal.total_votes || 0} total votes</span>
          </div>
          <Progress 
            value={supportPercentage} 
            variant="success" 
            size="sm"
            className="h-2"
          />
        </div>
      )}

      {/* Voting Ends */}
      {proposal.voting_deadline && proposal.status === 'active' && (
        <div className="text-sm text-text-secondary mb-4">
          Voting ends: {new Date(proposal.voting_deadline).toLocaleDateString()}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {showVoting && proposal.status === 'active' && onVote && (
          <>
            <Button
              size="sm"
              onClick={() => onVote(proposal.id, 'for')}
              className="flex-1"
            >
              👍 Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVote(proposal.id, 'against')}
              className="flex-1"
            >
              👎 Oppose
            </Button>
          </>
        )}
        <Button variant="secondary" size="sm">
          <Link href={`/proposals/${proposal.id}`}>
            View Details
          </Link>
        </Button>
      </div>

      {/* ICC Incentive Badge */}
      {proposal.ai_analysis && (
        <div className="mt-3 pt-3 border-t border-logo-dark/20">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-logo-orange/20 text-logo-orange border border-logo-orange/30">
            💰 I₵C Eligible
          </div>
        </div>
      )}
    </Card>
  )
}