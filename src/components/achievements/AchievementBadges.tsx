'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { 
  Trophy, 
  Award, 
  Star, 
  Crown, 
  Zap,
  Lock,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { 
  Achievement, 
  getUserAchievements, 
  getNextAchievements, 
  getRewardColor,
  formatICC 
} from '@/lib/iccRewards'

interface AchievementBadgesProps {
  userAddress: string
  showProgress?: boolean
  compact?: boolean
}

export default function AchievementBadges({ 
  userAddress, 
  showProgress = true, 
  compact = false 
}: AchievementBadgesProps) {
  const [activeTab, setActiveTab] = useState<'unlocked' | 'progress' | 'all'>('unlocked')
  
  const unlockedAchievements = getUserAchievements(userAddress)
  const progressAchievements = getNextAchievements(userAddress)
  
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Award className="w-4 h-4" />
      case 'rare': return <Star className="w-4 h-4" />
      case 'epic': return <Trophy className="w-4 h-4" />
      case 'legendary': return <Crown className="w-4 h-4" />
      default: return <Award className="w-4 h-4" />
    }
  }

  const AchievementCard = ({ achievement, isLocked = false }: { achievement: Achievement, isLocked?: boolean }) => (
    <Card className={`p-4 transition-all hover:shadow-md ${isLocked ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`text-2xl flex-shrink-0 ${isLocked ? 'grayscale' : ''}`}>
          {isLocked ? '🔒' : achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
              {achievement.name}
            </h4>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getRewardColor(achievement.rarity)}`}
            >
              <span className="flex items-center gap-1">
                {getRarityIcon(achievement.rarity)}
                {achievement.rarity}
              </span>
            </Badge>
          </div>
          
          <p className={`text-sm mb-3 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
            {achievement.description}
          </p>
          
          {achievement.progress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{achievement.progress.current}/{achievement.progress.required}</span>
              </div>
              <Progress 
                value={(achievement.progress.current / achievement.progress.required) * 100} 
                className="h-2"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">
                {formatICC(achievement.reward)}
              </span>
            </div>
            
            {achievement.unlockedAt && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {unlockedAchievements.slice(0, 6).map((achievement) => (
          <div 
            key={achievement.id}
            className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm"
            title={achievement.description}
          >
            <span className="text-lg">{achievement.icon}</span>
            <span className="font-medium">{achievement.name}</span>
            <Badge variant="secondary" className="text-xs">
              {formatICC(achievement.reward)}
            </Badge>
          </div>
        ))}              {unlockedAchievements.length > 6 && (
                <Badge variant="secondary" className="rounded-full">
                  +{unlockedAchievements.length - 6} more
                </Badge>
              )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Gallery</h2>
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{unlockedAchievements.length} Unlocked</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>{progressAchievements.length} In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>
              {formatICC(unlockedAchievements.reduce((sum, a) => sum + a.reward, 0))} Earned
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
          <Button
            variant={activeTab === 'unlocked' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('unlocked')}
            className="text-sm"
          >
            <Trophy className="w-4 h-4 mr-1" />
            Unlocked ({unlockedAchievements.length})
          </Button>
          {showProgress && (
            <Button
              variant={activeTab === 'progress' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('progress')}
              className="text-sm"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              In Progress ({progressAchievements.length})
            </Button>
          )}
          <Button
            variant={activeTab === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('all')}
            className="text-sm"
          >
            <Award className="w-4 h-4 mr-1" />
            All Achievements
          </Button>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'unlocked' && unlockedAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
        
        {activeTab === 'progress' && progressAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
        
        {activeTab === 'all' && [
          ...unlockedAchievements,
          ...progressAchievements,
          // Add locked achievements here in a real implementation
        ].map((achievement) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement}
            isLocked={!achievement.unlockedAt}
          />
        ))}
      </div>

      {/* Motivational Message */}
      {activeTab === 'progress' && progressAchievements.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Keep Going!</h3>
            <p className="text-gray-600 text-sm">
              You're making great progress! Complete these achievements to earn more I₵C rewards
              and showcase your civic engagement.
            </p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {activeTab === 'unlocked' && unlockedAchievements.length === 0 && (
        <Card className="p-8 text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
          <p className="text-gray-600 text-sm mb-4">
            Start participating in the community to unlock your first achievement!
          </p>
          <Button size="sm">
            View Available Achievements
          </Button>
        </Card>
      )}
    </div>
  )
}
