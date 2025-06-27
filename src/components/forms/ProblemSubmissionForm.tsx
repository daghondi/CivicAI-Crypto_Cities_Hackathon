'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const PRE_FILLED_PROMPTS = [
  "What's a low-cost transport fix?",
  "What challenges do you face traveling between Pristine Bay and Duna?",
  "Would a connecting road between Pristine Bay and Duna improve your daily commute?",
  "How can we fix traffic on Main Street?",
  "What can we do about waste management in our district?",
  "How can we improve public safety in residential areas?",
  "How can we reduce unintentional misuse while keeping the store accessible and welcoming?",
  "How can we encourage honesty and responsibility when using shared community resources?",
  "Would a community tagging or borrowing log help track shared items more transparently?"
]

const CATEGORIES = [
  'infrastructure',
  'environment', 
  'economy',
  'healthcare',
  'education',
  'transportation',
  'housing',
  'safety',
  'technology',
  'governance'
] as const

interface FormData {
  problem: string
  category: string
  location: string
  urgency: 'low' | 'medium' | 'high'
}

interface ProblemSubmissionFormProps {
  onProposalGenerated?: (proposal: any) => void
}

export default function ProblemSubmissionForm({ onProposalGenerated }: ProblemSubmissionFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProposal, setGeneratedProposal] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      category: 'infrastructure',
      location: 'Próspera/Roatán',
      urgency: 'medium'
    }
  })

  const watchedProblem = watch('problem')

  const selectPrompt = (prompt: string) => {
    setValue('problem', prompt)
  }

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true)
    setError(null)
    setGeneratedProposal(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate proposal')
      }

      const proposal = await response.json()
      setGeneratedProposal(proposal)
      onProposalGenerated?.(proposal)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate proposal')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Submit a Civic Issue
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pre-filled prompts */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Quick Start Prompts
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PRE_FILLED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectPrompt(prompt)}
                  className="text-left p-3 text-sm bg-dark-surface/30 hover:bg-logo-electric/10 border border-logo-dark/20 
                           rounded-lg transition-all duration-200 hover:border-logo-electric/50 text-text-primary
                           backdrop-blur-sm hover:shadow-lg hover:shadow-logo-electric/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Problem description */}
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-text-primary mb-2">
              Describe the Problem *
            </label>
            <textarea
              {...register('problem', { required: 'Please describe the problem' })}
              id="problem"
              rows={4}
              className="w-full px-3 py-2 bg-dark-surface/30 border border-logo-dark/20 rounded-lg 
                       focus:ring-2 focus:ring-logo-electric/50 focus:border-logo-electric text-text-primary
                       placeholder-text-secondary backdrop-blur-sm"
              placeholder="Describe the civic issue you'd like to address..."
            />
            {errors.problem && (
              <p className="mt-1 text-sm text-red-400">{errors.problem.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: true })}
                id="category"
                className="w-full px-3 py-2 bg-dark-surface/30 border border-logo-dark/20 rounded-lg 
                         focus:ring-2 focus:ring-logo-electric/50 focus:border-logo-electric text-text-primary
                         backdrop-blur-sm"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                Location
              </label>
              <input
                {...register('location')}
                type="text"
                id="location"
                className="w-full px-3 py-2 bg-dark-surface/30 border border-logo-dark/20 rounded-lg 
                         focus:ring-2 focus:ring-logo-electric/50 focus:border-logo-electric text-text-primary
                         placeholder-text-secondary backdrop-blur-sm"
                placeholder="e.g., Pristine Bay, Duna"
              />
            </div>

            {/* Urgency */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-text-primary mb-2">
                Urgency
              </label>
              <select
                {...register('urgency')}
                id="urgency"
                className="w-full px-3 py-2 bg-dark-surface/30 border border-logo-dark/20 rounded-lg 
                         focus:ring-2 focus:ring-logo-electric/50 focus:border-logo-electric text-text-primary
                         backdrop-blur-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !watchedProblem}
            className="w-full"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-logo-electric mr-2"></div>
                Generating AI Proposal...
              </div>
            ) : (
              'Generate AI Proposal'
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </Card>

      {/* Generated proposal preview */}
      {generatedProposal && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            Generated Proposal Preview
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-text-primary">{generatedProposal.title}</h4>
              <p className="text-text-secondary mt-2">{generatedProposal.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-text-secondary">Impact Score:</span>
                <div className="text-lg font-bold text-logo-electric">{generatedProposal.impact_score}/100</div>
              </div>
              <div>
                <span className="font-medium text-text-secondary">Feasibility:</span>
                <div className="text-lg font-bold text-logo-mint">{generatedProposal.feasibility_score}/100</div>
              </div>
              <div>
                <span className="font-medium text-text-secondary">Cost:</span>
                <div className="text-lg font-bold text-logo-gold">${generatedProposal.cost_estimate?.toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-text-secondary">Timeline:</span>
                <div className="text-lg font-bold text-logo-electric">{generatedProposal.timeline}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-logo-dark/20">
              <Button 
                className="mr-3"
                onClick={async () => {
                  if (generatedProposal) {
                    // Submit to database via API
                    try {
                      const response = await fetch('/api/proposals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: generatedProposal.title,
                          description: generatedProposal.description,
                          category: generatedProposal.category,
                          created_by: 'demo-user', // In real app, get from auth
                          ai_analysis: generatedProposal
                        })
                      })
                      if (response.ok) {
                        alert('Proposal submitted successfully!')
                        setGeneratedProposal(null)
                      }
                    } catch (error) {
                      console.error('Submission error:', error)
                    }
                  }
                }}
              >
                Submit to Community
              </Button>
              <Button variant="secondary">
                Edit Proposal
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}