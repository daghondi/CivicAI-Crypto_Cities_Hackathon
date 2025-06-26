import { NextRequest, NextResponse } from 'next/server'
import { generateProposal, type ProposalGenerationRequest } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body: ProposalGenerationRequest = await request.json()
    
    // Validate required fields
    if (!body.problem || !body.category) {
      return NextResponse.json(
        { error: 'Problem description and category are required' },
        { status: 400 }
      )
    }

    // Generate proposal using OpenAI
    const proposal = await generateProposal(body)
    
    return NextResponse.json(proposal)
  } catch (error) {
    console.error('AI generation error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate proposal. Please try again.' },
      { status: 500 }
    )
  }
}
