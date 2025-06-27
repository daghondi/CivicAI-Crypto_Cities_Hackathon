import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/comments - Get comments for a proposal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const proposal_id = searchParams.get('proposal_id')

    if (!proposal_id) {
      return NextResponse.json(
        { success: false, error: 'proposal_id is required' },
        { status: 400 }
      )
    }

    // Get top-level comments
    const { data: comments, error } = await supabase
      .from('proposal_comments')
      .select(`
        *,
        author:user_profiles!author_address(*)
      `)
      .eq('proposal_id', proposal_id)
      .is('parent_comment_id', null)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    // Get replies for each comment
    for (const comment of comments || []) {
      const { data: replies } = await supabase
        .from('proposal_comments')
        .select(`
          *,
          author:user_profiles!author_address(*)
        `)
        .eq('parent_comment_id', comment.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      comment.replies = replies || []
    }

    return NextResponse.json({
      success: true,
      data: comments || []
    })

  } catch (error) {
    console.error('Error fetching proposal comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch proposal comments' },
      { status: 500 }
    )
  }
}

// POST /api/community/comments - Create comment on proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { proposal_id, content, parent_comment_id } = body

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
    if (!proposal_id || !content) {
      return NextResponse.json(
        { success: false, error: 'proposal_id and content are required' },
        { status: 400 }
      )
    }

    // Verify proposal exists
    const { data: proposal } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposal_id)
      .single()

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Create comment
    const { data: comment, error } = await supabase
      .from('proposal_comments')
      .insert({
        proposal_id,
        parent_comment_id,
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

    // Award reputation for commenting
    await supabase
      .from('reputation_events')
      .insert({
        user_address: author_address.toLowerCase(),
        event_type: 'comment_created',
        points: 3,
        related_id: comment.id,
        related_type: 'proposal_comment',
        description: 'Commented on proposal',
        created_at: new Date().toISOString()
      })

    // Update user reputation
    await supabase.rpc('update_user_reputation', {
      user_addr: author_address.toLowerCase(),
      points_delta: 3
    })

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_address: author_address.toLowerCase(),
        activity_type: 'comment_created',
        activity_data: { 
          comment_id: comment.id, 
          proposal_id,
          parent_comment_id 
        },
        created_at: new Date().toISOString()
      })

    // Create notification for proposal author (if not the commenter)
    const { data: proposalAuthor } = await supabase
      .from('proposals')
      .select('created_by')
      .eq('id', proposal_id)
      .single()

    if (proposalAuthor && proposalAuthor.created_by !== author_address.toLowerCase()) {
      await supabase
        .from('notifications')
        .insert({
          recipient_address: proposalAuthor.created_by,
          sender_address: author_address.toLowerCase(),
          type: 'comment_on_proposal',
          title: 'New Comment on Your Proposal',
          message: `Someone commented on your proposal`,
          related_id: proposal_id,
          related_type: 'proposal',
          action_url: `/proposals/${proposal_id}`,
          is_read: false,
          created_at: new Date().toISOString()
        })
    }

    return NextResponse.json({
      success: true,
      data: comment
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating proposal comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create proposal comment' },
      { status: 500 }
    )
  }
}
