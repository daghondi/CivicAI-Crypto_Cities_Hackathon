import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resolveENS } from '@/lib/thirdweb'

// GET /api/users/[address] - Get user profile by wallet address
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Get user badges
    const { data: badges, error: badgesError } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_profile_id', profile?.id || '')

    if (badgesError && badgesError.code !== 'PGRST116') {
      console.error('Badges fetch error:', badgesError)
    }

    // Get vote history
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select(`
        *,
        proposals:proposal_id (title, category, status)
      `)
      .eq('wallet_address', address.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(20)

    if (votesError) {
      console.error('Votes fetch error:', votesError)
    }

    // If no profile exists, create a basic one
    let userProfile = profile
    if (!profile) {
      // Try to resolve ENS
      const ensName = await resolveENS(address)
      
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          wallet_address: address.toLowerCase(),
          ens_name: ensName,
          reputation_score: 0,
          total_votes: 0
        })
        .select()
        .single()

      if (createError) {
        console.error('Profile creation error:', createError)
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }

      userProfile = newProfile
    }

    return NextResponse.json({
      profile: userProfile,
      badges: badges || [],
      voteHistory: votes || [],
      stats: {
        totalVotes: votes?.length || 0,
        reputationScore: userProfile?.reputation_score || 0,
        badgeCount: badges?.length || 0
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/users/[address] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params
    const body = await request.json()
    const { username, bio, avatar_url } = body

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    // Update user profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({
        username,
        bio,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', address.toLowerCase())
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile, message: 'Profile updated successfully' })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
