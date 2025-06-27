import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/discussions - Get discussion threads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category_id = searchParams.get('category_id')
    const proposal_id = searchParams.get('proposal_id')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    let query = supabase
      .from('discussion_threads')
      .select(`
        *,
        category:discussion_categories(*),
        author:user_profiles!author_address(*),
        last_reply_author:user_profiles!last_reply_by(*)
      `)

    // Apply filters
    if (category_id) {
      query = query.eq('category_id', category_id)
    }

    if (proposal_id) {
      query = query.eq('proposal_id', proposal_id)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    // Get total count
    const { count: totalCount } = await supabase
      .from('discussion_threads')
      .select('*', { count: 'exact', head: true })

    // Get paginated results  
    const { data: threads, error } = await query
      .order('is_pinned', { ascending: false })
      .order('last_reply_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: threads || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        has_next: offset + limit < (totalCount || 0),
        has_prev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching discussion threads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discussion threads' },
      { status: 500 }
    )
  }
}

// POST /api/community/discussions - Create new discussion thread
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category_id, proposal_id } = body

    // Validate auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extract user address from auth token (simplified)
    const token = authHeader.split(' ')[1]
    const sessionData = JSON.parse(Buffer.from(token, 'base64').toString())
    const author_address = sessionData.address

    // Validate required fields
    if (!title || !content || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create thread
    const { data: thread, error } = await supabase
      .from('discussion_threads')
      .insert({
        title,
        content,
        category_id,
        proposal_id,
        author_address: author_address.toLowerCase(),
        is_pinned: false,
        is_locked: false,
        view_count: 0,
        reply_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        category:discussion_categories(*),
        author:user_profiles!author_address(*)
      `)
      .single()

    if (error) {
      throw error
    }

    // Award reputation for creating thread
    await supabase
      .from('reputation_events')
      .insert({
        user_address: author_address.toLowerCase(),
        event_type: 'thread_created',
        points: 5,
        related_id: thread.id,
        related_type: 'discussion_thread',
        description: 'Created discussion thread',
        created_at: new Date().toISOString()
      })

    // Update user reputation
    await supabase.rpc('update_user_reputation', {
      user_addr: author_address.toLowerCase(),
      points_delta: 5
    })

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_address: author_address.toLowerCase(),
        activity_type: 'thread_created',
        activity_data: { thread_id: thread.id, title },
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      data: thread
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating discussion thread:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create discussion thread' },
      { status: 500 }
    )
  }
}
