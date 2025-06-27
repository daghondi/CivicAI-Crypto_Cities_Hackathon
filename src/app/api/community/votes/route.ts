import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/community/votes - Vote on comments or replies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { target_id, vote_type, target_type } = body

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

    // Validate input
    if (!target_id || !vote_type || !target_type) {
      return NextResponse.json(
        { success: false, error: 'target_id, vote_type, and target_type are required' },
        { status: 400 }
      )
    }

    if (!['upvote', 'downvote'].includes(vote_type)) {
      return NextResponse.json(
        { success: false, error: 'vote_type must be upvote or downvote' },
        { status: 400 }
      )
    }

    if (!['proposal_comment', 'discussion_reply'].includes(target_type)) {
      return NextResponse.json(
        { success: false, error: 'target_type must be proposal_comment or discussion_reply' },
        { status: 400 }
      )
    }

    // Check if user already voted on this target
    const { data: existingVote } = await supabase
      .from('vote_records')
      .select('*')
      .eq('user_address', user_address.toLowerCase())
      .eq('target_id', target_id)
      .single()

    const tableName = target_type === 'proposal_comment' ? 'proposal_comments' : 'discussion_replies'

    if (existingVote) {
      // User already voted - update or remove vote
      if (existingVote.vote_type === vote_type) {
        // Remove vote (toggle off)
        await supabase
          .from('vote_records')
          .delete()
          .eq('id', existingVote.id)

        // Update target vote count
        const updateField = vote_type === 'upvote' ? 'upvotes' : 'downvotes'
        
        // Get current count
        const { data: currentData } = await supabase
          .from(tableName)
          .select(updateField)
          .eq('id', target_id)
          .single()
        
        await supabase
          .from(tableName)
          .update({
            [updateField]: Math.max(0, ((currentData as any)?.[updateField] || 0) - 1)
          })
          .eq('id', target_id)

        return NextResponse.json({
          success: true,
          data: { action: 'removed', vote_type }
        })
      } else {
        // Change vote type
        await supabase
          .from('vote_records')
          .update({
            vote_type,
            created_at: new Date().toISOString()
          })
          .eq('id', existingVote.id)

        // Update target vote counts (decrease old, increase new)
        const oldField = existingVote.vote_type === 'upvote' ? 'upvotes' : 'downvotes'
        const newField = vote_type === 'upvote' ? 'upvotes' : 'downvotes'

        // Get current counts
        const { data: currentData } = await supabase
          .from(tableName)
          .select(`${oldField}, ${newField}`)
          .eq('id', target_id)
          .single()

        await supabase
          .from(tableName)
          .update({
            [oldField]: Math.max(0, ((currentData as any)?.[oldField] || 0) - 1),
            [newField]: ((currentData as any)?.[newField] || 0) + 1
          })
          .eq('id', target_id)

        return NextResponse.json({
          success: true,
          data: { action: 'changed', vote_type }
        })
      }
    } else {
      // New vote
      await supabase
        .from('vote_records')
        .insert({
          user_address: user_address.toLowerCase(),
          target_id,
          vote_type,
          created_at: new Date().toISOString()
        })

      // Update target vote count
      const updateField = vote_type === 'upvote' ? 'upvotes' : 'downvotes'
      
      // Get current count
      const { data: currentData } = await supabase
        .from(tableName)
        .select(updateField)
        .eq('id', target_id)
        .single()
      
      await supabase
        .from(tableName)
        .update({
          [updateField]: ((currentData as any)?.[updateField] || 0) + 1
        })
        .eq('id', target_id)

      // Award reputation for helpful voting (upvotes only)
      if (vote_type === 'upvote') {
        await supabase
          .from('reputation_events')
          .insert({
            user_address: user_address.toLowerCase(),
            event_type: 'helpful_vote',
            points: 1,
            related_id: target_id,
            related_type: target_type,
            description: 'Helpful vote on content',
            created_at: new Date().toISOString()
          })

        await supabase.rpc('update_user_reputation', {
          user_addr: user_address.toLowerCase(),
          points_delta: 1
        })
      }

      return NextResponse.json({
        success: true,
        data: { action: 'added', vote_type }
      })
    }

  } catch (error) {
    console.error('Error processing vote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}

// GET /api/community/votes - Get user's votes for targets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const target_ids = searchParams.get('target_ids')?.split(',')

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

    if (!target_ids || target_ids.length === 0) {
      return NextResponse.json({
        success: true,
        data: {}
      })
    }

    // Get user's votes for the specified targets
    const { data: votes, error } = await supabase
      .from('vote_records')
      .select('target_id, vote_type')
      .eq('user_address', user_address.toLowerCase())
      .in('target_id', target_ids)

    if (error) {
      throw error
    }

    // Transform to object with target_id as key
    const voteMap = (votes || []).reduce((acc, vote) => {
      acc[vote.target_id] = vote.vote_type
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      success: true,
      data: voteMap
    })

  } catch (error) {
    console.error('Error fetching user votes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user votes' },
      { status: 500 }
    )
  }
}
