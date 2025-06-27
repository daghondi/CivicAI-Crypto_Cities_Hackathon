-- Function to update user reputation
CREATE OR REPLACE FUNCTION update_user_reputation(user_addr TEXT, points_delta INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO user_profiles (address, reputation_score, created_at, updated_at)
  VALUES (
    user_addr,
    points_delta,
    NOW(),
    NOW()
  )
  ON CONFLICT (address)
  DO UPDATE SET
    reputation_score = user_profiles.reputation_score + points_delta,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(user_addr TEXT)
RETURNS void AS $$
DECLARE
  user_stats RECORD;
  achievement RECORD;
BEGIN
  -- Get user statistics
  SELECT 
    u.reputation_score,
    COUNT(DISTINCT v.id) as vote_count,
    COUNT(DISTINCT p.id) as proposal_count,
    COUNT(DISTINCT dt.id) as thread_count,
    COUNT(DISTINCT pc.id) as comment_count
  INTO user_stats
  FROM user_profiles u
  LEFT JOIN votes v ON v.wallet_address = u.address
  LEFT JOIN proposals p ON p.created_by = u.address
  LEFT JOIN discussion_threads dt ON dt.author_address = u.address
  LEFT JOIN proposal_comments pc ON pc.author_address = u.address
  WHERE u.address = user_addr
  GROUP BY u.address, u.reputation_score;

  -- Check each achievement
  FOR achievement IN SELECT * FROM achievements WHERE is_active = true LOOP
    -- Skip if user already has this achievement
    IF EXISTS (
      SELECT 1 FROM user_achievements 
      WHERE user_address = user_addr AND achievement_id = achievement.id
    ) THEN
      CONTINUE;
    END IF;

    -- Check achievement criteria
    CASE achievement.name
      WHEN 'First Vote' THEN
        IF user_stats.vote_count >= 1 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
      
      WHEN 'Active Citizen' THEN
        IF user_stats.vote_count >= 5 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
      
      WHEN 'Community Leader' THEN
        IF user_stats.vote_count >= 20 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
      
      WHEN 'Proposal Creator' THEN
        IF user_stats.proposal_count >= 1 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
      
      WHEN 'Discussion Starter' THEN
        IF user_stats.thread_count >= 3 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
      
      WHEN 'Civic Commentator' THEN
        IF user_stats.comment_count >= 10 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
      
      WHEN 'Reputation Master' THEN
        IF user_stats.reputation_score >= 500 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
      
      WHEN 'Civic Pioneer' THEN
        IF user_stats.reputation_score >= 100 AND user_stats.vote_count >= 10 THEN
          INSERT INTO user_achievements (user_address, achievement_id, earned_at)
          VALUES (user_addr, achievement.id, NOW());
        END IF;
    END CASE;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
