-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE proposal_status AS ENUM (
  'draft', 'submitted', 'under_review', 'voting', 
  'approved', 'rejected', 'implemented'
);

CREATE TYPE proposal_category AS ENUM (
  'infrastructure', 'environment', 'economy', 'healthcare',
  'education', 'transportation', 'housing', 'safety', 
  'technology', 'governance'
);

CREATE TYPE vote_type AS ENUM ('for', 'against', 'abstain');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  wallet_address VARCHAR(42) UNIQUE,
  reputation_score INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category proposal_category NOT NULL,
  status proposal_status DEFAULT 'draft',
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  voting_ends_at TIMESTAMPTZ,
  required_votes INTEGER DEFAULT 10,
  current_votes INTEGER DEFAULT 0,
  impact_score INTEGER DEFAULT 0,
  location_data JSONB,
  attachments JSONB DEFAULT '[]'::jsonb
);

-- Create votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  weight INTEGER DEFAULT 1,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

-- Create ai_analysis table
CREATE TABLE ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  feasibility_score INTEGER CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
  impact_prediction INTEGER CHECK (impact_prediction >= 0 AND impact_prediction <= 100),
  cost_estimate DECIMAL(12,2),
  implementation_timeline TEXT,
  potential_risks JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  similar_proposals JSONB DEFAULT '[]'::jsonb,
  raw_ai_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_category ON proposals(category);
CREATE INDEX idx_proposals_created_by ON proposals(created_by);
CREATE INDEX idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();