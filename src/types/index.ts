// Core User Types
export interface User {
  id: string
  wallet_address: string
  display_name?: string
  ens_name?: string
  email?: string
  avatar_url?: string
  reputation_score: number
  is_verified: boolean
  badges?: UserBadge[]
  vote_count?: number
  proposal_count?: number
  created_at: string
  updated_at?: string
  last_login?: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_type: BadgeType
  earned_at: string
  metadata?: Record<string, any>
}

export type BadgeType = 
  | 'first_vote'
  | 'active_participant'
  | 'proposal_creator'
  | 'governance_expert'
  | 'community_leader'
  | 'early_adopter'
  | 'verified_citizen'

// Proposal Types
export interface Proposal {
  id: string
  title: string
  description: string
  category: ProposalCategory
  status: ProposalStatus
  created_by: string
  creator_address?: string
  created_at: string
  updated_at?: string
  voting_deadline: string
  impact_score: number
  cost_estimate?: number
  timeline?: string
  feasibility_score?: number
  potential_risks?: string[]
  recommendations?: string[]
  icc_incentives?: string
  votes_for?: number
  votes_against?: number
  votes_abstain?: number
  total_votes?: number
  ai_analysis?: AIAnalysis
  attachments?: Attachment[]
  on_chain_id?: string | null  // For tracking blockchain proposal ID
  transaction_hash?: string      // Transaction hash of on-chain creation
  is_on_chain?: boolean         // Whether proposal was created on-chain
}

export type ProposalCategory = 
  | 'infrastructure'
  | 'transportation'
  | 'environment'
  | 'economic'
  | 'healthcare'
  | 'education'
  | 'safety'
  | 'technology'
  | 'governance'
  | 'social'
  | 'other'

export type ProposalStatus = 
  | 'draft'
  | 'active'
  | 'passed'
  | 'failed'
  | 'expired'
  | 'implemented'

// Vote Types
export interface Vote {
  id: string
  proposal_id: string
  user_id?: string
  wallet_address: string
  vote_type: 'for' | 'against' | 'abstain'
  weight?: number
  reasoning?: string
  signature: string
  message_hash: string
  timestamp: number
  created_at: string
  is_on_chain?: boolean         // Whether vote was cast on-chain
  transaction_hash?: string     // Transaction hash of on-chain vote
}

export interface VoteStats {
  total_votes: number
  votes_for: number
  votes_against: number
  votes_abstain: number
  for_percentage: number
  against_percentage: number
  abstain_percentage: number
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

// Attachment Types
export interface Attachment {
  id: string
  proposal_id: string
  filename: string
  file_url: string
  file_type: string
  file_size: number
  uploaded_by: string
  uploaded_at: string
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

// Web3 and Wallet Types
export interface Web3ContextType {
  address?: string
  isConnected: boolean
  isConnecting: boolean
  chainId?: number
  provider?: any
  signer?: any
  connect: () => Promise<void>
  disconnect: () => void
  signMessage: (message: string) => Promise<string>
  switchChain: (chainId: number) => Promise<void>
}

export interface SignatureData {
  signature: string
  messageHash: string
  timestamp: number
}

// AI and Proposal Generation Types
export interface AIProposalRequest {
  problem: string
  category: ProposalCategory
  location?: string
  urgency?: 'low' | 'medium' | 'high'
}

export interface AIProposalResponse {
  title: string
  description: string
  category: ProposalCategory
  impact_score: number
  cost_estimate?: number
  timeline?: string
  feasibility_score?: number
  potential_risks?: string[]
  recommendations?: string[]
  icc_incentives?: string
}

// Governance Types
export interface GovernanceConfig {
  proposalThreshold: number
  votingDelay: number
  votingPeriod: number
  quorumPercentage: number
  executionDelay: number
}

export interface ReputationScore {
  total: number
  votes_cast: number
  proposals_created: number
  community_engagement: number
  governance_participation: number
}

// Form Types
export interface ProblemSubmissionData {
  problem: string
  category: ProposalCategory
  location?: string
  urgency: 'low' | 'medium' | 'high'
  description?: string
}

// Enhanced API Response Types
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}