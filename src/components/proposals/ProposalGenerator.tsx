'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Zap, CheckCircle, FileText } from 'lucide-react'

interface ProposalGeneratorProps {
  problemData: any
  onProposalGenerated?: (proposal: any) => void
}

export function ProposalGenerator({ problemData, onProposalGenerated }: ProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProposal, setGeneratedProposal] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generateProposal = async () => {
    setIsGenerating(true)
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
          additionalInfo: problemData.additionalInfo
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate proposal')
      }

      const data = await response.json()
      setGeneratedProposal(data.proposal)
      onProposalGenerated?.(data.proposal)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate proposal')
    } finally {
      setIsGenerating(false)
    }
  }

  if (generatedProposal) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Proposal Generated!</h3>
            <p className="text-sm text-gray-600">Your civic proposal is ready for review</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Title</h4>
            <p className="text-gray-700">{generatedProposal.title}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {generatedProposal.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Category</h4>
              <Badge variant="secondary" className="capitalize">
                {generatedProposal.category}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Impact Score</h4>
              <div className="text-2xl font-bold text-blue-600">
                {generatedProposal.impact_score || 85}
              </div>
            </div>
          </div>

          {generatedProposal.cost_estimate && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Estimated Cost</h4>
              <p className="text-green-600 font-semibold">
                ${generatedProposal.cost_estimate.toLocaleString()}
              </p>
            </div>
          )}

          {generatedProposal.timeline && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Implementation Timeline</h4>
              <p className="text-gray-700">{generatedProposal.timeline}</p>
            </div>
          )}

          {generatedProposal.feasibility_score && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Feasibility Score</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${generatedProposal.feasibility_score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {generatedProposal.feasibility_score}/100
                </span>
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
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Generate AI Proposal
        </h3>
        <p className="text-gray-600 mb-6">
          Transform your problem into a structured, actionable proposal using AI
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={generateProposal}
          disabled={isGenerating}
          className="flex items-center gap-2"
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

export default ProposalGenerator
