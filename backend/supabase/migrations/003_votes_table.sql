-- Additional vote-related features and sample data

-- Create function to get vote statistics
CREATE OR REPLACE FUNCTION get_vote_stats(proposal_uuid UUID)
RETURNS TABLE (
  total_votes BIGINT,
  for_votes BIGINT,
  against_votes BIGINT,
  abstain_votes BIGINT,
  support_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_votes,
    COUNT(*) FILTER (WHERE vote_type = 'for') as for_votes,
    COUNT(*) FILTER (WHERE vote_type = 'against') as against_votes,
    COUNT(*) FILTER (WHERE vote_type = 'abstain') as abstain_votes,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE vote_type = 'for') * 100.0 / COUNT(*)), 2)
    END as support_percentage
  FROM votes 
  WHERE proposal_id = proposal_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create view for proposal summary with vote stats
CREATE OR REPLACE VIEW proposal_summary AS
SELECT 
  p.*,
  u.username as created_by_username,
  u.avatar_url as created_by_avatar,
  COALESCE(v.total_votes, 0) as total_votes,
  COALESCE(v.for_votes, 0) as for_votes,
  COALESCE(v.against_votes, 0) as against_votes,
  COALESCE(v.abstain_votes, 0) as abstain_votes,
  COALESCE(v.support_percentage, 0) as support_percentage,
  ai.feasibility_score,
  ai.impact_prediction,
  ai.cost_estimate
FROM proposals p
LEFT JOIN users u ON p.created_by = u.id
LEFT JOIN LATERAL get_vote_stats(p.id) v ON true
LEFT JOIN ai_analysis ai ON p.id = ai.proposal_id;