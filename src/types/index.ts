export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  wallet_address?: string
  reputation_score: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Proposal {
  id: string
  title: string
  description: string
  category: ProposalCategory
  status: ProposalStatus
  created_by: string
  created_at: string
  updated_at: string
  voting_ends_at: string
  required_votes: number
  current_votes: number
  impact_score: number
  ai_analysis?: AIAnalysis
  attachments?: Attachment[]
}

export type ProposalCategory = 
  | 'infrastructure'
  | 'environment'
  | 'economy'
  | 'healthcare'
  | 'education'
  | 'transportation'
  | 'housing'
  | 'safety'
  | 'technology'
  | 'governance'

export type ProposalStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'voting'
  | 'approved'
  | 'rejected'
  | 'implemented'

export interface Vote {
  id: string
  proposal_id: string
  user_id: string
  vote_type: 'for' | 'against' | 'abstain'
  weight: number
  reasoning?: string
  created_at: string
}

export interface AIAnalysis {
  id: string
  proposal_id: string
  feasibility_score: number
  impact_prediction: number
  cost_estimate?: number
  implementation_timeline?: string
  potential_risks: string[]
  recommendations: string[]
  similar_proposals: string[]
  created_at: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: string
  context?: 'general' | 'proposal' | 'analysis'
  metadata?: Record<string, any>
}

export interface WalletState {
  address?: string
  isConnected: boolean
  isConnecting: boolean
  chainId?: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
}