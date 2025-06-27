import { NextRequest, NextResponse } from 'next/server'
import { generateProposal, type ProposalGenerationRequest } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body: ProposalGenerationRequest & { 
      save_to_db?: boolean 
      user_address?: string 
    } = await request.json()
    
    // Validate required fields
    if (!body.problem || !body.category) {
      return NextResponse.json(
        { error: 'Problem description and category are required' },
        { status: 400 }
      )
    }

    if (body.problem.length < 10) {
      return NextResponse.json(
        { error: 'Problem description must be at least 10 characters long' },
        { status: 400 }
      )
    }

    if (body.problem.length > 2000) {
      return NextResponse.json(
        { error: 'Problem description must be less than 2000 characters' },
        { status: 400 }
      )
    }

    // Generate proposal using OpenAI
    const aiProposal = await generateProposal(body)
    
    let savedProposal = null

    // Optionally save to database
    if (body.save_to_db && body.user_address) {
      try {
        // Create the proposal in database
        const { data: proposal, error: proposalError } = await supabase
          .from('proposals')
          .insert({
            title: aiProposal.title,
            description: aiProposal.description,
            category: aiProposal.category,
            created_by: body.user_address,
            status: 'draft',
            voting_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            required_votes: 10,
            current_votes: 0,
            impact_score: aiProposal.impact_score || 50
          })
          .select()
          .single()

        if (proposalError) {
          console.error('Failed to save proposal:', proposalError)
        } else {
          savedProposal = proposal

          // Save AI analysis
          const { error: analysisError } = await supabase
            .from('ai_analysis')
            .insert({
              proposal_id: proposal.id,
              feasibility_score: aiProposal.feasibility_score || 50,
              impact_prediction: aiProposal.impact_score || 50,
              cost_estimate: aiProposal.cost_estimate || 0,
              implementation_timeline: aiProposal.timeline || 'TBD',
              potential_risks: aiProposal.potential_risks || [],
              recommendations: aiProposal.recommendations || [],
              raw_ai_response: aiProposal
            })

          if (analysisError) {
            console.warn('Failed to save AI analysis:', analysisError)
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Don't fail the entire request if DB save fails
      }
    }
    
    return NextResponse.json({
      proposal: aiProposal,
      saved_proposal: savedProposal,
      generation_time: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI generation error:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid JSON')) {
        return NextResponse.json(
          { error: 'AI service returned invalid response. Please try again.' },
          { status: 500 }
        )
      }
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service is not configured properly. Please contact support.' },
          { status: 503 }
        )
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in a moment.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate proposal. Please try again.' },
      { status: 500 }
    )
  }
}
