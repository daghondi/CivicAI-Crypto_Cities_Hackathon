import ProblemSubmissionForm from '@/components/forms/ProblemSubmissionForm'
import ProposalList from '@/components/proposals/ProposalList'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-logo-primary opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-logo-secondary opacity-10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-logo-accent opacity-10 rounded-full blur-3xl animate-float delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent text-glow animate-glow">
              CivicAI
            </span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto animate-slide-up">
            Empowering communities through AI-driven governance and civic participation in the digital age
          </p>
          <div className="flex justify-center gap-4 mb-8 animate-slide-up delay-200">
            <Button size="lg" variant="glow">
              Get Started
            </Button>
            <Link href="/proposals">
              <Button variant="outline" size="lg">
                View Proposals
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-gradient-card rounded-lg border border-dark-border backdrop-blur-sm animate-slide-up delay-400">
            <div className="text-3xl font-bold text-logo-primary mb-2">250+</div>
            <div className="text-text-secondary">Active Proposals</div>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-lg border border-dark-border backdrop-blur-sm animate-slide-up delay-600">
            <div className="text-3xl font-bold text-logo-accent mb-2">5.2K</div>
            <div className="text-text-secondary">Community Members</div>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-lg border border-dark-border backdrop-blur-sm animate-slide-up delay-800">
            <div className="text-3xl font-bold text-logo-secondary mb-2">98%</div>
            <div className="text-text-secondary">AI Accuracy</div>
          </div>
        </div>

        {/* Problem Submission Form */}
        <div className="max-w-6xl mx-auto mb-16 animate-slide-up delay-1000">
          <ProblemSubmissionForm />
        </div>

        {/* Recent Proposals Section */}
        <div className="max-w-7xl mx-auto animate-slide-up delay-1200">
          <div className="bg-gradient-card rounded-xl shadow-2xl p-8 border border-dark-border backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Recent Proposals</h2>
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