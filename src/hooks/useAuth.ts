import { useState, useEffect } from 'react'
import { useWeb3 } from '@/components/providers/Web3Provider'

interface AuthUser {
  walletAddress: string
  ensName?: string
  isAuthenticated: boolean
  profile?: {
    username?: string
    bio?: string
    reputationScore: number
    totalVotes: number
    badges: string[]
  }
}

export const useAuth = () => {
  const { address, ensName, isConnected, connect, disconnect } = useWeb3()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchUserProfile(address)
    } else {
      setUser(null)
    }
  }, [isConnected, address])

  const fetchUserProfile = async (walletAddress: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${walletAddress}`)
      const data = await response.json()

      if (response.ok) {
        setUser({
          walletAddress,
          ensName: data.profile?.ens_name || ensName,
          isAuthenticated: true,
          profile: {
            username: data.profile?.username,
            bio: data.profile?.bio,
            reputationScore: data.stats?.reputationScore || 0,
            totalVotes: data.stats?.totalVotes || 0,
            badges: data.badges?.map((b: any) => b.badge_name) || []
          }
        })
      } else {
        throw new Error(data.error || 'Failed to fetch user profile')
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err)
      setError(err.message)
      // Still set basic user info even if profile fetch fails
      setUser({
        walletAddress,
        ensName: ensName || undefined,
        isAuthenticated: true
      })
    } finally {
      setLoading(false)
    }
  }

  const login = async () => {
    try {
      setError(null)
      await connect()
      // Profile will be fetched automatically via useEffect
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet')
      console.error('Login error:', err)
    }
  }

  const logout = () => {
    disconnect()
    setUser(null)
    setError(null)
  }

  const updateProfile = async (updates: { username?: string; bio?: string }) => {
    if (!user?.walletAddress) return false

    try {
      setLoading(true)
      const response = await fetch(`/api/users/${user.walletAddress}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        // Refresh user profile
        await fetchUserProfile(user.walletAddress)
        return true
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Profile update error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (permission: 'vote' | 'create_proposal' | 'moderate') => {
    if (!user?.isAuthenticated) return false

    switch (permission) {
      case 'vote':
        return true // All authenticated users can vote
      case 'create_proposal':
        return (user.profile?.reputationScore || 0) >= 10 // Need 10+ reputation
      case 'moderate':
        return (user.profile?.reputationScore || 0) >= 100 // Need 100+ reputation
      default:
        return false
    }
  }

  const getUserRole = (): 'new' | 'member' | 'active' | 'leader' | 'moderator' => {
    if (!user?.profile) return 'new'
    
    const reputation = user.profile.reputationScore
    const votes = user.profile.totalVotes

    if (reputation >= 100) return 'moderator'
    if (reputation >= 50 || votes >= 20) return 'leader'
    if (reputation >= 20 || votes >= 5) return 'active'
    if (reputation >= 5 || votes >= 1) return 'member'
    return 'new'
  }

  return {
    user,
    loading,
    error,
    isAuthenticated: user?.isAuthenticated || false,
    login,
    logout,
    updateProfile,
    hasPermission,
    getUserRole,
    refreshProfile: () => user?.walletAddress ? fetchUserProfile(user.walletAddress) : null
  }
}
