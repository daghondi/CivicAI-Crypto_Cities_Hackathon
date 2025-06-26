export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          wallet_address: string | null
          reputation_score: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          avatar_url?: string | null
          wallet_address?: string | null
          reputation_score?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          wallet_address?: string | null
          reputation_score?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          title: string
          description: string
          category: 'infrastructure' | 'environment' | 'economy' | 'healthcare' | 'education' | 'transportation' | 'housing' | 'safety' | 'technology' | 'governance'
          status: 'draft' | 'submitted' | 'under_review' | 'voting' | 'approved' | 'rejected' | 'implemented'
          created_by: string
          created_at: string
          updated_at: string
          voting_ends_at: string | null
          required_votes: number
          current_votes: number
          impact_score: number
          location_data: Json | null
          attachments: Json
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'infrastructure' | 'environment' | 'economy' | 'healthcare' | 'education' | 'transportation' | 'housing' | 'safety' | 'technology' | 'governance'
          status?: 'draft' | 'submitted' | 'under_review' | 'voting' | 'approved' | 'rejected' | 'implemented'
          created_by: string
          created_at?: string
          updated_at?: string
          voting_ends_at?: string | null
          required_votes?: number
          current_votes?: number
          impact_score?: number
          location_data?: Json | null
          attachments?: Json
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'infrastructure' | 'environment' | 'economy' | 'healthcare' | 'education' | 'transportation' | 'housing' | 'safety' | 'technology' | 'governance'
          status?: 'draft' | 'submitted' | 'under_review' | 'voting' | 'approved' | 'rejected' | 'implemented'
          created_by?: string
          created_at?: string
          updated_at?: string
          voting_ends_at?: string | null
          required_votes?: number
          current_votes?: number
          impact_score?: number
          location_data?: Json | null
          attachments?: Json
        }
      }
      votes: {
        Row: {
          id: string
          proposal_id: string
          user_id: string
          vote_type: 'for' | 'against' | 'abstain'
          weight: number
          reasoning: string | null
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          user_id: string
          vote_type: 'for' | 'against' | 'abstain'
          weight?: number
          reasoning?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          user_id?: string
          vote_type?: 'for' | 'against' | 'abstain'
          weight?: number
          reasoning?: string | null
          created_at?: string
        }
      }
      ai_analysis: {
        Row: {
          id: string
          proposal_id: string
          feasibility_score: number | null
          impact_prediction: number | null
          cost_estimate: number | null
          implementation_timeline: string | null
          potential_risks: Json
          recommendations: Json
          similar_proposals: Json
          raw_ai_response: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          feasibility_score?: number | null
          impact_prediction?: number | null
          cost_estimate?: number | null
          implementation_timeline?: string | null
          potential_risks?: Json
          recommendations?: Json
          similar_proposals?: Json
          raw_ai_response?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          feasibility_score?: number | null
          impact_prediction?: number | null
          cost_estimate?: number | null
          implementation_timeline?: string | null
          potential_risks?: Json
          recommendations?: Json
          similar_proposals?: Json
          raw_ai_response?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      proposal_summary: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          status: string
          created_by: string
          created_at: string
          updated_at: string
          voting_ends_at: string | null
          required_votes: number
          current_votes: number
          impact_score: number
          location_data: Json | null
          attachments: Json
          created_by_username: string | null
          created_by_avatar: string | null
          total_votes: number
          for_votes: number
          against_votes: number
          abstain_votes: number
          support_percentage: number
          feasibility_score: number | null
          impact_prediction: number | null
          cost_estimate: number | null
        }
      }
    }
    Functions: {
      get_vote_stats: {
        Args: {
          proposal_uuid: string
        }
        Returns: {
          total_votes: number
          for_votes: number
          against_votes: number
          abstain_votes: number
          support_percentage: number
        }[]
      }
    }
    Enums: {
      proposal_status: 'draft' | 'submitted' | 'under_review' | 'voting' | 'approved' | 'rejected' | 'implemented'
      proposal_category: 'infrastructure' | 'environment' | 'economy' | 'healthcare' | 'education' | 'transportation' | 'housing' | 'safety' | 'technology' | 'governance'
      vote_type: 'for' | 'against' | 'abstain'
    }
  }
}
