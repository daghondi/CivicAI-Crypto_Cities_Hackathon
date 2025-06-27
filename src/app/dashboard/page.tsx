'use client'

import { useWeb3 } from '@/components/providers/Web3Provider'
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

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-gray-600 mb-8">
              Connect your wallet to access your personalized dashboard and start earning I₵C rewards
            </p>
            <Button size="lg">
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
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back, Civic Champion! 🏛️
          </h1>
          <UserBadge address={address || undefined} showReputation={true} showVerified={true} />
          
          {/* Current Rank Badge */}
          <div className="mt-4 flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Trophy className="w-4 h-4 mr-1" />
              Ranked #{userStats.currentRank} in Community
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Zap className="w-4 h-4 mr-1" />
              +{userStats.weeklyICC} I₵C this week
            </Badge>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {userStats.iccEarned}
            </div>
            <div className="text-yellow-700 text-sm font-medium">I₵C Earned</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {userStats.proposalsCreated}
            </div>
            <div className="text-gray-600 text-sm">Proposals</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userStats.votesSubmitted}
            </div>
            <div className="text-gray-600 text-sm">Votes</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {userStats.reputation}
            </div>
            <div className="text-gray-600 text-sm">Reputation</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {userStats.discussionsStarted}
            </div>
            <div className="text-gray-600 text-sm">Discussions</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {userStats.achievementBadges.length}
            </div>
            <div className="text-gray-600 text-sm">Achievements</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Actions & Earning Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/proposals/create">
                  <Button className="w-full" size="lg" variant="default">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Proposal (+50 I₵C)
                  </Button>
                </Link>
                <Link href="/proposals">
                  <Button variant="outline" className="w-full" size="lg">
                    <Vote className="w-4 h-4 mr-2" />
                    Vote on Proposals (+10 I₵C)
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Join Discussions (+5 I₵C)
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full" size="lg">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">�️</span>
                  <div className="flex-1">
                    <div className="font-medium">Voted on "Improve Road Between Pristine Bay and Duna"</div>
                    <div className="text-sm text-gray-500">2 hours ago</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">+10 I₵C</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-2xl">📝</span>
                  <div className="flex-1">
                    <div className="font-medium">Created proposal "Community Waste Management System"</div>
                    <div className="text-sm text-gray-500">1 day ago</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">+50 I₵C</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <div className="flex-1">
                    <div className="font-medium">Unlocked "Policy Architect" achievement</div>
                    <div className="text-sm text-gray-500">3 days ago</div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">+300 I₵C</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">💬</span>
                  <div className="flex-1">
                    <div className="font-medium">Posted thoughtful comment on infrastructure proposal</div>
                    <div className="text-sm text-gray-500">4 days ago</div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700">+5 I₵C</Badge>
                </div>
              </div>
            </Card>

            {/* My Proposals */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Proposals
                </h2>
                <Link href="/proposals?filter=my-proposals">
                  <Button variant="outline">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Network Status
              </h3>
              <NetworkSelector />
            </div>

            {/* Deployment Status */}
            <DeploymentStatus />

            {/* Achievement Badges */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Achievement Badges
              </h3>
              <div className="space-y-3">
                {userStats.achievementBadges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-2xl">🏆</span>
                    <span className="font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* I₵C Wallet */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💰 I₵C Wallet
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {userStats.iccEarned} I₵C
                </div>
                <div className="text-sm text-gray-600">Available Balance</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium text-green-600">+45 I₵C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Reward</span>
                  <span className="font-medium">25 I₵C</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                View Transaction History
              </Button>
            </Card>

            {/* Smart Contract Status */}
            <SmartContractStatus />

            {/* Community Rank */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Community Ranking
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-2xl mb-2">🥉</div>
                <div className="text-lg font-bold text-gray-900">#23</div>
                <div className="text-sm text-gray-600">out of 156 active members</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reputation</span>
                  <span className="font-medium">{userStats.reputation}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participation</span>
                  <span className="font-medium">High</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
