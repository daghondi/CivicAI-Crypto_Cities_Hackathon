'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ContractUtils } from '@/lib/contracts'
import { useWeb3 } from '@/components/providers/Web3Provider'

interface Amendment {
  id: string
  proposalId: string
  proposer: string
  title: string
  description: string
  rationale: string
  createdAt: string
  supportVotes: string
  againstVotes: string
  approved: boolean
  applied: boolean
}

interface ProposalAmendmentListProps {
  proposalId: string
  onAmendmentUpdate?: () => void
}

export function ProposalAmendmentList({ proposalId, onAmendmentUpdate }: ProposalAmendmentListProps) {
  const { signer, isConnected, address } = useWeb3()
  const [amendments, setAmendments] = useState<Amendment[]>([])
  const [loading, setLoading] = useState(true)
  const [votingLoading, setVotingLoading] = useState<string | null>(null)
  const [applyingLoading, setApplyingLoading] = useState<string | null>(null)

  // Get provider from signer
  const provider = signer?.provider

  useEffect(() => {
    if (provider) {
      fetchAmendments()
    }
  }, [provider, proposalId])

  const fetchAmendments = async () => {
    if (!provider) return

    setLoading(true)
    try {
      const fetchedAmendments = await ContractUtils.getProposalAmendments(provider, proposalId)
      setAmendments(fetchedAmendments)
    } catch (error) {
      console.error('Error fetching amendments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoteOnAmendment = async (amendmentId: string, voteType: number) => {
    if (!signer || !isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setVotingLoading(amendmentId)

    try {
      const txHash = await ContractUtils.voteOnAmendment(signer, amendmentId, voteType)
      alert(`Vote cast successfully! Transaction: ${txHash}`)
      
      // Refresh amendments
      await fetchAmendments()
      onAmendmentUpdate?.()
      
    } catch (error: any) {
      console.error('Error voting on amendment:', error)
      alert(`Error voting: ${error.message}`)
    } finally {
      setVotingLoading(null)
    }
  }

  const handleApplyAmendment = async (amendmentId: string) => {
    if (!signer || !isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setApplyingLoading(amendmentId)

    try {
      const txHash = await ContractUtils.applyAmendment(signer, amendmentId)
      alert(`Amendment applied successfully! Transaction: ${txHash}`)
      
      // Refresh amendments
      await fetchAmendments()
      onAmendmentUpdate?.()
      
    } catch (error: any) {
      console.error('Error applying amendment:', error)
      alert(`Error applying amendment: ${error.message}`)
    } finally {
      setApplyingLoading(null)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (amendments.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        <p>No amendments proposed yet</p>
        <p className="text-sm mt-1">Be the first to suggest improvements!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Proposed Amendments ({amendments.length})
      </h3>
      
      {amendments.map((amendment) => (
        <Card key={amendment.id} className="p-6 border-l-4 border-l-yellow-400">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900">{amendment.title}</h4>
                {amendment.approved && (
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                )}
                {amendment.applied && (
                  <Badge className="bg-blue-100 text-blue-800">Applied</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Proposed by {formatAddress(amendment.proposer)} on {formatDate(amendment.createdAt)}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Description:</h5>
              <p className="text-gray-700 text-sm">{amendment.description}</p>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Rationale:</h5>
              <p className="text-gray-700 text-sm">{amendment.rationale}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600">
                ✓ Support: {parseFloat(amendment.supportVotes).toFixed(2)} I₵C
              </span>
              <span className="text-red-600">
                ✗ Against: {parseFloat(amendment.againstVotes).toFixed(2)} I₵C
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!amendment.approved && !amendment.applied && (
                <>
                  <Button
                    onClick={() => handleVoteOnAmendment(amendment.id, 1)} // For
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={votingLoading === amendment.id || !isConnected}
                  >
                    {votingLoading === amendment.id ? 'Voting...' : 'Support'}
                  </Button>
                  <Button
                    onClick={() => handleVoteOnAmendment(amendment.id, 0)} // Against
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    disabled={votingLoading === amendment.id || !isConnected}
                  >
                    {votingLoading === amendment.id ? 'Voting...' : 'Against'}
                  </Button>
                </>
              )}
              
              {amendment.approved && !amendment.applied && address && 
               (address.toLowerCase() === amendment.proposer.toLowerCase()) && (
                <Button
                  onClick={() => handleApplyAmendment(amendment.id)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={applyingLoading === amendment.id}
                >
                  {applyingLoading === amendment.id ? 'Applying...' : 'Apply Amendment'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ProposalAmendmentList
