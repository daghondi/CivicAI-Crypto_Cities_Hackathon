'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useWeb3 } from '@/components/providers/Web3Provider'
import { useProposalComments, useVoting } from '@/hooks/useCommunity'
import type { ProposalComment } from '@/types/community'

interface CommentSystemProps {
  proposalId: string
}

export function CommentSystem({ proposalId }: CommentSystemProps) {
  const { isConnected, address } = useWeb3()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const { 
    comments, 
    loading, 
    createComment, 
    error 
  } = useProposalComments(proposalId)
  
  const { vote } = useVoting()

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isConnected) return

    setSubmitting(true)
    try {
      await createComment({ content: newComment.trim() })
      setNewComment('')
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Error submitting comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim() || !isConnected) return

    setSubmitting(true)
    try {
      await createComment({ 
        content: replyText.trim(),
        parent_comment_id: parentId 
      })
      setReplyText('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Error submitting reply:', error)
      alert('Error submitting reply. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
    if (!isConnected) return

    try {
      await vote(commentId, voteType, 'proposal_comment')
      // Note: In a real implementation, you might want to refetch comments or optimistically update the UI
    } catch (error) {
      console.error('Error voting on comment:', error)
      alert('Error voting. Please try again.')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
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

  const CommentCard = ({ comment, isReply = false }: { comment: ProposalComment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {comment.author?.display_name 
              ? comment.author.display_name[0].toUpperCase() 
              : comment.author_address.slice(2, 4).toUpperCase()
            }
          </div>

          <div className="flex-grow">
            {/* Author and timestamp */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">
                {comment.author?.display_name || formatAddress(comment.author_address)}
              </span>
              {comment.author?.is_verified && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
              <span className="text-gray-500 text-sm">
                {formatDate(comment.created_at)}
              </span>
            </div>

            {/* Comment content */}
            <p className="text-gray-700 mb-3">{comment.content}</p>

            {/* Action buttons */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleVote(comment.id, 'upvote')}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                  comment.user_vote === 'upvote'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={!isConnected}
              >
                👍 {comment.upvotes}
              </button>
              
              <button
                onClick={() => handleVote(comment.id, 'downvote')}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                  comment.user_vote === 'downvote'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={!isConnected}
              >
                👎 {comment.downvotes}
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  disabled={!isConnected}
                >
                  Reply
                </button>
              )}
            </div>

            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-4 space-y-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyText.trim() || submitting}
                    size="sm"
                  >
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText('')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments?.length || 0})
        </h3>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">Error loading comments: {error}</p>
        </Card>
      )}

      {/* New comment form */}
      {isConnected ? (
        <Card className="p-4">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this proposal..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Comments help improve proposals and foster community discussion
              </p>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-gray-600">Connect your wallet to join the discussion</p>
        </Card>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : !comments || comments.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
          <p className="text-gray-600">
            Be the first to share your thoughts on this proposal!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments?.map((comment: ProposalComment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSystem
