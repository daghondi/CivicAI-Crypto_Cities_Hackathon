import { useState, useEffect } from 'react'
import type {
  UserProfile,
  DiscussionCategory,
  DiscussionThread,
  DiscussionReply,
  ProposalComment,
  Notification,
  Achievement,
  CommunityStats,
  PaginatedResponse,
  ApiResponse
} from '@/types/community'

const API_BASE = '/api/community'

// Custom hook for community API calls
function useApi() {
  const getAuthHeaders = () => {
    const token = localStorage.getItem('session_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const apiCall = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const authHeaders = getAuthHeaders()
      const headers = new Headers()
      
      // Set base headers
      headers.set('Content-Type', 'application/json')
      
      // Add auth headers if available
      if (authHeaders.Authorization) {
        headers.set('Authorization', authHeaders.Authorization)
      }

      // Add any additional headers from options
      if (options.headers) {
        const additionalHeaders = new Headers(options.headers)
        additionalHeaders.forEach((value, key) => {
          headers.set(key, value)
        })
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API call failed:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  return { apiCall }
}

// User Profile Hook
export function useUserProfile(address?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchProfile = async (userAddress: string) => {
    setLoading(true)
    setError(null)

    const response = await apiCall<UserProfile>(`/profiles/${userAddress}`)
    
    if (response.success && response.data) {
      setProfile(response.data)
    } else {
      setError(response.error || 'Failed to fetch profile')
    }
    
    setLoading(false)
  }

  const updateProfile = async (
    userAddress: string,
    updates: Partial<UserProfile>
  ) => {
    const response = await apiCall<UserProfile>(`/profiles/${userAddress}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })

    if (response.success && response.data) {
      setProfile(response.data)
      return response.data
    } else {
      throw new Error(response.error || 'Failed to update profile')
    }
  }

  useEffect(() => {
    if (address) {
      fetchProfile(address)
    }
  }, [address])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: () => address && fetchProfile(address)
  }
}

// Discussion Categories Hook
export function useDiscussionCategories() {
  const [categories, setCategories] = useState<DiscussionCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)

    const response = await apiCall<DiscussionCategory[]>('/categories')
    
    if (response.success && response.data) {
      setCategories(response.data)
    } else {
      setError(response.error || 'Failed to fetch categories')
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  }
}

// Discussion Threads Hook
export function useDiscussionThreads(filters?: {
  category_id?: string
  proposal_id?: string
  search?: string
  page?: number
  limit?: number
}) {
  const [threads, setThreads] = useState<DiscussionThread[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchThreads = async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (filters?.category_id) params.append('category_id', filters.category_id)
    if (filters?.proposal_id) params.append('proposal_id', filters.proposal_id)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const endpoint = `/discussions${queryString ? `?${queryString}` : ''}`

    const response = await apiCall<{
      data: DiscussionThread[]
      pagination: any
    }>(endpoint)
    
    if (response.success && response.data) {
      setThreads(response.data.data)
      setPagination(response.data.pagination)
    } else {
      setError(response.error || 'Failed to fetch threads')
    }
    
    setLoading(false)
  }

  const createThread = async (threadData: {
    title: string
    content: string
    category_id: string
    proposal_id?: string
  }) => {
    const response = await apiCall<DiscussionThread>('/discussions', {
      method: 'POST',
      body: JSON.stringify(threadData),
    })

    if (response.success && response.data) {
      setThreads(prev => [response.data!, ...prev])
      return response.data
    } else {
      throw new Error(response.error || 'Failed to create thread')
    }
  }

  useEffect(() => {
    fetchThreads()
  }, [filters?.category_id, filters?.proposal_id, filters?.search, filters?.page])

  return {
    threads,
    pagination,
    loading,
    error,
    createThread,
    refetch: fetchThreads
  }
}

// Single Discussion Thread Hook
export function useDiscussionThread(threadId?: string) {
  const [thread, setThread] = useState<DiscussionThread & { replies: DiscussionReply[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchThread = async (id: string) => {
    setLoading(true)
    setError(null)

    const response = await apiCall<DiscussionThread & { replies: DiscussionReply[] }>(`/discussions/${id}`)
    
    if (response.success && response.data) {
      setThread(response.data)
    } else {
      setError(response.error || 'Failed to fetch thread')
    }
    
    setLoading(false)
  }

  const createReply = async (replyData: {
    content: string
    parent_reply_id?: string
  }) => {
    if (!threadId) throw new Error('Thread ID is required')

    const response = await apiCall<DiscussionReply>(`/discussions/${threadId}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    })

    if (response.success && response.data) {
      // Add reply to the thread
      setThread(prev => {
        if (!prev) return prev
        
        const newReply = response.data!
        if (!replyData.parent_reply_id) {
          // Top-level reply
          return {
            ...prev,
            replies: [...prev.replies, newReply]
          }
        } else {
          // Nested reply - find parent and add to its replies
          const updateReplies = (replies: DiscussionReply[]): DiscussionReply[] => {
            return replies.map(reply => {
              if (reply.id === replyData.parent_reply_id) {
                return {
                  ...reply,
                  replies: [...(reply.replies || []), newReply]
                }
              } else if (reply.replies) {
                return {
                  ...reply,
                  replies: updateReplies(reply.replies)
                }
              }
              return reply
            })
          }

          return {
            ...prev,
            replies: updateReplies(prev.replies)
          }
        }
      })

      return response.data
    } else {
      throw new Error(response.error || 'Failed to create reply')
    }
  }

  useEffect(() => {
    if (threadId) {
      fetchThread(threadId)
    }
  }, [threadId])

  return {
    thread,
    loading,
    error,
    createReply,
    refetch: () => threadId && fetchThread(threadId)
  }
}

// Proposal Comments Hook
export function useProposalComments(proposalId?: string) {
  const [comments, setComments] = useState<ProposalComment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchComments = async (id: string) => {
    setLoading(true)
    setError(null)

    const response = await apiCall<ProposalComment[]>(`/comments?proposal_id=${id}`)
    
    if (response.success && response.data) {
      setComments(response.data)
    } else {
      setError(response.error || 'Failed to fetch comments')
    }
    
    setLoading(false)
  }

  const createComment = async (commentData: {
    content: string
    parent_comment_id?: string
  }) => {
    if (!proposalId) throw new Error('Proposal ID is required')

    const response = await apiCall<ProposalComment>('/comments', {
      method: 'POST',
      body: JSON.stringify({
        ...commentData,
        proposal_id: proposalId
      }),
    })

    if (response.success && response.data) {
      const newComment = response.data

      if (!commentData.parent_comment_id) {
        // Top-level comment
        setComments(prev => [...prev, newComment])
      } else {
        // Reply - add to parent comment
        setComments(prev => prev.map(comment => {
          if (comment.id === commentData.parent_comment_id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            }
          }
          return comment
        }))
      }

      return response.data
    } else {
      throw new Error(response.error || 'Failed to create comment')
    }
  }

  useEffect(() => {
    if (proposalId) {
      fetchComments(proposalId)
    }
  }, [proposalId])

  return {
    comments,
    loading,
    error,
    createComment,
    refetch: () => proposalId && fetchComments(proposalId)
  }
}

// Voting Hook
export function useVoting() {
  const { apiCall } = useApi()

  const vote = async (targetId: string, voteType: 'upvote' | 'downvote', targetType: 'proposal_comment' | 'discussion_reply') => {
    const response = await apiCall('/votes', {
      method: 'POST',
      body: JSON.stringify({
        target_id: targetId,
        vote_type: voteType,
        target_type: targetType
      }),
    })

    if (!response.success) {
      throw new Error(response.error || 'Failed to vote')
    }

    return response.data
  }

  const getUserVotes = async (targetIds: string[]) => {
    const response = await apiCall<Record<string, string>>(`/votes?target_ids=${targetIds.join(',')}`)
    
    if (response.success) {
      return response.data || {}
    } else {
      throw new Error(response.error || 'Failed to fetch user votes')
    }
  }

  return {
    vote,
    getUserVotes
  }
}

// Notifications Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchNotifications = async (unreadOnly = false, page = 1) => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams({
      page: page.toString(),
      ...(unreadOnly && { unread_only: 'true' })
    })

    const response = await apiCall<{
      data: Notification[]
      pagination: any
    }>(`/notifications?${params}`)
    
    if (response.success && response.data) {
      setNotifications(response.data.data)
      setPagination(response.data.pagination)
    } else {
      setError(response.error || 'Failed to fetch notifications')
    }
    
    setLoading(false)
  }

  const markAsRead = async (notificationIds?: string[], markAll = false) => {
    const response = await apiCall('/notifications', {
      method: 'PUT',
      body: JSON.stringify({
        notification_ids: notificationIds,
        mark_all: markAll
      }),
    })

    if (response.success) {
      if (markAll) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      } else if (notificationIds) {
        setNotifications(prev => prev.map(n => 
          notificationIds.includes(n.id) ? { ...n, is_read: true } : n
        ))
      }
    } else {
      throw new Error(response.error || 'Failed to mark notifications as read')
    }
  }

  return {
    notifications,
    pagination,
    loading,
    error,
    fetchNotifications,
    markAsRead
  }
}

// Community Stats Hook
export function useCommunityStats() {
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    const response = await apiCall<CommunityStats>('/stats')
    
    if (response.success && response.data) {
      setStats(response.data)
    } else {
      setError(response.error || 'Failed to fetch community stats')
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

// Achievements Hook
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiCall } = useApi()

  const fetchAchievements = async () => {
    setLoading(true)
    setError(null)

    const response = await apiCall<Achievement[]>('/achievements')
    
    if (response.success && response.data) {
      setAchievements(response.data)
    } else {
      setError(response.error || 'Failed to fetch achievements')
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements
  }
}

// Follow Hook
export function useFollow() {
  const { apiCall } = useApi()

  const toggleFollow = async (followingAddress: string) => {
    const response = await apiCall('/follow', {
      method: 'POST',
      body: JSON.stringify({ following_address: followingAddress }),
    })

    if (!response.success) {
      throw new Error(response.error || 'Failed to toggle follow')
    }

    return response.data
  }

  const getFollowStatus = async (followingAddress: string) => {
    const response = await apiCall<{ is_following: boolean }>(`/follow?following_address=${followingAddress}`)
    
    if (response.success) {
      return response.data?.is_following || false
    } else {
      throw new Error(response.error || 'Failed to check follow status')
    }
  }

  return {
    toggleFollow,
    getFollowStatus
  }
}
