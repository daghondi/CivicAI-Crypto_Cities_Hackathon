import ProblemSubmissionForm from '@/components/forms/ProblemSubmissionForm'
import ProposalList from '@/components/proposals/ProposalList'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements - Infinita City inspired */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-logo-primary opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-logo-secondary opacity-10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-logo-accent opacity-10 rounded-full blur-3xl animate-float delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-logo-orange opacity-8 rounded-full blur-3xl animate-float delay-6000"></div>
        
        {/* Electric grid lines - subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-logo-electric to-transparent"></div>
          <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-logo-electric to-transparent"></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-logo-electric to-transparent"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-logo-electric to-transparent"></div>
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-logo-electric to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-logo-electric to-transparent"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          {/* Featured Logo */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-logo-electric/20 via-logo-orange/10 to-logo-primary/20 border border-logo-electric/40 backdrop-blur-sm shadow-2xl shadow-logo-electric/20 hover:shadow-sunset-glow transition-all duration-500">
              <img 
                src="/images/1002271631-removebg-preview.png" 
                alt="CivicAI Logo" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain animate-float drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:drop-shadow-[0_0_20px_rgba(255,107,26,0.7)]"
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent text-glow animate-glow hover:from-logo-orange hover:via-logo-electric hover:to-logo-primary transition-all duration-700 cursor-default">
              CivicAI
            </span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto animate-slide-up">
            Empowering communities through AI-driven governance and civic participation in{' '}
            <span className="text-logo-electric font-semibold">Island communities</span>
            {' '}like Próspera, Network States, and emerging digital communities
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

        {/* Stats Section - Infinita City style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-gradient-card rounded-lg border border-dark-border backdrop-blur-sm animate-slide-up delay-400 hover:border-logo-electric/50 transition-all duration-300">
            <div className="text-3xl font-bold text-logo-primary mb-2 animate-pulse-slow">250+</div>
            <div className="text-text-secondary">Active Proposals</div>
            <div className="w-8 h-1 bg-gradient-to-r from-logo-primary to-logo-electric mx-auto mt-2 rounded-full"></div>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-lg border border-dark-border backdrop-blur-sm animate-slide-up delay-600 hover:border-logo-electric/50 transition-all duration-300">
            <div className="text-3xl font-bold text-logo-accent mb-2 animate-pulse-slow">5.2K</div>
            <div className="text-text-secondary">Community Members</div>
            <div className="w-8 h-1 bg-gradient-to-r from-logo-accent via-logo-orange to-infinita-neon mx-auto mt-2 rounded-full"></div>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-lg border border-dark-border backdrop-blur-sm animate-slide-up delay-800 hover:border-logo-electric/50 transition-all duration-300">
            <div className="text-3xl font-bold text-logo-secondary mb-2 animate-pulse-slow">98%</div>
            <div className="text-text-secondary">AI Accuracy</div>
            <div className="w-8 h-1 bg-gradient-to-r from-logo-secondary to-logo-mint mx-auto mt-2 rounded-full"></div>
          </div>
        </div>

        {/* I₵C Token Info - matching Network State currencies */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up delay-900">
          <div className="bg-gradient-to-r from-logo-electric/10 via-logo-orange/5 to-infinita-neon/10 border border-logo-electric/30 hover:border-logo-orange/40 rounded-xl p-6 backdrop-blur-sm transition-all duration-500">
            <div className="text-center">
              <h3 className="text-xl font-bold text-logo-electric mb-2">Pay with Community Tokens</h3>
              <p className="text-text-secondary mb-4">
                Use community currencies (I₵C, Próspera Dollars, etc.) to participate in governance and earn rewards
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center shadow-lg shadow-logo-orange/30">
                    <span className="text-white font-bold text-sm">I₵</span>
                  </div>
                  <span className="text-text-primary font-semibold">1 I₵C = 1 USD</span>
                </div>
                <Button variant="outline" size="sm" className="border-logo-orange/50 text-logo-orange hover:bg-logo-orange/10">
                  Get I₵C Tokens
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Submission Form */}
        <div className="max-w-6xl mx-auto mb-16 animate-slide-up delay-1000">
          <ProblemSubmissionForm />
        </div>

        {/* Recent Proposals Section */}
        <div className="max-w-7xl mx-auto animate-slide-up delay-1200">
          <div className="bg-gradient-card rounded-xl shadow-2xl p-8 border border-dark-border backdrop-blur-sm hover:border-logo-electric/30 transition-all duration-300">
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

        {/* Infinita City Footer Message */}
        <div className="text-center mt-16 animate-slide-up delay-1400">
          <p className="text-text-muted text-sm">
            Built for{' '}
            <span className="text-logo-electric font-semibold">Infinita City</span>
            {' '}- The City That Never Dies
          </p>
        </div>
      </div>
    </main>
  )
}