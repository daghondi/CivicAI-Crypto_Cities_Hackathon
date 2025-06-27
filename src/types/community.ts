// Community Features Types

export interface UserProfile {
  id: string
  address: string
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
  location?: string
  website?: string
  twitter_handle?: string
  github_handle?: string
  joined_at: string
  last_active_at: string
  is_verified: boolean
  reputation_score: number
  total_icc_earned: number
  governance_participation_score: number
  created_at: string
  updated_at: string
}

export interface ReputationEvent {
  id: string
  user_address: string
  event_type: string
  points: number
  related_id?: string
  related_type?: string
  description?: string
  created_at: string
}

export interface DiscussionCategory {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  sort_order: number
  is_active: boolean
  thread_count?: number
  latest_thread?: DiscussionThread
  created_at: string
}

export interface DiscussionThread {
  id: string
  title: string
  content: string
  category_id: string
  category?: DiscussionCategory
  author_address: string
  author?: UserProfile
  proposal_id?: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  reply_count: number
  last_reply_at?: string
  last_reply_by?: string
  last_reply_author?: UserProfile
  created_at: string
  updated_at: string
}

export interface DiscussionReply {
  id: string
  thread_id: string
  parent_reply_id?: string
  content: string
  author_address: string
  author?: UserProfile
  upvotes: number
  downvotes: number
  user_vote?: 'upvote' | 'downvote' | null
  is_flagged: boolean
  is_deleted: boolean
  replies?: DiscussionReply[]
  created_at: string
  updated_at: string
}

export interface ProposalComment {
  id: string
  proposal_id: string
  parent_comment_id?: string
  author_address: string
  author?: UserProfile
  content: string
  upvotes: number
  downvotes: number
  user_vote?: 'upvote' | 'downvote' | null
  is_flagged: boolean
  is_deleted: boolean
  replies?: ProposalComment[]
  created_at: string
  updated_at: string
}

export interface VoteRecord {
  id: string
  user_address: string
  target_id: string // reply_id or comment_id
  vote_type: 'upvote' | 'downvote'
  created_at: string
}

export interface Notification {
  id: string
  recipient_address: string
  sender_address?: string
  sender?: UserProfile
  type: string
  title: string
  message: string
  related_id?: string
  related_type?: string
  action_url?: string
  is_read: boolean
  created_at: string
}

export interface NotificationPreferences {
  id: string
  user_address: string
  email_notifications: boolean
  proposal_updates: boolean
  comment_replies: boolean
  discussion_mentions: boolean
  governance_updates: boolean
  weekly_digest: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  badge_color: string
  criteria: string
  points_reward: number
  is_active: boolean
  created_at: string
}

export interface UserAchievement {
  id: string
  user_address: string
  achievement_id: string
  achievement: Achievement
  earned_at: string
}

export interface UserFollow {
  id: string
  follower_address: string
  following_address: string
  follower?: UserProfile
  following?: UserProfile
  created_at: string
}

export interface ActivityLog {
  id: string
  user_address: string
  activity_type: string
  activity_data: any
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Community Statistics
export interface CommunityStats {
  total_users: number
  total_threads: number
  total_comments: number
  total_proposals: number
  active_users_today: number
  active_users_week: number
  popular_categories: Array<{
    category: DiscussionCategory
    thread_count: number
  }>
  top_contributors: Array<{
    user: UserProfile
    contribution_score: number
  }>
}

// Form interfaces
export interface CreateThreadForm {
  title: string
  content: string
  category_id: string
  proposal_id?: string
}

export interface CreateReplyForm {
  content: string
  parent_reply_id?: string
}

export interface CreateCommentForm {
  content: string
  parent_comment_id?: string
}

export interface UpdateProfileForm {
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
  location?: string
  website?: string
  twitter_handle?: string
  github_handle?: string
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_next: boolean
  has_prev: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Community engagement metrics
export interface EngagementMetrics {
  daily_active_users: number
  weekly_active_users: number
  monthly_active_users: number
  average_session_duration: number
  proposals_per_week: number
  comments_per_proposal: number
  forum_posts_per_week: number
  top_engaged_users: UserProfile[]
}
