import ProposalList from '@/components/proposals/ProposalList'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function ProposalsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Proposals</h1>
              <p className="text-gray-600 mt-2">
                Browse, vote on, and track civic proposals for our community
              </p>
            </div>
            <Button size="lg">
              Submit New Proposal
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Active Proposals</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Approved</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Implemented</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">156</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </Card>
          </div>
        </div>

        {/* Proposals List */}
        <ProposalList showFilters={true} />
      </div>
    </main>
  )
}
