-- Sample data and user-related enhancements

-- Insert sample users
INSERT INTO users (id, email, username, avatar_url, wallet_address, reputation_score, is_verified) VALUES
  ('11111111-1111-1111-1111-111111111111', 'demo@civicai.com', 'demo_user', NULL, '0x1234567890123456789012345678901234567890', 100, true),
  ('22222222-2222-2222-2222-222222222222', 'alice@prospera.hn', 'alice_prospera', NULL, '0x2345678901234567890123456789012345678901', 85, true),
  ('33333333-3333-3333-3333-333333333333', 'bob@roatan.hn', 'bob_roatan', NULL, '0x3456789012345678901234567890123456789012', 72, false);

-- Insert sample proposals
INSERT INTO proposals (id, title, description, category, status, created_by, voting_ends_at, required_votes, impact_score) VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    'Improve Road Between Pristine Bay and Duna',
    'The current road connection between Pristine Bay and Duna is in poor condition, causing daily commute issues for residents. This proposal suggests paving the road and adding proper drainage to ensure all-weather accessibility.',
    'transportation',
    'voting',
    '11111111-1111-1111-1111-111111111111',
    NOW() + INTERVAL '7 days',
    10,
    85
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Community Waste Management System',
    'Implement a comprehensive waste management system for the island community, including recycling centers and regular pickup services.',
    'environment',
    'voting',
    '22222222-2222-2222-2222-222222222222',
    NOW() + INTERVAL '5 days',
    15,
    78
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Digital Governance Platform Enhancement',
    'Expand the current digital governance platform to include better mobile accessibility and real-time proposal tracking.',
    'technology',
    'draft',
    '33333333-3333-3333-3333-333333333333',
    NULL,
    8,
    65
  );

-- Insert sample votes
INSERT INTO votes (proposal_id, user_id, vote_type, reasoning) VALUES
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'for', 'This would significantly improve my daily commute'),
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'for', 'Essential infrastructure improvement'),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'for', 'Environmental sustainability is crucial'),
  ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'against', 'Cost seems too high for the proposed solution');

-- Insert sample AI analysis
INSERT INTO ai_analysis (proposal_id, feasibility_score, impact_prediction, cost_estimate, implementation_timeline, potential_risks, recommendations) VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    88,
    85,
    25000.00,
    '3-4 months',
    '["Weather delays during rainy season", "Potential traffic disruption during construction"]'::jsonb,
    '["Coordinate with local contractors", "Plan construction during dry season", "Set up temporary routes"]'::jsonb
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    75,
    78,
    15000.00,
    '2-3 months',
    '["Community adoption challenges", "Ongoing maintenance costs"]'::jsonb,
    '["Community education program", "Partner with local environmental groups", "Establish maintenance fund"]'::jsonb
  );