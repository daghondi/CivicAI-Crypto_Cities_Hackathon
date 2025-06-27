'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { useDiscussionCategories, useDiscussionThreads, useCommunityStats } from '@/hooks/useCommunity'
import type { DiscussionCategory, DiscussionThread } from '@/types/community'

export function DiscussionForum() {
  const { isConnected } = useWeb3()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const { categories, loading: categoriesLoading, error: categoriesError } = useDiscussionCategories()
  const { 
    threads, 
    loading: threadsLoading, 
    error: threadsError 
  } = useDiscussionThreads({ 
    category_id: selectedCategory === 'all' ? undefined : selectedCategory 
  })
  const { stats, loading: statsLoading } = useCommunityStats()
  
  const loading = categoriesLoading || threadsLoading
  const error = categoriesError || threadsError

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const getCategoryById = (categoryId: string) => {
    return categories?.find((cat: DiscussionCategory) => cat.id === categoryId)
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load forum</h3>
          <p className="text-gray-600">There was an error loading the community forum. Please try again later.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💬 Community Forum</h1>
          <p className="text-gray-600">Connect, discuss, and collaborate with your community</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!isConnected}
        >
          + New Thread
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📋 All Discussions
              </button>
              
              {categories?.map((category: DiscussionCategory) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.thread_count || 0}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="p-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Forum Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Threads</span>
                <span className="font-medium">{stats?.total_threads || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Replies</span>
                <span className="font-medium">{stats?.total_comments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Today</span>
                <span className="font-medium">{stats?.active_users_today || 0}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Threads List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : !threads || threads.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No threads yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to start a discussion in this category!
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start First Thread
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {threads?.map((thread: DiscussionThread) => {
                const category = getCategoryById(thread.category_id)
                
                return (
                  <Card key={thread.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      {/* Thread Icon */}
                      <div className="flex-shrink-0">
                        {thread.is_pinned ? (
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-600">📌</span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-600">{category?.icon || '💬'}</span>
                          </div>
                        )}
                      </div>

                      {/* Thread Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-grow">
                            {/* Title and Badges */}
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                {thread.title}
                              </h3>
                              {thread.is_pinned && (
                                <Badge className="bg-yellow-100 text-yellow-800">Pinned</Badge>
                              )}
                              {thread.proposal_id && (
                                <Badge className="bg-blue-100 text-blue-800">Proposal</Badge>
                              )}
                              {thread.is_locked && (
                                <Badge className="bg-red-100 text-red-800">Locked</Badge>
                              )}
                            </div>

                            {/* Category and Author */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              {category && (
                                <span 
                                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                  // Dynamic color from database - inline style required
                                  style={{ backgroundColor: category.color }}
                                >
                                  {category.name}
                                </span>
                              )}
                              <span>by</span>
                              <span className="font-medium">
                                {thread.author?.display_name || formatAddress(thread.author_address)}
                              </span>
                              {thread.author?.is_verified && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </div>

                            {/* Thread Preview */}
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {thread.content.length > 120 
                                ? `${thread.content.substring(0, 120)}...`
                                : thread.content
                              }
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex-shrink-0 text-right text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{thread.reply_count}</div>
                                <div className="text-xs">replies</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{thread.view_count}</div>
                                <div className="text-xs">views</div>
                              </div>
                            </div>
                            
                            {thread.last_reply_at && (
                              <div className="mt-2 text-xs">
                                <div>Last reply</div>
                                <div>{formatDate(thread.last_reply_at)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscussionForum
