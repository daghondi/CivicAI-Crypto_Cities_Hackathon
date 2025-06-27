import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/community/follow - Follow/unfollow user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { following_address } = body

    // Validate auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const sessionData = JSON.parse(Buffer.from(token, 'base64').toString())
    const follower_address = sessionData.address

    if (!following_address) {
      return NextResponse.json(
        { success: false, error: 'following_address is required' },
        { status: 400 }
      )
    }

    if (follower_address.toLowerCase() === following_address.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if already following
    const { data: existingFollow } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_address', follower_address.toLowerCase())
      .eq('following_address', following_address.toLowerCase())
      .single()

    if (existingFollow) {
      // Unfollow
      await supabase
        .from('user_follows')
        .delete()
        .eq('id', existingFollow.id)

      return NextResponse.json({
        success: true,
        data: { action: 'unfollowed' }
      })
    } else {
      // Follow
      const { data: follow, error } = await supabase
        .from('user_follows')
        .insert({
          follower_address: follower_address.toLowerCase(),
          following_address: following_address.toLowerCase(),
          created_at: new Date().toISOString()
        })
        .select(`
          *,
          follower:user_profiles!follower_address(*),
          following:user_profiles!following_address(*)
        `)
        .single()

      if (error) {
        throw error
      }

      // Create notification for followed user
      await supabase
        .from('notifications')
        .insert({
          recipient_address: following_address.toLowerCase(),
          sender_address: follower_address.toLowerCase(),
          type: 'new_follower',
          title: 'New Follower',
          message: 'Someone started following you',
          is_read: false,
          created_at: new Date().toISOString()
        })

      return NextResponse.json({
        success: true,
        data: { action: 'followed', follow }
      })
    }

  } catch (error) {
    console.error('Error processing follow action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process follow action' },
      { status: 500 }
    )
  }
}

// GET /api/community/follow - Get follow status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const following_address = searchParams.get('following_address')

    // Validate auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const sessionData = JSON.parse(Buffer.from(token, 'base64').toString())
    const follower_address = sessionData.address

    if (!following_address) {
      return NextResponse.json(
        { success: false, error: 'following_address is required' },
        { status: 400 }
      )
    }

    // Check if following
    const { data: follow } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_address', follower_address.toLowerCase())
      .eq('following_address', following_address.toLowerCase())
      .single()

    return NextResponse.json({
      success: true,
      data: { is_following: !!follow }
    })

  } catch (error) {
    console.error('Error checking follow status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check follow status' },
      { status: 500 }
    )
  }
}
