'use client'

import { useWeb3 } from '@/components/providers/Web3Provider'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import UserBadge from '@/components/wallet/UserBadge'
import ProposalList from '@/components/proposals/ProposalList'
import Link from 'next/link'

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
              Connect your wallet to access your personalized dashboard
            </p>
            <Button size="lg">
              Connect Wallet
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Mock user data
  const userStats = {
    proposalsCreated: 3,
    votesSubmitted: 12,
    reputation: 85,
    iccEarned: 150,
    achievementBadges: ['Early Adopter', 'Active Voter', 'Community Builder']
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h1>
          <UserBadge address={address || undefined} showReputation={true} showVerified={true} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userStats.proposalsCreated}
            </div>
            <div className="text-gray-600">Proposals Created</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {userStats.votesSubmitted}
            </div>
            <div className="text-gray-600">Votes Submitted</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {userStats.reputation}
            </div>
            <div className="text-gray-600">Reputation Score</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {userStats.iccEarned} I₵C
            </div>
            <div className="text-gray-600">Credits Earned</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="w-full" size="lg">
                  📝 Submit New Proposal
                </Button>
                <Link href="/proposals">
                  <Button variant="outline" className="w-full" size="lg">
                    🗳️ Vote on Proposals
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">👍</span>
                  <div>
                    <div className="font-medium">Voted on "Improve Road Between Pristine Bay and Duna"</div>
                    <div className="text-sm text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📝</span>
                  <div>
                    <div className="font-medium">Created proposal "Community Waste Management System"</div>
                    <div className="text-sm text-gray-500">1 day ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="font-medium">Earned "Active Voter" badge</div>
                    <div className="text-sm text-gray-500">3 days ago</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* My Proposals */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Proposals
                </h2>
                <Button variant="outline">
                  View All
                </Button>
              </div>
              <ProposalList showFilters={false} limit={2} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
