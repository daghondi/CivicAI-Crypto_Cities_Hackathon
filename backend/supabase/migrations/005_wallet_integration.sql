-- Add wallet integration columns to votes table
ALTER TABLE votes 
ADD COLUMN wallet_address TEXT,
ADD COLUMN signature TEXT,
ADD COLUMN timestamp BIGINT;

-- Create index for wallet_address lookups
CREATE INDEX IF NOT EXISTS idx_votes_wallet_address ON votes(wallet_address);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_wallet ON votes(proposal_id, wallet_address);

-- Update votes table to make user_id optional (for wallet-only votes)
ALTER TABLE votes ALTER COLUMN user_id DROP NOT NULL;

-- Create users table enhancement for wallet profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  ens_name TEXT,
  username TEXT,
  bio TEXT,
  avatar_url TEXT,
  reputation_score INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for wallet address lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet ON user_profiles(wallet_address);

-- Create badges table for user achievements
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL, -- 'early_voter', 'active_citizen', 'proposal_creator', etc.
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user badges
CREATE INDEX IF NOT EXISTS idx_user_badges_profile ON user_badges(user_profile_id);

-- Function to update user profile stats when votes are added
CREATE OR REPLACE FUNCTION update_user_vote_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or create user profile
  INSERT INTO user_profiles (wallet_address, total_votes, reputation_score)
  VALUES (NEW.wallet_address, 1, 1)
  ON CONFLICT (wallet_address) 
  DO UPDATE SET 
    total_votes = user_profiles.total_votes + 1,
    reputation_score = user_profiles.reputation_score + 1,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote stats updates
DROP TRIGGER IF EXISTS trigger_update_user_vote_stats ON votes;
CREATE TRIGGER trigger_update_user_vote_stats
  AFTER INSERT ON votes
  FOR EACH ROW
  WHEN (NEW.wallet_address IS NOT NULL)
  EXECUTE FUNCTION update_user_vote_stats();

-- Function to award badges based on activity
CREATE OR REPLACE FUNCTION award_user_badges()
RETURNS TRIGGER AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Get user profile ID
  SELECT id INTO profile_id FROM user_profiles WHERE wallet_address = NEW.wallet_address;
  
  IF profile_id IS NOT NULL THEN
    -- Award "First Vote" badge
    IF NEW.total_votes = 1 THEN
      INSERT INTO user_badges (user_profile_id, badge_type, badge_name, badge_description)
      VALUES (profile_id, 'first_vote', 'First Vote', 'Participated in their first civic vote')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Award "Active Citizen" badge for 5+ votes
    IF NEW.total_votes >= 5 THEN
      INSERT INTO user_badges (user_profile_id, badge_type, badge_name, badge_description)
      VALUES (profile_id, 'active_citizen', 'Active Citizen', 'Voted on 5 or more proposals')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Award "Community Leader" badge for 20+ votes
    IF NEW.total_votes >= 20 THEN
      INSERT INTO user_badges (user_profile_id, badge_type, badge_name, badge_description)
      VALUES (profile_id, 'community_leader', 'Community Leader', 'Voted on 20 or more proposals')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for badge awards
DROP TRIGGER IF EXISTS trigger_award_user_badges ON user_profiles;
CREATE TRIGGER trigger_award_user_badges
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  WHEN (NEW.total_votes > OLD.total_votes)
  EXECUTE FUNCTION award_user_badges();
