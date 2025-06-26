'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Proposal } from '@/types'
import { formatDate, getVotePercentage } from '@/lib/utils'
import { Clock, Users, TrendingUp, DollarSign } from 'lucide-react'

interface ProposalDetailsProps {
  proposal: Proposal
}

export function ProposalDetails({ proposal }: ProposalDetailsProps) {
  const forPercentage = getVotePercentage(proposal.votes_for || 0, proposal.total_votes || 0)
  const againstPercentage = getVotePercentage(proposal.votes_against || 0, proposal.total_votes || 0)

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="capitalize">
              {proposal.category}
            </Badge>
            <Badge 
              variant={
                proposal.status === 'active' ? 'default' :
                proposal.status === 'passed' ? 'success' :
                proposal.status === 'failed' ? 'danger' : 'secondary'
              }
              className="capitalize"
            >
              {proposal.status}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {proposal.title}
          </h1>
        </div>

        {/* Description */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {proposal.description}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Voting Ends</div>
            <div className="text-lg font-semibold">
              {formatDate(proposal.voting_deadline)}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Total Votes</div>
            <div className="text-lg font-semibold">
              {proposal.total_votes || 0}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Impact Score</div>
            <div className="text-lg font-semibold">
              {proposal.impact_score}/100
            </div>
          </div>
          
          {proposal.cost_estimate && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Cost Estimate</div>
              <div className="text-lg font-semibold">
                ${proposal.cost_estimate.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Voting Progress */}
        {proposal.status === 'active' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Results</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">In Favor</span>
                <span className="text-sm text-gray-600">{proposal.votes_for || 0} votes ({forPercentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(forPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">Against</span>
                <span className="text-sm text-gray-600">{proposal.votes_against || 0} votes ({againstPercentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(againstPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Details */}
        {(proposal.timeline || proposal.feasibility_score) && (
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Additional Details</h3>
            
            {proposal.timeline && (
              <div>
                <div className="text-sm font-medium text-gray-600">Timeline</div>
                <div className="text-sm text-gray-900 mt-1">{proposal.timeline}</div>
              </div>
            )}
            
            {proposal.feasibility_score && (
              <div>
                <div className="text-sm font-medium text-gray-600">Feasibility Score</div>
                <div className="text-sm text-gray-900 mt-1">{proposal.feasibility_score}/100</div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProposalDetails
