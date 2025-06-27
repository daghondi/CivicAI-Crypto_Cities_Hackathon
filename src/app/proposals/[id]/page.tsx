import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import UserBadge from '@/components/wallet/UserBadge'
import ProposalAmendmentForm from '@/components/proposals/ProposalAmendmentForm'
import ProposalAmendmentList from '@/components/proposals/ProposalAmendmentList'
import type { Proposal } from '@/types'

// Mock data - in a real app, this would fetch from API/database
const getProposal = async (id: string): Promise<Proposal | null> => {
  const mockProposals: Proposal[] = [
    {
      id: '1',
      title: 'Improve Road Between Pristine Bay and Duna',
      description: `The current road connection between Pristine Bay and Duna is in poor condition, causing daily commute issues for residents. This proposal suggests paving the road and adding proper drainage to ensure all-weather accessibility.

## Problem Analysis
The existing dirt road becomes impassable during heavy rains, forcing residents to take longer alternative routes or wait for weather conditions to improve. This affects:
- Daily commute times (increased by 45-60 minutes)
- Emergency service access
- Economic activity between the two areas
- Quality of life for residents

## Proposed Solution
1. **Road Paving**: Apply asphalt surface over existing road base
2. **Drainage System**: Install proper culverts and side drainage
3. **Safety Features**: Add reflective markers and basic signage
4. **Maintenance Plan**: Establish regular inspection and repair schedule

## Expected Benefits
- Reduced commute time by 30-45 minutes daily
- Year-round accessibility regardless of weather
- Improved emergency response times
- Enhanced economic connectivity between communities
- Reduced vehicle maintenance costs for residents`,
      category: 'transportation',
      status: 'active',
      created_by: 'user1',
      created_at: '2025-06-20T10:00:00Z',
      updated_at: '2025-06-25T15:30:00Z',
      voting_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      total_votes: 7,
      votes_for: 5,
      votes_against: 2,
      impact_score: 85,
      ai_analysis: {
        id: '1',
        proposal_id: '1',
        feasibility_score: 88,
        impact_prediction: 85,
        cost_estimate: 25000,
        implementation_timeline: '3-4 months',
        potential_risks: [
          'Weather delays during rainy season',
          'Potential traffic disruption during construction',
          'Cost overruns due to unforeseen ground conditions'
        ],
        recommendations: [
          'Coordinate with local contractors for competitive pricing',
          'Plan construction during dry season (February-April)',
          'Set up temporary routes during construction',
          'Conduct soil analysis before final cost estimation'
        ],
        similar_proposals: [],
        created_at: '2025-06-20T10:30:00Z'
      }
    }
  ]
  
  return mockProposals.find(p => p.id === id) || null
}

interface PageProps {
  params: { id: string }
}

export default async function ProposalPage({ params }: PageProps) {
  const proposal = await getProposal(params.id)

  if (!proposal) {
    notFound()
  }

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

  const votingDaysLeft = proposal.voting_deadline 
    ? Math.max(0, Math.ceil((new Date(proposal.voting_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Proposals</span>
            <span>›</span>
            <span className="text-gray-900">{proposal.title}</span>
          </div>
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{getCategoryIcon(proposal.category)}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {proposal.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(proposal.status)}>
                    {proposal.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-gray-500 capitalize">{proposal.category}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Proposal Details
              </h2>
              <div className="prose prose-gray max-w-none">
                {proposal.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {/* AI Analysis */}
            {proposal.ai_analysis && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  🤖 AI Analysis
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {proposal.ai_analysis.feasibility_score}/100
                    </div>
                    <div className="text-sm text-gray-600">Feasibility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {proposal.ai_analysis.impact_prediction}/100
                    </div>
                    <div className="text-sm text-gray-600">Impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${proposal.ai_analysis.cost_estimate?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Est. Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {proposal.ai_analysis.implementation_timeline}
                    </div>
                    <div className="text-sm text-gray-600">Timeline</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Potential Risks</h3>
                    <ul className="space-y-1">
                      {proposal.ai_analysis.potential_risks.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-red-500 mr-2">⚠️</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {proposal.ai_analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">✅</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Proposal Amendments */}
            <ProposalAmendmentForm 
              proposalId={params.id}
              onAmendmentProposed={() => {
                // Force re-render or refresh amendments
              }}
            />

            <ProposalAmendmentList 
              proposalId={params.id}
              onAmendmentUpdate={() => {
                // Handle amendment updates
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Card */}
            {proposal.status === 'active' && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cast Your Vote
                </h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Support: {supportPercentage}%</span>
                    <span>{proposal.total_votes || 0} total votes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(supportPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{votingDaysLeft}</div>
                  <div className="text-sm text-gray-600">days left to vote</div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    👍 Support Proposal
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    👎 Oppose Proposal
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    💰 I₵C Rewards Eligible
                  </div>
                </div>
              </Card>
            )}

            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Proposal Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">{proposal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impact Score</span>
                  <span className="font-medium">{proposal.impact_score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Votes</span>
                  <span className="font-medium">{proposal.total_votes || 0}</span>
                </div>
                {proposal.voting_deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voting Ends</span>
                    <span className="font-medium">
                      {new Date(proposal.voting_deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Created By */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Created By
              </h3>
              <UserBadge address="0x1234567890123456789012345678901234567890" />
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
