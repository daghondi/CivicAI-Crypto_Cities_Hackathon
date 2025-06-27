'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Wallet,
  History,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Gift,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react'
import { 
  ICCReward,
  MOCK_RECENT_REWARDS,
  ICC_REWARDS,
  formatICC 
} from '@/lib/iccRewards'

interface ICCWalletProps {
  userAddress: string
  totalBalance?: number
  showTransactionHistory?: boolean
  compact?: boolean
}

export default function ICCWallet({ 
  userAddress,
  totalBalance = 1850,
  showTransactionHistory = true,
  compact = false
}: ICCWalletProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'earned' | 'spent'>('all')
  const [showAllTransactions, setShowAllTransactions] = useState(false)

  // Calculate statistics
  const totalEarned = MOCK_RECENT_REWARDS.reduce((sum, reward) => sum + reward.amount, 0)
  const weeklyEarnings = MOCK_RECENT_REWARDS
    .filter(reward => new Date(reward.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, reward) => sum + reward.amount, 0)

  const getActionIcon = (action: string) => {
    if (action.includes('VOTE')) return '🗳️'
    if (action.includes('PROPOSAL')) return '📝'
    if (action.includes('COMMENT')) return '💬'
    if (action.includes('ACHIEVEMENT')) return '🏆'
    if (action.includes('DAILY')) return '📅'
    return '⭐'
  }

  const getActionColor = (action: string) => {
    if (action.includes('VOTE')) return 'text-blue-600 bg-blue-50'
    if (action.includes('PROPOSAL')) return 'text-green-600 bg-green-50'
    if (action.includes('COMMENT')) return 'text-purple-600 bg-purple-50'
    if (action.includes('ACHIEVEMENT')) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  const TransactionRow = ({ reward }: { reward: ICCReward }) => (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="text-2xl">{getActionIcon(reward.action)}</div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">
          {reward.description}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatTimeAgo(reward.timestamp)}</span>
          {reward.transactionHash && (
            <>
              <span>•</span>
              <button 
                className="hover:text-blue-600 underline"
                onClick={() => window.open(`https://etherscan.io/tx/${reward.transactionHash}`, '_blank')}
              >
                View Tx
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <div className="flex items-center gap-1">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
          <span className="font-semibold text-green-600">
            +{formatICC(reward.amount)}
          </span>
        </div>
        <Badge 
          variant="outline" 
          className={`text-xs ${getActionColor(reward.action)}`}
        >
          {reward.action.replace(/_/g, ' ').toLowerCase()}
        </Badge>
      </div>
    </div>
  )

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">I₵C Wallet</h3>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {formatICC(totalBalance)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              +{formatICC(weeklyEarnings)}
            </div>
            <div className="text-xs text-gray-500">This Week</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {MOCK_RECENT_REWARDS.length}
            </div>
            <div className="text-xs text-gray-500">Transactions</div>
          </div>
        </div>
        
        {showTransactionHistory && (
          <div className="mt-4 space-y-2">
            {MOCK_RECENT_REWARDS.slice(0, 3).map((reward) => (
              <div key={reward.id} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{reward.description}</span>
                <span className="text-green-600 font-medium ml-2">
                  +{reward.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance Header */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wallet className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">I₵C Wallet</h2>
          </div>
          
          <div className="text-4xl font-bold text-yellow-600 mb-2">
            {formatICC(totalBalance)}
          </div>
          
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+{formatICC(weeklyEarnings)} this week</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <Gift className="w-4 h-4" />
              <span>{formatICC(totalEarned)} total earned</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            +{formatICC(weeklyEarnings)}
          </div>
          <div className="text-gray-600 text-sm">Weekly Earnings</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {MOCK_RECENT_REWARDS.length}
          </div>
          <div className="text-gray-600 text-sm">Total Transactions</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {Math.round(totalEarned / MOCK_RECENT_REWARDS.length)}
          </div>
          <div className="text-gray-600 text-sm">Avg per Transaction</div>
        </Card>
      </div>

      {/* Earning Opportunities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Earning Opportunities
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🗳️</div>
            <div className="font-semibold text-blue-900">{ICC_REWARDS.VOTE_CAST.amount} I₵C</div>
            <div className="text-blue-700 text-sm">{ICC_REWARDS.VOTE_CAST.description}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold text-green-900">{ICC_REWARDS.PROPOSAL_CREATED.amount} I₵C</div>
            <div className="text-green-700 text-sm">{ICC_REWARDS.PROPOSAL_CREATED.description}</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-semibold text-purple-900">{ICC_REWARDS.COMMENT_POSTED.amount} I₵C</div>
            <div className="text-purple-700 text-sm">{ICC_REWARDS.COMMENT_POSTED.description}</div>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      {showTransactionHistory && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              Transaction History
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Filter Buttons */}
              <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
                <Button
                  variant={selectedFilter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === 'earned' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedFilter('earned')}
                  className="text-xs"
                >
                  Earned
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-1">
            {(showAllTransactions ? MOCK_RECENT_REWARDS : MOCK_RECENT_REWARDS.slice(0, 5))
              .map((reward) => (
                <TransactionRow key={reward.id} reward={reward} />
              ))}
          </div>
          
          {!showAllTransactions && MOCK_RECENT_REWARDS.length > 5 && (
            <div className="text-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAllTransactions(true)}
              >
                Show All Transactions ({MOCK_RECENT_REWARDS.length})
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
