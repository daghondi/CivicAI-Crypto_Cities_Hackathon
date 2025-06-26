import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = params.id

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Proposal ID is required' },
        { status: 400 }
      )
    }

    // Get proposal details
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        users!proposals_created_by_fkey (
          wallet_address,
          display_name,
          ens_name
        )
      `)
      .eq('id', proposalId)
      .single()

    if (proposalError) {
      console.error('Error fetching proposal:', proposalError)
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Get vote counts
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('proposal_id', proposalId)

    if (votesError) {
      console.error('Error fetching votes:', votesError)
      return NextResponse.json(
        { error: 'Error fetching vote data' },
        { status: 500 }
      )
    }

    // Calculate vote statistics
    const voteCounts = {
      for: 0,
      against: 0,
      abstain: 0
    }

    votes?.forEach(vote => {
      if (vote.vote_type in voteCounts) {
        voteCounts[vote.vote_type as keyof typeof voteCounts]++
      }
    })

    const totalVotes = voteCounts.for + voteCounts.against + voteCounts.abstain

    // Enhance proposal with vote data
    const enhancedProposal = {
      ...proposal,
      votes_for: voteCounts.for,
      votes_against: voteCounts.against,
      votes_abstain: voteCounts.abstain,
      total_votes: totalVotes,
      creator: proposal.users
    }

    return NextResponse.json({
      success: true,
      proposal: enhancedProposal
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = params.id
    const body = await request.json()

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Proposal ID is required' },
        { status: 400 }
      )
    }

    // Verify the proposal exists and get current data
    const { data: existingProposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single()

    if (fetchError || !existingProposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Prepare update data (only allow certain fields to be updated)
    const allowedUpdates = [
      'title',
      'description',
      'category',
      'impact_score',
      'cost_estimate',
      'timeline',
      'feasibility_score',
      'potential_risks',
      'recommendations',
      'icc_incentives',
      'status'
    ]

    const updateData: any = {}
    Object.keys(body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Add update timestamp
    updateData.updated_at = new Date().toISOString()

    // Update the proposal
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', proposalId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating proposal:', updateError)
      return NextResponse.json(
        { error: 'Failed to update proposal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      proposal: updatedProposal,
      message: 'Proposal updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = params.id

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Proposal ID is required' },
        { status: 400 }
      )
    }

    // Check if proposal exists
    const { data: existingProposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single()

    if (fetchError || !existingProposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Check if there are any votes (might want to prevent deletion if voted on)
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('id')
      .eq('proposal_id', proposalId)
      .limit(1)

    if (votesError) {
      console.error('Error checking votes:', votesError)
      return NextResponse.json(
        { error: 'Error checking proposal votes' },
        { status: 500 }
      )
    }

    if (votes && votes.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete proposal that has received votes' },
        { status: 400 }
      )
    }

    // Delete the proposal
    const { error: deleteError } = await supabase
      .from('proposals')
      .delete()
      .eq('id', proposalId)

    if (deleteError) {
      console.error('Error deleting proposal:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete proposal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
