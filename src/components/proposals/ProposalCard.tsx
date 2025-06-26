import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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
      case 'voting': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'implemented': return 'bg-purple-100 text-purple-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {proposal.title}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {proposal.category}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(proposal.status)}>
          {proposal.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {proposal.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="text-center">
          <div className="font-bold text-lg text-primary-600">
            {proposal.impact_score}/100
          </div>
          <div className="text-gray-500">Impact</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-green-600">
            {proposal.ai_analysis?.feasibility_score || 'N/A'}
          </div>
          <div className="text-gray-500">Feasibility</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-orange-600">
            ${proposal.ai_analysis?.cost_estimate?.toLocaleString() || 'TBD'}
          </div>
          <div className="text-gray-500">Cost</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-blue-600">
            {proposal.total_votes || 0}
          </div>
          <div className="text-gray-500">Votes</div>
        </div>
      </div>

      {/* Voting Progress */}
      {proposal.status === 'active' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Support: {supportPercentage}%</span>
            <span>{proposal.total_votes || 0} total votes</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(supportPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Voting Ends */}
      {proposal.voting_deadline && proposal.status === 'active' && (
        <div className="text-sm text-gray-500 mb-4">
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
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            💰 I₵C Eligible
          </div>
        </div>
      )}
    </Card>
  )
}