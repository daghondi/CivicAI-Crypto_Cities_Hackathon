import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/community/discussions/[id]/replies - Create reply to discussion thread
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: thread_id } = params
    const body = await request.json()
    const { content, parent_reply_id } = body

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
    const author_address = sessionData.address

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if thread exists and is not locked
    const { data: thread } = await supabase
      .from('discussion_threads')
      .select('is_locked')
      .eq('id', thread_id)
      .single()

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      )
    }

    if (thread.is_locked) {
      return NextResponse.json(
        { success: false, error: 'Thread is locked' },
        { status: 403 }
      )
    }

    // Create reply
    const { data: reply, error } = await supabase
      .from('discussion_replies')
      .insert({
        thread_id,
        parent_reply_id,
        content,
        author_address: author_address.toLowerCase(),
        upvotes: 0,
        downvotes: 0,
        is_flagged: false,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        author:user_profiles!author_address(*)
      `)
      .single()

    if (error) {
      throw error
    }

    // First get current reply count
    const { data: threadData } = await supabase
      .from('discussion_threads')
      .select('reply_count')
      .eq('id', thread_id)
      .single()

    // Update thread reply count and last reply info
    await supabase
      .from('discussion_threads')
      .update({
        reply_count: (threadData?.reply_count || 0) + 1,
        last_reply_at: new Date().toISOString(),
        last_reply_by: author_address.toLowerCase()
      })
      .eq('id', thread_id)

    // Award reputation for replying
    await supabase
      .from('reputation_events')
      .insert({
        user_address: author_address.toLowerCase(),
        event_type: 'reply_created',
        points: 2,
        related_id: reply.id,
        related_type: 'discussion_reply',
        description: 'Replied to discussion thread',
        created_at: new Date().toISOString()
      })

    // Update user reputation
    await supabase.rpc('update_user_reputation', {
      user_addr: author_address.toLowerCase(),
      points_delta: 2
    })

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_address: author_address.toLowerCase(),
        activity_type: 'reply_created',
        activity_data: { 
          reply_id: reply.id, 
          thread_id,
          parent_reply_id 
        },
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      data: reply
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating discussion reply:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create discussion reply' },
      { status: 500 }
    )
  }
}
