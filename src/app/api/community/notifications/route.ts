import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unread_only = searchParams.get('unread_only') === 'true'

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
    const user_address = sessionData.address

    const offset = (page - 1) * limit

    let query = supabase
      .from('notifications')
      .select(`
        *,
        sender:user_profiles!sender_address(display_name, username, avatar_url)
      `)
      .eq('recipient_address', user_address.toLowerCase())

    if (unread_only) {
      query = query.eq('is_read', false)
    }

    // Get total count
    const { count: totalCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_address', user_address.toLowerCase())

    // Get paginated results
    const { data: notifications, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: notifications || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        has_next: offset + limit < (totalCount || 0),
        has_prev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// PUT /api/community/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notification_ids, mark_all } = body

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
    const user_address = sessionData.address

    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_address', user_address.toLowerCase())

    if (mark_all) {
      // Mark all notifications as read
    } else if (notification_ids && Array.isArray(notification_ids)) {
      // Mark specific notifications as read
      query = query.in('id', notification_ids)
    } else {
      return NextResponse.json(
        { success: false, error: 'notification_ids or mark_all is required' },
        { status: 400 }
      )
    }

    const { error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read'
    })

  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}
