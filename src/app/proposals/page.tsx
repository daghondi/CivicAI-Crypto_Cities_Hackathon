import ProposalList from '@/components/proposals/ProposalList'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function ProposalsPage() {
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent">
                Community Proposals
              </h1>
              <p className="text-text-secondary mt-2">
                Browse, vote on, and track civic proposals for our community
              </p>
            </div>
            <Link href="/proposals/create">
              <Button size="lg" variant="glow">
                Submit New Proposal
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card variant="elevated" className="p-4 text-center">
              <div className="text-2xl font-bold text-logo-primary">12</div>
              <div className="text-sm text-text-secondary">Active Proposals</div>
            </Card>
            <Card variant="elevated" className="p-4 text-center">
              <div className="text-2xl font-bold text-logo-accent">847</div>
              <div className="text-sm text-text-secondary">Total Votes</div>
            </Card>
            <Card variant="elevated" className="p-4 text-center">
              <div className="text-2xl font-bold text-logo-secondary">5.2K</div>
              <div className="text-sm text-text-secondary">Community Members</div>
            </Card>
            <Card variant="elevated" className="p-4 text-center">
              <div className="text-2xl font-bold text-accent-gold">98%</div>
              <div className="text-sm text-text-secondary">Implementation Rate</div>
            </Card>
          </div>
        </div>

        {/* Proposals List */}
        <div className="bg-gradient-card rounded-xl shadow-2xl p-8 border border-dark-border backdrop-blur-sm">
          <ProposalList showFilters={true} />
        </div>
      </div>
    </main>
  )
}
