-- Additional proposal-related enhancements
-- Add Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Proposals policies
CREATE POLICY "Anyone can view approved proposals" ON proposals
  FOR SELECT USING (status IN ('voting', 'approved', 'rejected', 'implemented'));

CREATE POLICY "Users can view their own drafts" ON proposals
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create proposals" ON proposals
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own drafts" ON proposals
  FOR UPDATE USING (created_by = auth.uid() AND status = 'draft');

-- Votes policies
CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON votes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own votes" ON votes
  FOR UPDATE USING (user_id = auth.uid());

-- AI Analysis policies
CREATE POLICY "Anyone can view AI analysis" ON ai_analysis
  FOR SELECT USING (true);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_proposal_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE proposals 
    SET current_votes = current_votes + 1 
    WHERE id = NEW.proposal_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE proposals 
    SET current_votes = current_votes - 1 
    WHERE id = OLD.proposal_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote count updates
CREATE TRIGGER update_vote_count_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_proposal_vote_count();