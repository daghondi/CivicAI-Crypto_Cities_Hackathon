import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/categories - Get discussion categories
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('discussion_categories')
      .select(`
        *,
        thread_count:discussion_threads(count),
        latest_thread:discussion_threads(
          id,
          title,
          created_at,
          author:user_profiles!author_address(display_name, username)
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      throw error
    }

    // Transform the data to get proper counts and latest threads
    const transformedCategories = await Promise.all(
      (categories || []).map(async (category) => {
        // Get actual thread count
        const { count } = await supabase
          .from('discussion_threads')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)

        // Get latest thread
        const { data: latestThread } = await supabase
          .from('discussion_threads')
          .select(`
            id,
            title,
            created_at,
            author:user_profiles!author_address(display_name, username)
          `)
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          ...category,
          thread_count: count || 0,
          latest_thread: latestThread
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: transformedCategories
    })

  } catch (error) {
    console.error('Error fetching discussion categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discussion categories' },
      { status: 500 }
    )
  }
}
