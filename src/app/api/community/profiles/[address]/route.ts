import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/profiles/[address] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params

    // Get user profile with related data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_achievements (
          id,
          earned_at,
          achievements (
            id,
            name,
            description,
            icon,
            badge_color,
            points_reward
          )
        ),
        follower_count:user_follows!following_address(count),
        following_count:user_follows!follower_address(count)
      `)
      .eq('address', address.toLowerCase())
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_address', address.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(10)

    // Get reputation events
    const { data: reputationEvents } = await supabase
      .from('reputation_events')
      .select('*')
      .eq('user_address', address.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        recent_activity: recentActivity || [],
        reputation_events: reputationEvents || []
      }
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

// PUT /api/community/profiles/[address] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params
    const body = await request.json()

    // Validate auth (basic implementation - extend with proper auth middleware)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate input
    const allowedFields = [
      'username',
      'display_name',
      'bio',
      'avatar_url',
      'location',
      'website',
      'twitter_handle',
      'github_handle'
    ]

    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    )

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from('user_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('address', address.toLowerCase())
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_address: address.toLowerCase(),
        activity_type: 'profile_updated',
        activity_data: { updated_fields: Object.keys(updateData) },
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      data: updatedProfile
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
