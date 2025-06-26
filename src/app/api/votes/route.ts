import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/votes - Submit a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { proposal_id, user_id, vote_type, reasoning } = body

    // Validate required fields
    if (!proposal_id || !user_id || !vote_type) {
      return NextResponse.json(
        { error: 'Missing required fields: proposal_id, user_id, vote_type' },
        { status: 400 }
      )
    }

    // Validate vote_type
    if (!['for', 'against', 'abstain'].includes(vote_type)) {
      return NextResponse.json(
        { error: 'Invalid vote_type. Must be: for, against, or abstain' },
        { status: 400 }
      )
    }

    // Check if user already voted on this proposal
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('proposal_id', proposal_id)
      .eq('user_id', user_id)
      .single()

    if (existingVote) {
      // Update existing vote
      const { data: vote, error } = await supabase
        .from('votes')
        .update({
          vote_type,
          reasoning,
          created_at: new Date().toISOString()
        })
        .eq('proposal_id', proposal_id)
        .eq('user_id', user_id)
        .select()
        .single()

      if (error) {
        console.error('Vote update error:', error)
        return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 })
      }

      return NextResponse.json({ vote, message: 'Vote updated successfully' })
    } else {
      // Create new vote
      const { data: vote, error } = await supabase
        .from('votes')
        .insert({
          proposal_id,
          user_id,
          vote_type,
          reasoning: reasoning || null,
          weight: 1
        })
        .select()
        .single()

      if (error) {
        console.error('Vote creation error:', error)
        return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
      }

      return NextResponse.json({ vote, message: 'Vote submitted successfully' }, { status: 201 })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/votes?proposal_id=xxx - Get votes for a proposal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const proposalId = searchParams.get('proposal_id')

    if (!proposalId) {
      return NextResponse.json({ error: 'proposal_id is required' }, { status: 400 })
    }

    const { data: votes, error } = await supabase
      .from('votes')
      .select(`
        *,
        users:user_id (username, avatar_url)
      `)
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Votes fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 })
    }

    // Calculate vote statistics
    const stats = {
      total_votes: votes.length,
      for_votes: votes.filter(v => v.vote_type === 'for').length,
      against_votes: votes.filter(v => v.vote_type === 'against').length,
      abstain_votes: votes.filter(v => v.vote_type === 'abstain').length,
      support_percentage: 0
    }

    stats.support_percentage = stats.total_votes > 0 
      ? Math.round((stats.for_votes / stats.total_votes) * 100)
      : 0

    return NextResponse.json({ votes, stats })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
