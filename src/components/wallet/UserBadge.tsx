'use client'

import { useWeb3 } from '@/components/providers/Web3Provider'
import { Badge } from '@/components/ui/Badge'
import { useState, useEffect } from 'react'

interface UserProfile {
  username: string
  reputation: number
  isVerified: boolean
  avatar?: string
}

interface UserBadgeProps {
  address?: string
  showReputation?: boolean
  showVerified?: boolean
}

export default function UserBadge({ 
  address, 
  showReputation = true, 
  showVerified = true 
}: UserBadgeProps) {
  const { address: connectedAddress } = useWeb3()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  const walletAddress = address || connectedAddress

  // Mock ENS-style user data
  useEffect(() => {
    if (walletAddress) {
      // In a real app, this would fetch from ENS or your user database
      const mockProfiles: Record<string, UserProfile> = {
        default: {
          username: `civic-${walletAddress.slice(-4)}`,
          reputation: Math.floor(Math.random() * 100) + 50,
          isVerified: Math.random() > 0.5,
        }
      }
      
      setUserProfile(mockProfiles.default)
    }
  }, [walletAddress])

  if (!walletAddress || !userProfile) {
    return null
  }

  const getReputationColor = (score: number) => {
    if (score >= 80) return 'text-logo-electric'
    if (score >= 60) return 'text-logo-mint'
    if (score >= 40) return 'text-logo-gold'
    return 'text-text-secondary'
  }

  const getReputationBadge = (score: number) => {
    if (score >= 90) return '🏆'
    if (score >= 80) return '⭐'
    if (score >= 60) return '🥉'
    return '👤'
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <span className="text-lg">
          {getReputationBadge(userProfile.reputation)}
        </span>
        <span className="font-medium text-text-primary">
          {userProfile.username}
        </span>
        {showVerified && userProfile.isVerified && (
          <span className="text-logo-electric text-sm">✓</span>
        )}
      </div>
      
      {showReputation && (
        <Badge 
          variant="secondary" 
          className={`${getReputationColor(userProfile.reputation)} font-medium`}
        >
          {userProfile.reputation} Rep
        </Badge>
      )}
    </div>
  )
}