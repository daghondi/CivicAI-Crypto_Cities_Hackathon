import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/achievements - Get available achievements
export async function GET() {
  try {
    const { data: achievements, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points_reward', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: achievements || []
    })

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}
