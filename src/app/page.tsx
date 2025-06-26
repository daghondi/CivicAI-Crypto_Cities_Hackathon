import ProblemSubmissionForm from '@/components/forms/ProblemSubmissionForm'
import ProposalList from '@/components/proposals/ProposalList'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">CivicAI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Empowering communities through AI-driven governance and civic participation
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button size="lg">
              Get Started
            </Button>
            <Link href="/proposals">
              <Button variant="secondary" size="lg">
                View Proposals
              </Button>
            </Link>
          </div>
        </div>

        {/* Problem Submission Form */}
        <div className="max-w-6xl mx-auto mb-16">
          <ProblemSubmissionForm />
        </div>

        {/* Recent Proposals Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Proposals</h2>
              <Link href="/proposals">
                <Button variant="outline">
                  View All Proposals
                </Button>
              </Link>
            </div>
            <ProposalList showFilters={false} limit={3} />
          </div>
        </div>
      </div>
    </main>
  )
}