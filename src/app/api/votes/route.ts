import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyVoteSignature } from '@/lib/thirdweb'

// POST /api/votes - Submit a wallet-signed vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      proposal_id, 
      wallet_address, 
      vote_type, 
      reasoning, 
      signature, 
      timestamp,
      user_id // Optional: for backward compatibility
    } = body

    // Validate required fields for wallet-signed votes
    if (!proposal_id || !wallet_address || !vote_type || !signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: proposal_id, wallet_address, vote_type, signature, timestamp' },
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

    // Verify wallet signature
    const isValidSignature = verifyVoteSignature(
      signature,
      proposal_id,
      vote_type,
      reasoning || '',
      timestamp,
      wallet_address
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid wallet signature' },
        { status: 401 }
      )
    }

    // Check timestamp (votes must be recent - within 10 minutes)
    const now = Date.now()
    const tenMinutes = 10 * 60 * 1000
    if (now - timestamp > tenMinutes) {
      return NextResponse.json(
        { error: 'Vote signature expired. Please try again.' },
        { status: 400 }
      )
    }

    // Check if wallet already voted on this proposal (one vote per wallet)
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('proposal_id', proposal_id)
      .eq('wallet_address', wallet_address.toLowerCase())
      .single()

    if (existingVote) {
      return NextResponse.json(
        { error: 'This wallet has already voted on this proposal' },
        { status: 409 }
      )
    }

    // Create new wallet-signed vote
    const { data: vote, error } = await supabase
      .from('votes')
      .insert({
        proposal_id,
        wallet_address: wallet_address.toLowerCase(),
        vote_type,
        reasoning: reasoning || null,
        signature,
        timestamp,
        weight: 1,
        user_id: user_id || null // For backward compatibility
      })
      .select()
      .single()

    if (error) {
      console.error('Vote creation error:', error)
      return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
    }

    return NextResponse.json({ vote, message: 'Vote submitted successfully' }, { status: 201 })
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
    const walletAddress = searchParams.get('wallet_address')

    if (!proposalId) {
      return NextResponse.json({ error: 'proposal_id is required' }, { status: 400 })
    }

    // If checking for specific wallet vote
    if (walletAddress) {
      const { data: vote, error } = await supabase
        .from('votes')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Vote check error:', error)
        return NextResponse.json({ error: 'Failed to check vote' }, { status: 500 })
      }

      return NextResponse.json({ hasVoted: !!vote, vote })
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
