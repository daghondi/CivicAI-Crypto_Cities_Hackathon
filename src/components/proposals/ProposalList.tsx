'use client'

import { useState, useEffect } from 'react'
import ProposalCard from './ProposalCard'
import { Button } from '@/components/ui/Button'
import type { Proposal } from '@/types'

interface ProposalListProps {
  initialProposals?: Proposal[]
  showFilters?: boolean
  limit?: number
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Proposals' },
  { value: 'voting', label: 'Currently Voting' },
  { value: 'approved', label: 'Approved' },
  { value: 'implemented', label: 'Implemented' }
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'environment', label: 'Environment' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'safety', label: 'Safety' },
  { value: 'technology', label: 'Technology' },
  { value: 'governance', label: 'Governance' }
]

export default function ProposalList({ 
  initialProposals = [], 
  showFilters = true, 
  limit 
}: ProposalListProps) {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals)
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>(initialProposals)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'votes' | 'impact'>('newest')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for development
  useEffect(() => {
    if (initialProposals.length === 0) {
      // Use mock data when no initial proposals provided
      const mockProposals: Proposal[] = [
        {
          id: '1',
          title: 'Improve Road Between Pristine Bay and Duna',
          description: 'The current road connection between Pristine Bay and Duna is in poor condition, causing daily commute issues for residents. This proposal suggests paving the road and adding proper drainage to ensure all-weather accessibility.',
          category: 'transportation',
          status: 'active',
          created_by: 'user1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
            potential_risks: ['Weather delays during rainy season'],
            recommendations: ['Coordinate with local contractors'],
            similar_proposals: [],
            created_at: new Date().toISOString()
          }
        },
        {
          id: '2',
          title: 'Community Waste Management System',
          description: 'Implement a comprehensive waste management system for the island community, including recycling centers and regular pickup services.',
          category: 'environment',
          status: 'active',
          created_by: 'user2',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          voting_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          votes_for: 8,
          votes_against: 3,
          votes_abstain: 1,
          total_votes: 12,
          impact_score: 78,
          ai_analysis: {
            id: '2',
            proposal_id: '2',
            feasibility_score: 75,
            impact_prediction: 78,
            cost_estimate: 15000,
            implementation_timeline: '2-3 months',
            potential_risks: ['Community adoption challenges'],
            recommendations: ['Community education program'],
            similar_proposals: [],
            created_at: new Date().toISOString()
          }
        },
        {
          id: '3',
          title: 'Digital Governance Platform Enhancement',
          description: 'Expand the current digital governance platform to include better mobile accessibility and real-time proposal tracking.',
          category: 'technology',
          status: 'passed',
          created_by: 'user3',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          voting_deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Past date for passed proposal
          votes_for: 7,
          votes_against: 2,
          votes_abstain: 1,
          total_votes: 10,
          impact_score: 65,
          ai_analysis: {
            id: '3',
            proposal_id: '3',
            feasibility_score: 92,
            impact_prediction: 65,
            cost_estimate: 8000,
            implementation_timeline: '1-2 months',
            potential_risks: ['Technical complexity'],
            recommendations: ['Hire experienced developers'],
            similar_proposals: [],
            created_at: new Date().toISOString()
          }
        }
      ]
      setProposals(mockProposals)
      setFilteredProposals(mockProposals)
    }
  }, [initialProposals])

  // Filter and sort proposals
  useEffect(() => {
    let filtered = [...proposals]

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'votes':
          return (b.total_votes || 0) - (a.total_votes || 0)
        case 'impact':
          return b.impact_score - a.impact_score
        default:
          return 0
      }
    })

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    setFilteredProposals(filtered)
  }, [proposals, statusFilter, categoryFilter, sortBy, limit])

  const handleVote = async (proposalId: string, voteType: 'for' | 'against') => {
    try {
      // Mock voting - in real app, this would call API
      console.log(`Voting ${voteType} on proposal ${proposalId}`)
      
      // Optimistically update the vote count
      setProposals(prev => prev.map(p => 
        p.id === proposalId 
          ? { ...p, total_votes: (p.total_votes || 0) + 1 }
          : p
      ))
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-text-secondary">Loading proposals...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter proposals by status"
                className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-text-primary rounded-lg focus:ring-2 focus:ring-logo-electric focus:border-logo-electric"
              >
                {FILTER_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter proposals by category"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort proposals by"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest</option>
                <option value="votes">Most Votes</option>
                <option value="impact">Highest Impact</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary bg-gradient-to-r from-logo-primary to-logo-electric bg-clip-text text-transparent">
          {limit ? `Latest ${limit} Proposals` : 'All Proposals'}
        </h2>
        <span className="text-text-secondary">
          {filteredProposals.length} proposal{filteredProposals.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Proposals Grid */}
      {filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map(proposal => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              onVote={handleVote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">No proposals found matching your criteria.</p>
          <Button className="mt-4">
            Submit New Proposal
          </Button>
        </div>
      )}
    </div>
  )
}