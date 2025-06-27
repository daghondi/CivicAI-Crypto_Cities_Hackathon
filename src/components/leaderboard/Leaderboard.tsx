'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  TrendingUp,
  Calendar,
  Users,
  Zap,
  Star,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { 
  LeaderboardEntry, 
  MOCK_LEADERBOARD,
  formatICC,
  calculateUserRank 
} from '@/lib/iccRewards'

interface LeaderboardProps {
  userAddress?: string
  timeframe?: 'all' | 'month' | 'week'
  category?: 'total' | 'proposals' | 'votes' | 'reputation'
  showUserPosition?: boolean
  compact?: boolean
  limit?: number
}

export default function Leaderboard({ 
  userAddress,
  timeframe = 'all',
  category = 'total',
  showUserPosition = true,
  compact = false,
  limit
}: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<'totalICC' | 'reputation' | 'achievementCount'>('totalICC')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Sort leaderboard data
  const sortedLeaderboard = [...MOCK_LEADERBOARD].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
  }).slice(0, limit || (compact ? 5 : 10))

  const userRank = userAddress ? calculateUserRank(userAddress) : null
  const userEntry = userAddress ? MOCK_LEADERBOARD.find(entry => entry.address === userAddress) : null

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />
      case 2: return <Medal className="w-5 h-5 text-gray-400" />
      case 3: return <Award className="w-5 h-5 text-orange-500" />
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200'
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const SortButton = ({ 
    field, 
    label, 
    icon 
  }: { 
    field: 'totalICC' | 'reputation' | 'achievementCount', 
    label: string, 
    icon: React.ReactNode 
  }) => (
    <Button
      variant={sortBy === field ? 'primary' : 'outline'}
      size="sm"
      onClick={() => {
        if (sortBy === field) {
          setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
        } else {
          setSortBy(field)
          setSortOrder('desc')
        }
      }}
      className="flex items-center gap-1"
    >
      {icon}
      {label}
      {sortBy === field && (
        sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
      )}
    </Button>
  )

  const LeaderboardRow = ({ entry, isCurrentUser = false }: { entry: LeaderboardEntry, isCurrentUser?: boolean }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
      isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50'
    }`}>
      {/* Rank */}
      <div className="flex-shrink-0">
        {getRankIcon(entry.rank)}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 truncate">
            {entry.displayName || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
          </h4>
          {entry.ensName && (
            <Badge variant="secondary" className="text-xs">
              {entry.ensName}
            </Badge>
          )}
          {isCurrentUser && (
            <Badge variant="secondary" className="text-xs">
              You
            </Badge>
          )}
        </div>
        
        {!compact && (
          <div className="flex flex-wrap gap-1 mb-2">
            {entry.badges.slice(0, 2).map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
            {entry.badges.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{entry.badges.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="font-bold text-yellow-600">
            {formatICC(entry.totalICC)}
          </div>
          <div className="text-gray-500 text-xs">Total I₵C</div>
        </div>
        
        {!compact && (
          <>
            <div className="text-center">
              <div className="font-bold text-purple-600">
                {entry.reputation}
              </div>
              <div className="text-gray-500 text-xs">Reputation</div>
            </div>
            
            <div className="text-center">
              <div className="font-bold text-blue-600">
                {entry.achievementCount}
              </div>
              <div className="text-gray-500 text-xs">Achievements</div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Top Contributors
          </h3>
          <Badge variant="secondary" className="text-xs">
            {timeframe === 'week' ? 'This Week' : timeframe === 'month' ? 'This Month' : 'All Time'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {sortedLeaderboard.slice(0, 3).map((entry) => (
            <LeaderboardRow 
              key={entry.address} 
              entry={entry}
              isCurrentUser={entry.address === userAddress}
            />
          ))}
        </div>
        
        {showUserPosition && userRank && userRank > 3 && userEntry && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <LeaderboardRow entry={userEntry} isCurrentUser={true} />
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Community Leaderboard
        </h2>
        <p className="text-gray-600">
          Top civic engagement champions in our community
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
          <Button
            variant={timeframe === 'all' ? 'primary' : 'secondary'}
            size="sm"
            className="text-sm"
          >
            <Users className="w-4 h-4 mr-1" />
            All Time
          </Button>
          <Button
            variant={timeframe === 'month' ? 'primary' : 'secondary'}
            size="sm"
            className="text-sm"
          >
            <Calendar className="w-4 h-4 mr-1" />
            This Month
          </Button>
          <Button
            variant={timeframe === 'week' ? 'primary' : 'secondary'}
            size="sm"
            className="text-sm"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            This Week
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-center gap-2 flex-wrap">
        <SortButton 
          field="totalICC" 
          label="I₵C Earned" 
          icon={<Zap className="w-4 h-4" />}
        />
        <SortButton 
          field="reputation" 
          label="Reputation" 
          icon={<Star className="w-4 h-4" />}
        />
        <SortButton 
          field="achievementCount" 
          label="Achievements" 
          icon={<Award className="w-4 h-4" />}
        />
      </div>

      {/* Leaderboard */}
      <Card className="p-6">
        <div className="space-y-2">
          {sortedLeaderboard.map((entry, index) => (
            <LeaderboardRow 
              key={entry.address} 
              entry={{...entry, rank: index + 1}}
              isCurrentUser={entry.address === userAddress}
            />
          ))}
        </div>
      </Card>

      {/* User Position (if not in top 10) */}
      {showUserPosition && userRank && userRank > 10 && userEntry && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">Your Position</h3>
            <p className="text-gray-600 text-sm">Keep participating to climb the leaderboard!</p>
          </div>
          <LeaderboardRow entry={userEntry} isCurrentUser={true} />
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {formatICC(MOCK_LEADERBOARD.reduce((sum, entry) => sum + entry.totalICC, 0))}
          </div>
          <div className="text-gray-600 text-sm">Total I₵C Distributed</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {MOCK_LEADERBOARD.length}
          </div>
          <div className="text-gray-600 text-sm">Active Contributors</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {Math.round(MOCK_LEADERBOARD.reduce((sum, entry) => sum + entry.reputation, 0) / MOCK_LEADERBOARD.length)}
          </div>
          <div className="text-gray-600 text-sm">Average Reputation</div>
        </Card>
      </div>
    </div>
  )
}
