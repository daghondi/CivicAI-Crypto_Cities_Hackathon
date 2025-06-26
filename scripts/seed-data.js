#!/usr/bin/env node

/**
 * CivicAI Database Seeding Script
 * Seeds the database with sample proposals, users, and votes for development and testing
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample proposals data
const sampleProposals = [
  {
    title: 'Smart Traffic Light System for Downtown',
    description: 'Implement AI-powered traffic lights to reduce congestion and improve traffic flow in the downtown area. The system would use real-time traffic data and pedestrian sensors to optimize signal timing.',
    category: 'transportation',
    status: 'active',
    created_by: '0x742d35Cc6527C97B7e8c4E0Aa2C3e9f3d5A8F1E7',
    ai_generated: true,
    budget_estimate: 250000,
    implementation_timeline: '6 months',
    expected_impact: 'Reduce traffic congestion by 30% and improve pedestrian safety'
  },
  {
    title: 'Community Solar Energy Program',
    description: 'Establish a community solar garden that allows residents to subscribe to clean energy without installing panels on their property. This program would reduce energy costs and carbon emissions.',
    category: 'environment',
    status: 'active',
    created_by: '0x123456789abcdef0123456789abcdef012345678',
    ai_generated: true,
    budget_estimate: 500000,
    implementation_timeline: '12 months',
    expected_impact: 'Reduce community carbon footprint by 20% and save residents 15% on energy bills'
  },
  {
    title: 'Digital Municipal Services Platform',
    description: 'Create a comprehensive online platform for residents to access municipal services, pay bills, submit permits, and engage with local government. Include mobile app and multilingual support.',
    category: 'governance',
    status: 'draft',
    created_by: '0x987654321fedcba9876543210fedcba987654321',
    ai_generated: false,
    budget_estimate: 150000,
    implementation_timeline: '8 months',
    expected_impact: 'Improve service efficiency by 40% and increase citizen satisfaction'
  },
  {
    title: 'Community Garden and Food Security Initiative',
    description: 'Develop community gardens in underutilized spaces to promote food security, community engagement, and environmental education. Include composting program and skill-sharing workshops.',
    category: 'social',
    status: 'active',
    created_by: '0xabcdef0123456789abcdef0123456789abcdef01',
    ai_generated: true,
    budget_estimate: 75000,
    implementation_timeline: '4 months',
    expected_impact: 'Provide fresh produce access to 500+ families and create 20 community spaces'
  },
  {
    title: 'Small Business Incubator Program',
    description: 'Launch a business incubator to support local entrepreneurs with mentorship, funding, and workspace. Focus on sustainable businesses and tech startups that benefit the community.',
    category: 'economic',
    status: 'review',
    created_by: '0x456789abcdef0123456789abcdef0123456789ab',
    ai_generated: false,
    budget_estimate: 300000,
    implementation_timeline: '18 months',
    expected_impact: 'Create 100+ jobs and launch 25+ new businesses'
  },
  {
    title: 'Flood Resilience Infrastructure Upgrade',
    description: 'Upgrade stormwater infrastructure and implement green solutions like rain gardens and permeable surfaces to manage flooding risks during heavy rainfall events.',
    category: 'infrastructure',
    status: 'active',
    created_by: '0x789abcdef0123456789abcdef0123456789abcdef',
    ai_generated: true,
    budget_estimate: 800000,
    implementation_timeline: '24 months',
    expected_impact: 'Protect 1,000+ properties from flood damage and improve water quality'
  }
]

// Sample user profiles
const sampleUserProfiles = [
  {
    wallet_address: '0x742d35Cc6527C97B7e8c4E0Aa2C3e9f3d5A8F1E7',
    username: 'civic_pioneer',
    bio: 'Urban planning enthusiast working to make our city smarter and more sustainable.',
    reputation_score: 45,
    total_votes: 12
  },
  {
    wallet_address: '0x123456789abcdef0123456789abcdef012345678',
    username: 'green_advocate',
    bio: 'Environmental activist focused on clean energy and sustainability initiatives.',
    reputation_score: 38,
    total_votes: 8
  },
  {
    wallet_address: '0x987654321fedcba9876543210fedcba987654321',
    username: 'tech_citizen',
    bio: 'Software developer passionate about digital governance and civic tech.',
    reputation_score: 52,
    total_votes: 15
  },
  {
    wallet_address: '0xabcdef0123456789abcdef0123456789abcdef01',
    username: 'community_builder',
    bio: 'Community organizer working on food security and neighborhood engagement.',
    reputation_score: 31,
    total_votes: 6
  },
  {
    wallet_address: '0x456789abcdef0123456789abcdef0123456789ab',
    username: 'biz_mentor',
    bio: 'Serial entrepreneur supporting local business development and economic growth.',
    reputation_score: 29,
    total_votes: 7
  }
]

// Sample user badges
const sampleBadges = [
  { wallet_address: '0x742d35Cc6527C97B7e8c4E0Aa2C3e9f3d5A8F1E7', badge_type: 'active_citizen', badge_name: 'Active Citizen', badge_description: 'Voted on 5 or more proposals' },
  { wallet_address: '0x987654321fedcba9876543210fedcba987654321', badge_type: 'community_leader', badge_name: 'Community Leader', badge_description: 'Voted on 20 or more proposals' },
  { wallet_address: '0x123456789abcdef0123456789abcdef012345678', badge_type: 'first_vote', badge_name: 'First Vote', badge_description: 'Participated in their first civic vote' },
  { wallet_address: '0x123456789abcdef0123456789abcdef012345678', badge_type: 'active_citizen', badge_name: 'Active Citizen', badge_description: 'Voted on 5 or more proposals' }
]

// Generate sample votes for proposals
const generateSampleVotes = (proposalIds) => {
  const votes = []
  const voterAddresses = [
    '0x742d35Cc6527C97B7e8c4E0Aa2C3e9f3d5A8F1E7',
    '0x123456789abcdef0123456789abcdef012345678',
    '0x987654321fedcba9876543210fedcba987654321',
    '0xabcdef0123456789abcdef0123456789abcdef01',
    '0x456789abcdef0123456789abcdef0123456789ab',
    '0x111222333444555666777888999aaabbbcccddd',
    '0xeeefff000111222333444555666777888999aaa',
    '0xbbbcccdddeeefffaaabbbcccdddeeefffaaabbb'
  ]
  
  const voteTypes = ['for', 'against', 'abstain']
  const reasonings = [
    'This proposal addresses a critical community need.',
    'I support this initiative for long-term sustainability.',
    'Great idea but needs more community input.',
    'Concerned about budget allocation.',
    'This aligns with our community values.',
    'Implementation timeline seems too aggressive.',
    'Excellent environmental benefits.',
    'Need more details on execution plan.'
  ]

  proposalIds.forEach(proposalId => {
    // Generate 3-8 votes per proposal
    const voteCount = Math.floor(Math.random() * 6) + 3
    const shuffledVoters = [...voterAddresses].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < voteCount; i++) {
      const voteType = voteTypes[Math.floor(Math.random() * voteTypes.length)]
      const reasoning = reasonings[Math.floor(Math.random() * reasonings.length)]
      const timestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // Random time in last 30 days
      
      votes.push({
        proposal_id: proposalId,
        wallet_address: shuffledVoters[i],
        vote_type: voteType,
        reasoning: Math.random() > 0.3 ? reasoning : null, // 70% chance of having reasoning
        signature: `0x${'a'.repeat(130)}`, // Mock signature
        timestamp: timestamp,
        weight: 1
      })
    }
  })
  
  return votes
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // 1. Clear existing test data (be careful in production!)
    console.log('🧹 Clearing existing test data...')
    
    // Delete in order to respect foreign key constraints
    await supabase.from('votes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('user_badges').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('user_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('proposals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 2. Insert sample proposals
    console.log('📄 Inserting sample proposals...')
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .insert(sampleProposals)
      .select('id')
    
    if (proposalsError) {
      throw new Error(`Failed to insert proposals: ${proposalsError.message}`)
    }
    
    console.log(`✅ Inserted ${proposals.length} proposals`)
    
    // 3. Insert user profiles
    console.log('👥 Inserting user profiles...')
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .insert(sampleUserProfiles)
      .select('id, wallet_address')
    
    if (profilesError) {
      throw new Error(`Failed to insert user profiles: ${profilesError.message}`)
    }
    
    console.log(`✅ Inserted ${userProfiles.length} user profiles`)
    
    // 4. Insert user badges
    console.log('🏆 Inserting user badges...')
    const badgesWithProfileIds = []
    
    for (const badge of sampleBadges) {
      const profile = userProfiles.find(p => p.wallet_address === badge.wallet_address)
      if (profile) {
        badgesWithProfileIds.push({
          user_profile_id: profile.id,
          badge_type: badge.badge_type,
          badge_name: badge.badge_name,
          badge_description: badge.badge_description
        })
      }
    }
    
    const { error: badgesError } = await supabase
      .from('user_badges')
      .insert(badgesWithProfileIds)
    
    if (badgesError) {
      throw new Error(`Failed to insert badges: ${badgesError.message}`)
    }
    
    console.log(`✅ Inserted ${badgesWithProfileIds.length} badges`)
    
    // 5. Generate and insert sample votes
    console.log('🗳️ Generating sample votes...')
    const proposalIds = proposals.map(p => p.id)
    const sampleVotes = generateSampleVotes(proposalIds)
    
    const { error: votesError } = await supabase
      .from('votes')
      .insert(sampleVotes)
    
    if (votesError) {
      throw new Error(`Failed to insert votes: ${votesError.message}`)
    }
    
    console.log(`✅ Inserted ${sampleVotes.length} votes`)
    
    // 6. Display summary
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('─'.repeat(50))
    console.log(`📊 Summary:`)
    console.log(`   • ${proposals.length} proposals created`)
    console.log(`   • ${userProfiles.length} user profiles created`)
    console.log(`   • ${badgesWithProfileIds.length} badges awarded`)
    console.log(`   • ${sampleVotes.length} votes cast`)
    console.log('─'.repeat(50))
    console.log('🚀 Your CivicAI platform is now ready for testing!')
    console.log('Visit http://localhost:3000 to explore the seeded data.')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

// Run the seeding process
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
