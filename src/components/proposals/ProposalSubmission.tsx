'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSmartContracts } from '@/hooks/useSmartContracts'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AIProposalResponse } from '@/types'
import { ArrowLeft, Save, Upload, Coins } from 'lucide-react'

interface ProposalSubmissionProps {
  proposalData: AIProposalResponse
  onBack: () => void
  onProposalCreated: () => void
}

export default function ProposalSubmission({ 
  proposalData, 
  onBack, 
  onProposalCreated 
}: ProposalSubmissionProps) {
  const router = useRouter()
  const { createProposal, isConnected, loading, iccBalance } = useSmartContracts()
  const [submitMode, setSubmitMode] = useState<'database' | 'contract'>('database')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasEnoughICC = parseFloat(iccBalance) >= 100 // 100 I₵C required for on-chain proposals

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      if (submitMode === 'contract' && isConnected) {
        // Submit to smart contract
        const result = await createProposal(
          proposalData.title,
          proposalData.description,
          proposalData.category
        )
        
        if (result.success) {
          console.log('Proposal created on-chain with ID:', result.proposalId)
          console.log('Transaction hash:', result.transactionHash)
          
          // Also save to database with on-chain reference
          await saveToDatabase(true, result.proposalId, result.transactionHash)
        } else {
          throw new Error(result.error || 'Failed to create proposal on-chain')
        }
      } else {
        // Submit to database only
        await saveToDatabase(false)
      }
      
      onProposalCreated()
    } catch (err: any) {
      setError(err.message || 'Failed to create proposal')
    } finally {
      setSubmitting(false)
    }
  }

  const saveToDatabase = async (isOnChain = false, onChainId?: string, txHash?: string) => {
    const response = await fetch('/api/proposals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...proposalData,
        is_on_chain: isOnChain,
        on_chain_id: onChainId,
        transaction_hash: txHash,
        status: 'active'
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to save proposal')
    }

    return response.json()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </Button>
        
        <Badge variant="success">Ready to Submit</Badge>
      </div>

      {/* Proposal Preview */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{proposalData.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {proposalData.impact_score}/100
            </div>
            <div className="text-sm text-gray-600">Impact Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {proposalData.feasibility_score || 85}/100
            </div>
            <div className="text-sm text-gray-600">Feasibility</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${proposalData.cost_estimate?.toLocaleString() || 'TBD'}
            </div>
            <div className="text-sm text-gray-600">Est. Cost</div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{proposalData.description}</p>
        
        <div className="flex items-center space-x-2">
          <Badge variant="primary">{proposalData.category}</Badge>
          {proposalData.timeline && (
            <Badge variant="secondary">{proposalData.timeline}</Badge>
          )}
        </div>
      </Card>

      {/* Submission Mode */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Method</h3>
        
        <div className="space-y-4">
          {/* Database Submission */}
          <label htmlFor="database-submission" className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            submitMode === 'database' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="database-submission"
                name="submission-mode"
                checked={submitMode === 'database'}
                onChange={() => setSubmitMode('database')}
                className="text-blue-600"
              />
              <Save className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">Save to Platform</div>
                <div className="text-sm text-gray-600">Quick submission, editable later</div>
              </div>
            </div>
          </label>

          {/* Smart Contract Submission */}
          <label htmlFor="contract-submission" className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            submitMode === 'contract' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
          } ${!isConnected || !hasEnoughICC ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="contract-submission"
                name="submission-mode"
                checked={submitMode === 'contract'}
                onChange={() => setSubmitMode('contract')}
                disabled={!isConnected || !hasEnoughICC}
                className="text-purple-600"
              />
              <Upload className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <div className="font-medium flex items-center space-x-2">
                  <span>Submit On-Chain</span>
                  <Coins className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="text-sm text-gray-600">
                  Permanent, transparent, and earns rewards
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">100 I₵C required</div>
                <div className={`text-xs ${hasEnoughICC ? 'text-green-600' : 'text-red-600'}`}>
                  Your balance: {iccBalance} I₵C
                </div>
              </div>
            </div>
          </label>
        </div>

        {!isConnected && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Connect your wallet to enable on-chain proposal submission
            </p>
          </div>
        )}

        {isConnected && !hasEnoughICC && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              You need at least 100 I₵C tokens to submit proposals on-chain. 
              Participate in governance to earn more tokens!
            </p>
          </div>
        )}
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={submitting || loading}
          size="lg"
          className="w-full sm:w-auto"
        >
          {submitting || loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>
                {submitMode === 'contract' ? 'Creating On-Chain...' : 'Submitting...'}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {submitMode === 'contract' ? (
                <Upload className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {submitMode === 'contract' ? 'Submit On-Chain' : 'Submit Proposal'}
              </span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
