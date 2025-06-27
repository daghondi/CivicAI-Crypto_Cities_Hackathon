-- Initial data for community features

-- Insert default discussion categories
INSERT INTO discussion_categories (name, description, color, icon, sort_order) VALUES
('General Discussion', 'General community conversations and announcements', '#3B82F6', '💬', 1),
('Proposals & Governance', 'Discuss active and upcoming proposals', '#10B981', '🏛️', 2),
('Infrastructure', 'Roads, utilities, and city infrastructure topics', '#F59E0B', '🚧', 3),
('Environment', 'Environmental issues and sustainability initiatives', '#059669', '🌱', 4),
('Transportation', 'Public transport, traffic, and mobility solutions', '#8B5CF6', '🚌', 5),
('Community Events', 'Local events, meetups, and social gatherings', '#EF4444', '🎉', 6),
('Economic Development', 'Business, tourism, and economic growth discussions', '#06B6D4', '💼', 7),
('Technology & Innovation', 'Smart city tech, digital services, and innovation', '#6366F1', '⚡', 8),
('Help & Support', 'Get help with the platform and governance process', '#84CC16', '❓', 9);

-- Insert achievement definitions
INSERT INTO achievements (name, description, icon, badge_color, criteria, points_reward) VALUES
('First Steps', 'Created your first profile', '👋', '#10B981', '{"type": "profile_created"}', 10),
('Civic Newcomer', 'Cast your first vote', '🗳️', '#3B82F6', '{"type": "first_vote"}', 25),
('Proposal Pioneer', 'Created your first proposal', '💡', '#F59E0B', '{"type": "first_proposal"}', 50),
('Community Voice', 'Posted your first comment', '💬', '#8B5CF6', '{"type": "first_comment"}', 15),
('Discussion Starter', 'Started your first discussion thread', '🔥', '#EF4444', '{"type": "first_thread"}', 20),
('Active Citizen', 'Voted on 10 proposals', '🏆', '#10B981', '{"type": "vote_count", "threshold": 10}', 100),
('Thought Leader', 'Received 50 upvotes on comments', '⭐', '#F59E0B', '{"type": "upvotes_received", "threshold": 50}', 75),
('Proposal Champion', 'Had a proposal approved and implemented', '🎯', '#059669', '{"type": "proposal_implemented"}', 200),
('Community Builder', 'Started 5 discussion threads', '🏗️', '#06B6D4', '{"type": "threads_created", "threshold": 5}', 60),
('Engagement Expert', 'Received 100 total community interactions', '🚀', '#6366F1', '{"type": "total_interactions", "threshold": 100}', 150),
('Governance Guru', 'Participated in governance for 30 days', '🧠', '#8B5CF6', '{"type": "days_active", "threshold": 30}', 125),
('Reputation Rising', 'Reached 500 reputation points', '📈', '#EF4444', '{"type": "reputation_score", "threshold": 500}', 100),
('Community Connector', 'Following and followed by 20+ users', '🤝', '#84CC16', '{"type": "social_connections", "threshold": 20}', 80),
('Amendment Advocate', 'Proposed 3 successful amendments', '📝', '#F97316', '{"type": "amendments_proposed", "threshold": 3}', 90),
('Delegation Dynamo', 'Successfully delegated voting power', '🔗', '#14B8A6', '{"type": "vote_delegated"}', 40);

-- Insert sample notification preferences for existing users (if any)
-- This would typically be handled by the application when users first connect
