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
    <main className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-5 rounded-full blur-3xl animate-float delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
            <span>Proposals</span>
            <span>›</span>
            <span className="text-text-primary">{proposal.title}</span>
          </div>
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{getCategoryIcon(proposal.category)}</span>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent mb-2">
                  {proposal.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-gradient-to-r from-logo-accent to-logo-accent/80 text-dark-bg">
                    {proposal.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-text-secondary capitalize">{proposal.category}</span>
                  <span className="text-text-secondary">•</span>
                  <span className="text-text-secondary">
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
            <Card className="p-6 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Proposal Details
              </h2>
              <div className="prose prose-gray max-w-none">
                {proposal.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {/* AI Analysis */}
            {proposal.ai_analysis && (
              <Card className="p-6 bg-dark-elevated border border-logo-accent/20 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  🤖 AI Analysis
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-logo-accent">
                      {proposal.ai_analysis.feasibility_score}/100
                    </div>
                    <div className="text-sm text-text-secondary">Feasibility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-logo-primary">
                      {proposal.ai_analysis.impact_prediction}/100
                    </div>
                    <div className="text-sm text-text-secondary">Impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-orange">
                      ${proposal.ai_analysis.cost_estimate?.toLocaleString()}
                    </div>
                    <div className="text-sm text-text-secondary">Est. Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-logo-secondary">
                      {proposal.ai_analysis.implementation_timeline}
                    </div>
                    <div className="text-sm text-text-secondary">Timeline</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Potential Risks</h3>
                    <ul className="space-y-1">
                      {proposal.ai_analysis.potential_risks.map((risk, index) => (
                        <li key={index} className="text-sm text-text-secondary flex items-start">
                          <span className="text-red-400 mr-2">⚠️</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {proposal.ai_analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-text-secondary flex items-start">
                          <span className="text-logo-accent mr-2">✅</span>
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
              <Card className="p-6 bg-dark-elevated border border-logo-accent/30 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Cast Your Vote
                </h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-text-secondary mb-2">
                    <span>Support: {supportPercentage}%</span>
                    <span>{proposal.total_votes || 0} total votes</span>
                  </div>
                  <div className="w-full bg-dark-bg/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-logo-accent to-logo-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(supportPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">{votingDaysLeft}</div>
                  <div className="text-sm text-text-secondary">days left to vote</div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-logo-accent to-logo-primary hover:from-logo-accent/80 hover:to-logo-primary/80" size="lg">
                    👍 Support Proposal
                  </Button>
                  <Button variant="outline" className="w-full border-logo-secondary text-logo-secondary hover:bg-logo-secondary/10" size="lg">
                    👎 Oppose Proposal
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-logo-primary/20">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-accent-gold/20 to-accent-orange/20 text-accent-gold border border-accent-gold/30">
                    💰 I₵C Rewards Eligible
                  </div>
                </div>
              </Card>
            )}

            {/* Stats Card */}
            <Card className="p-6 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Proposal Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Created</span>
                  <span className="font-medium text-text-primary">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Category</span>
                  <span className="font-medium text-text-primary capitalize">{proposal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Impact Score</span>
                  <span className="font-medium text-logo-accent">{proposal.impact_score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Votes</span>
                  <span className="font-medium text-text-primary">{proposal.total_votes || 0}</span>
                </div>
                {proposal.voting_deadline && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Voting Ends</span>
                    <span className="font-medium text-text-primary">
                      {new Date(proposal.voting_deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Created By */}
            <Card className="p-6 bg-dark-elevated border border-logo-secondary/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
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
