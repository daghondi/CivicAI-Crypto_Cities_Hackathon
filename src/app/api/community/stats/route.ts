import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/stats - Get community statistics
export async function GET() {
  try {
    // Get basic counts
    const [
      { count: totalUsers },
      { count: totalThreads },
      { count: totalComments },
      { count: totalProposals }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('discussion_threads').select('*', { count: 'exact', head: true }),
      supabase.from('proposal_comments').select('*', { count: 'exact', head: true }),
      supabase.from('proposals').select('*', { count: 'exact', head: true })
    ])

    // Get active users (last 24 hours and 7 days)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [
      { count: activeUsersToday },
      { count: activeUsersWeek }
    ] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', yesterday),
      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', lastWeek)
    ])

    // Get popular categories
    const { data: categoriesWithCounts } = await supabase
      .from('discussion_categories')
      .select(`
        *,
        thread_count:discussion_threads(count)
      `)
      .eq('is_active', true)
      .order('sort_order')

    const popularCategories = await Promise.all(
      (categoriesWithCounts || []).map(async (category) => {
        const { count } = await supabase
          .from('discussion_threads')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)

        return {
          category: {
            id: category.id,
            name: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon
          },
          thread_count: count || 0
        }
      })
    )

    // Get top contributors
    const { data: topContributors } = await supabase
      .from('user_profiles')
      .select('*')
      .order('reputation_score', { ascending: false })
      .limit(10)

    const topContributorsWithScore = (topContributors || []).map(user => ({
      user: {
        id: user.id,
        address: user.address,
        display_name: user.display_name,
        username: user.username,
        avatar_url: user.avatar_url,
        reputation_score: user.reputation_score
      },
      contribution_score: user.reputation_score
    }))

    const stats = {
      total_users: totalUsers || 0,
      total_threads: totalThreads || 0,
      total_comments: totalComments || 0,
      total_proposals: totalProposals || 0,
      active_users_today: activeUsersToday || 0,
      active_users_week: activeUsersWeek || 0,
      popular_categories: popularCategories.sort((a, b) => b.thread_count - a.thread_count),
      top_contributors: topContributorsWithScore
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching community stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community stats' },
      { status: 500 }
    )
  }
}
