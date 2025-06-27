import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/discussions/[id] - Get discussion thread with replies
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get thread with details
    const { data: thread, error: threadError } = await supabase
      .from('discussion_threads')
      .select(`
        *,
        category:discussion_categories(*),
        author:user_profiles!author_address(*),
        last_reply_author:user_profiles!last_reply_by(*)
      `)
      .eq('id', id)
      .single()

    if (threadError) {
      throw threadError
    }

    // Get replies with nested structure
    const { data: replies, error: repliesError } = await supabase
      .from('discussion_replies')
      .select(`
        *,
        author:user_profiles!author_address(*)
      `)
      .eq('thread_id', id)
      .is('parent_reply_id', null)
      .order('created_at', { ascending: true })

    if (repliesError) {
      throw repliesError
    }

    // Get nested replies for each top-level reply
    for (const reply of replies || []) {
      const { data: nestedReplies } = await supabase
        .from('discussion_replies')
        .select(`
          *,
          author:user_profiles!author_address(*)
        `)
        .eq('parent_reply_id', reply.id)
        .order('created_at', { ascending: true })

      reply.replies = nestedReplies || []
    }

    // Increment view count
    await supabase
      .from('discussion_threads')
      .update({ view_count: (thread.view_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({
      success: true,
      data: {
        ...thread,
        replies: replies || []
      }
    })

  } catch (error) {
    console.error('Error fetching discussion thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discussion thread' },
      { status: 500 }
    )
  }
}

// PUT /api/community/discussions/[id] - Update discussion thread
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

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

    // Check if user owns the thread
    const { data: thread } = await supabase
      .from('discussion_threads')
      .select('author_address')
      .eq('id', id)
      .single()

    if (!thread || thread.author_address !== user_address.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Update thread
    const allowedFields = ['title', 'content']
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    )

    const { data: updatedThread, error } = await supabase
      .from('discussion_threads')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        category:discussion_categories(*),
        author:user_profiles!author_address(*)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: updatedThread
    })

  } catch (error) {
    console.error('Error updating discussion thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update discussion thread' },
      { status: 500 }
    )
  }
}

// DELETE /api/community/discussions/[id] - Delete discussion thread
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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

    // Check if user owns the thread
    const { data: thread } = await supabase
      .from('discussion_threads')
      .select('author_address')
      .eq('id', id)
      .single()

    if (!thread || thread.author_address !== user_address.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete thread (cascades to replies)
    const { error } = await supabase
      .from('discussion_threads')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Discussion thread deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting discussion thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete discussion thread' },
      { status: 500 }
    )
  }
}
