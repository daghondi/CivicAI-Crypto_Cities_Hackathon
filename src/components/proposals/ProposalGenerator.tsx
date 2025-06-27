'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Zap, Ch                    <DollarSign className="w-4 h-4 text-logo-orange" />
                    <h4 className="font-medium text-text-primary">Estimated Cost</h4>
                  </div>
                  <p className="text-logo-orange font-semibold text-lg">
                    ${generatedProposal.cost_estimate?.toLocaleString() || 'TBD'}
                  </p>cle, FileText, Save, AlertCircle, TrendingUp, Clock, DollarSign } from 'lucide-react'

interface ProposalGeneratorProps {
  problemData: any
  userAddress?: string
  onProposalGenerated?: (proposal: any) => void
  onProposalSaved?: (proposal: any) => void
}

export default function ProposalGenerator({ 
  problemData, 
  userAddress,
  onProposalGenerated, 
  onProposalSaved 
}: ProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedProposal, setGeneratedProposal] = useState<any>(null)
  const [savedProposal, setSavedProposal] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const generateProposal = async () => {
    setIsGenerating(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problemData.problem,
          location: problemData.location,
          category: problemData.category,
          urgency: problemData.urgency,
          save_to_db: false // Don't auto-save, let user decide
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate proposal')
      }

      const data = await response.json()
      setGeneratedProposal(data.proposal)
      setSuccess('Proposal generated successfully!')
      onProposalGenerated?.(data.proposal)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate proposal')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveProposal = async () => {
    if (!generatedProposal || !userAddress) {
      setError('Please connect your wallet to save proposals')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problemData.problem,
          location: problemData.location,
          category: problemData.category,
          urgency: problemData.urgency,
          save_to_db: true,
          user_address: userAddress
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save proposal')
      }

      const data = await response.json()
      setSavedProposal(data.saved_proposal)
      setSuccess('Proposal saved to your dashboard!')
      onProposalSaved?.(data.saved_proposal)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save proposal')
    } finally {
      setIsSaving(false)
    }
  }

  if (generatedProposal) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Proposal Generated!</h3>
            <p className="text-sm text-gray-600">Your civic proposal is ready for review</p>
          </div>
          {userAddress && !savedProposal && (
            <Button
              onClick={saveProposal}
              disabled={isSaving}
              size="sm"
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save to Dashboard
                </>
              )}
            </Button>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {savedProposal && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-700 text-sm font-medium">
              ✅ Proposal saved! View it in your dashboard.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Title</h4>
            <h2 className="text-xl font-semibold text-gray-800">{generatedProposal.title}</h2>
          </div>

          {/* Category and Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="capitalize">
                  {generatedProposal.category}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">Category</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">
                  {generatedProposal.impact_score || 85}
                </span>
              </div>
              <p className="text-xs text-gray-600">Impact Score</p>
            </div>
            {generatedProposal.feasibility_score && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    {generatedProposal.feasibility_score}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Feasibility</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Description</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {generatedProposal.description}
              </p>
            </div>
          </div>

          {/* Cost and Timeline */}
          {(generatedProposal.cost_estimate || generatedProposal.timeline) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedProposal.cost_estimate && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-medium text-gray-900">Estimated Cost</h4>
                  </div>
                  <p className="text-yellow-700 font-semibold text-lg">
                    ${generatedProposal.cost_estimate.toLocaleString()}
                  </p>
                </div>
              )}
              {generatedProposal.timeline && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Timeline</h4>
                  </div>
                  <p className="text-purple-700 font-semibold">{generatedProposal.timeline}</p>
                </div>
              )}
            </div>
          )}

          {/* Risks */}
          {generatedProposal.potential_risks && generatedProposal.potential_risks.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Potential Risks
              </h4>
              <div className="bg-orange-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {generatedProposal.potential_risks.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-orange-700">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {generatedProposal.recommendations && generatedProposal.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Recommendations
              </h4>
              <div className="bg-green-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {generatedProposal.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-green-700">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ICC Incentives */}
          {generatedProposal.icc_incentives && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                I₵C Rewards
              </h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-700 text-sm">{generatedProposal.icc_incentives}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-logo-orange/20 to-logo-orange-bright/20 border border-logo-orange/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm-glow">
          <Zap className="w-8 h-8 text-logo-orange" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Generate AI Proposal
        </h3>
        <p className="text-text-secondary mb-6">
          Transform your problem into a structured, actionable proposal using AI
        </p>

        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 mb-4 flex items-center gap-2 backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 text-danger" />
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={generateProposal}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-warm hover:bg-gradient-to-r hover:from-logo-orange-bright hover:to-logo-orange text-white font-semibold shadow-warm-glow hover:shadow-sunset-glow transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Proposal...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate Proposal
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
