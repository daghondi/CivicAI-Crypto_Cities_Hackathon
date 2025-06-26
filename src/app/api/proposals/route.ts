import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/proposals - Fetch all proposals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    
    let query = supabase
      .from('proposal_summary')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/proposals - Create new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, created_by, ai_analysis } = body

    // Validate required fields
    if (!title || !description || !category || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, created_by' },
        { status: 400 }
      )
    }

    // Insert proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        title,
        description,
        category,
        created_by,
        status: 'draft',
        voting_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        required_votes: 10,
        current_votes: 0,
        impact_score: ai_analysis?.impact_score || 50
      })
      .select()
      .single()

    if (proposalError) {
      console.error('Proposal creation error:', proposalError)
      return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
    }

    // Insert AI analysis if provided
    if (ai_analysis && proposal) {
      const { error: analysisError } = await supabase
        .from('ai_analysis')
        .insert({
          proposal_id: proposal.id,
          feasibility_score: ai_analysis.feasibility_score,
          impact_prediction: ai_analysis.impact_score,
          cost_estimate: ai_analysis.cost_estimate,
          implementation_timeline: ai_analysis.timeline,
          potential_risks: ai_analysis.potential_risks || [],
          recommendations: ai_analysis.recommendations || [],
          raw_ai_response: ai_analysis
        })

      if (analysisError) {
        console.warn('AI analysis creation failed:', analysisError)
      }
    }

    return NextResponse.json(proposal, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
