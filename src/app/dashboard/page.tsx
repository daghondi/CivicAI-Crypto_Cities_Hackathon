'use client'

import { useWeb3 } from '@/components/providers/Web3Provider'
import { useCivicAIContracts } from '@/hooks/useSmartContracts'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import UserBadge from '@/components/wallet/UserBadge'
import ProposalList from '@/components/proposals/ProposalList'
import SmartContractStatus from '@/components/contracts/SmartContractStatus'
import NetworkSelector from '@/components/web3/NetworkSelector'
import DeploymentStatus from '@/components/web3/DeploymentStatus'
import AchievementBadges from '@/components/achievements/AchievementBadges'
import Leaderboard from '@/components/leaderboard/Leaderboard'
import ICCWallet from '@/components/wallet/ICCWallet'
import Link from 'next/link'
import { 
  Trophy, 
  Zap, 
  TrendingUp, 
  Users,
  Plus,
  Vote,
  Award,
  Calendar,
  MessageSquare
} from 'lucide-react'

export default function DashboardPage() {
  const { address, isConnected } = useWeb3()
  const { iccToken, governance, events } = useCivicAIContracts()

  // Real-time ICC balance and contract data
  const iccBalance = iccToken.balance || '0'
  const totalRewards = iccToken.totalRewards || '0'

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-dark relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-10 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-text-secondary mb-8">
              Connect your wallet to access your personalized dashboard and start earning I₵C rewards
            </p>
            <Button size="lg" variant="glow">
              Connect Wallet
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Mock user data with enhanced I₵C stats
  const userStats = {
    proposalsCreated: 7,
    votesSubmitted: 23,
    reputation: 92,
    iccEarned: 1850,
    achievementBadges: ['Early Adopter', 'Active Voter', 'Community Builder', 'Policy Architect'],
    weeklyICC: 285,
    monthlyICC: 950,
    currentRank: 3,
    discussionsStarted: 5,
    commentsPosted: 18
  }

  return (
    <main className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-logo-primary opacity-5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-logo-accent opacity-5 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-logo-secondary opacity-5 rounded-full blur-3xl animate-float delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent mb-2">
            Welcome Back, Civic Champion! 🏛️
          </h1>
          <UserBadge address={address || undefined} showReputation={true} showVerified={true} />
          
          {/* Current Rank Badge */}
          <div className="mt-4 flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-accent-gold to-accent-orange text-dark-bg">
              <Trophy className="w-4 h-4 mr-1" />
              Ranked #{userStats.currentRank} in Community
            </Badge>
            <Badge variant="secondary" className="bg-dark-elevated text-logo-accent border border-logo-accent">
              <Zap className="w-4 h-4 mr-1" />
              {userStats.weeklyICC} I₵C This Week
            </Badge>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 text-center bg-gradient-to-br from-accent-gold/20 to-accent-orange/20 border border-accent-gold/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-accent-gold mb-1">
              {userStats.iccEarned}
            </div>
            <div className="text-accent-orange text-sm font-medium">I₵C Earned</div>
          </Card>
          
          <Card className="p-4 text-center bg-dark-elevated border border-logo-primary/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-logo-primary mb-1">
              {userStats.proposalsCreated}
            </div>
            <div className="text-text-secondary text-sm">Proposals</div>
          </Card>
          
          <Card className="p-4 text-center bg-dark-elevated border border-logo-accent/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-logo-accent mb-1">
              {userStats.votesSubmitted}
            </div>
            <div className="text-text-secondary text-sm">Votes</div>
          </Card>
          
          <Card className="p-4 text-center bg-dark-elevated border border-logo-secondary/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-logo-secondary mb-1">
              {userStats.reputation}
            </div>
            <div className="text-text-secondary text-sm">Reputation</div>
          </Card>
          
          <Card className="p-4 text-center bg-dark-elevated border border-logo-primary/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-logo-primary mb-1">
              {userStats.discussionsStarted}
            </div>
            <div className="text-text-secondary text-sm">Discussions</div>
          </Card>
          
          <Card className="p-4 text-center bg-dark-elevated border border-accent-orange/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-accent-orange mb-1">
              {userStats.achievementBadges.length}
            </div>
            <div className="text-text-secondary text-sm">Achievements</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="p-6 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-gold" />
                Quick Actions & Earning Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/proposals/create">
                  <Button className="w-full bg-gradient-to-r from-logo-primary to-logo-accent hover:from-logo-primary/80 hover:to-logo-accent/80" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Proposal (+50 I₵C)
                  </Button>
                </Link>
                <Link href="/proposals">
                  <Button variant="outline" className="w-full border-logo-secondary text-logo-secondary hover:bg-logo-secondary/10" size="lg">
                    <Vote className="w-4 h-4 mr-2" />
                    Vote on Proposals (+10 I₵C)
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full border-logo-accent text-logo-accent hover:bg-logo-accent/10" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Join Discussions (+5 I₵C)
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full border-accent-orange text-accent-orange hover:bg-accent-orange/10" size="lg">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 bg-dark-elevated border border-logo-accent/20 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-logo-accent" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-logo-accent/10 to-logo-accent/5 border border-logo-accent/20 rounded-lg">
                  <span className="text-2xl">🗳️</span>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">Voted on "Improve Road Between Pristine Bay and Duna"</div>
                    <div className="text-sm text-text-secondary">2 hours ago</div>
                  </div>
                  <Badge className="bg-gradient-to-r from-logo-accent to-logo-accent/80 text-dark-bg">+10 I₵C</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-logo-primary/10 to-logo-primary/5 border border-logo-primary/20 rounded-lg">
                  <span className="text-2xl">📝</span>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">Created proposal "Community Waste Management System"</div>
                    <div className="text-sm text-text-secondary">1 day ago</div>
                  </div>
                  <Badge className="bg-gradient-to-r from-logo-primary to-logo-primary/80 text-dark-bg">+50 I₵C</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/20 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">Unlocked "Policy Architect" achievement</div>
                    <div className="text-sm text-text-secondary">3 days ago</div>
                  </div>
                  <Badge className="bg-gradient-to-r from-accent-gold to-accent-orange text-dark-bg">+300 I₵C</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-logo-secondary/10 to-logo-secondary/5 border border-logo-secondary/20 rounded-lg">
                  <span className="text-2xl">💬</span>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">Posted thoughtful comment on infrastructure proposal</div>
                    <div className="text-sm text-text-secondary">4 days ago</div>
                  </div>
                  <Badge className="bg-gradient-to-r from-logo-secondary to-logo-secondary/80 text-dark-bg">+5 I₵C</Badge>
                </div>
              </div>
            </Card>

            {/* My Proposals */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  My Proposals
                </h2>
                <Link href="/proposals?filter=my-proposals">
                  <Button variant="outline" className="border-logo-primary text-logo-primary hover:bg-logo-primary/10">
                    View All
                  </Button>
                </Link>
              </div>
              <ProposalList showFilters={false} limit={3} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Network Selection */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Network Status
              </h3>
              <NetworkSelector />
            </div>

            {/* Deployment Status */}
            <DeploymentStatus />

            {/* Achievement Badges */}
            <Card className="p-6 bg-dark-elevated border border-accent-gold/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Achievement Badges
              </h3>
              <div className="space-y-3">
                {userStats.achievementBadges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-2xl">🏆</span>
                    <span className="font-medium text-text-primary">{badge}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* I₵C Wallet */}
            <Card className="p-6 bg-dark-elevated border border-accent-gold/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                💰 I₵C Wallet
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-accent-gold mb-1">
                  {userStats.iccEarned} I₵C
                </div>
                <div className="text-sm text-text-secondary">Available Balance</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">This Month</span>
                  <span className="font-medium text-logo-accent">+45 I₵C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Last Reward</span>
                  <span className="font-medium text-text-primary">25 I₵C</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 border-accent-gold text-accent-gold hover:bg-accent-gold/10">
                View Transaction History
              </Button>
            </Card>

            {/* Smart Contract Status */}
            <SmartContractStatus />

            {/* Community Rank */}
            <Card className="p-6 bg-dark-elevated border border-logo-secondary/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Community Ranking
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-2xl mb-2">🥉</div>
                <div className="text-lg font-bold text-accent-orange">#23</div>
                <div className="text-sm text-text-secondary">out of 156 active members</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Reputation</span>
                  <span className="font-medium text-logo-secondary">{userStats.reputation}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Participation</span>
                  <span className="font-medium text-logo-accent">High</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
