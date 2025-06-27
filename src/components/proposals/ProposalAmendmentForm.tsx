'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ContractUtils } from '@/lib/contracts'
import { useWeb3 } from '@/components/providers/Web3Provider'

interface ProposalAmendmentFormProps {
  proposalId: string
  onAmendmentProposed?: () => void
}

export function ProposalAmendmentForm({ proposalId, onAmendmentProposed }: ProposalAmendmentFormProps) {
  const { signer, isConnected } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rationale: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signer || !isConnected) {
      alert('Please connect your wallet first')
      return
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.rationale.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      const txHash = await ContractUtils.proposeAmendment(
        signer,
        proposalId,
        formData.title,
        formData.description,
        formData.rationale
      )

      alert(`Amendment proposed successfully! Transaction: ${txHash}`)
      
      // Reset form
      setFormData({ title: '', description: '', rationale: '' })
      setShowForm(false)
      onAmendmentProposed?.()
      
    } catch (error: any) {
      console.error('Error proposing amendment:', error)
      alert(`Error proposing amendment: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!showForm) {
    return (
      <Card className="p-4 border-blue-200 bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Propose Amendment</h3>
            <p className="text-sm text-blue-700">
              Suggest improvements to this proposal
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!isConnected}
          >
            + Amendment
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-blue-200 bg-blue-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-blue-900">Propose Amendment</h3>
        <Button
          onClick={() => setShowForm(false)}
          variant="outline"
          size="sm"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amendment-title" className="block text-sm font-medium text-blue-900 mb-1">
            Amendment Title *
          </label>
          <Input
            id="amendment-title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Brief title for your amendment"
            className="w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="amendment-description" className="block text-sm font-medium text-blue-900 mb-1">
            Amendment Description *
          </label>
          <textarea
            id="amendment-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Detailed description of the proposed changes..."
            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="amendment-rationale" className="block text-sm font-medium text-blue-900 mb-1">
            Rationale *
          </label>
          <textarea
            id="amendment-rationale"
            value={formData.rationale}
            onChange={(e) => handleInputChange('rationale', e.target.value)}
            placeholder="Why is this amendment necessary? What problems does it solve?"
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="bg-blue-100 p-3 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Proposing an amendment requires 50 I₵C tokens and can only be done during the amendment period (first 3 days after proposal creation).
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isConnected}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Proposing...' : 'Propose Amendment'}
          </Button>
          <Button
            type="button"
            onClick={() => setShowForm(false)}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ProposalAmendmentForm
