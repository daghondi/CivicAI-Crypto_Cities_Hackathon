'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWeb3 } from '@/components/providers/Web3Provider'
import ProblemSubmissionForm from '@/components/forms/ProblemSubmissionForm'
import { ProposalGenerator } from '@/components/proposals/ProposalGenerator'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Lightbulb, FileText, Zap } from 'lucide-react'

export default function CreateProposalPage() {
  const router = useRouter()
  const { isConnected, address } = useWeb3()
  const [step, setStep] = useState<'problem' | 'generate' | 'review'>('problem')
  const [problemData, setProblemData] = useState<any>(null)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Required</h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to create proposals and participate in governance.
            </p>
            <Button onClick={() => router.push('/')}>
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const handleProblemSubmit = (data: any) => {
    setProblemData(data)
    setStep('generate')
  }

  const handleProposalGenerated = () => {
    setStep('review')
  }

  const handleProposalCreated = () => {
    router.push('/proposals')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={() => step === 'problem' ? router.back() : setStep('problem')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 'problem' ? 'Back' : 'Previous Step'}
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Proposal</h1>
              <p className="text-gray-600">
                Help improve your community by proposing solutions to civic issues
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step === 'problem' ? 'text-blue-600' : step === 'generate' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'problem' ? 'bg-blue-100 text-blue-600' : 
                  step === 'generate' || step === 'review' ? 'bg-green-100 text-green-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium">Define Problem</span>
              </div>
              
              <div className={`w-8 h-1 ${step === 'generate' || step === 'review' ? 'bg-green-200' : 'bg-gray-200'}`} />
              
              <div className={`flex items-center ${step === 'generate' ? 'text-blue-600' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'generate' ? 'bg-blue-100 text-blue-600' : 
                  step === 'review' ? 'bg-green-100 text-green-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Generate Solution</span>
              </div>
              
              <div className={`w-8 h-1 ${step === 'review' ? 'bg-green-200' : 'bg-gray-200'}`} />
              
              <div className={`flex items-center ${step === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'review' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  3
                </div>
                <span className="ml-2 font-medium">Review & Submit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {step === 'problem' && (
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What civic issue would you like to address?
                </h2>
                <p className="text-gray-600">
                  Describe the problem you've identified in your community. Be specific about 
                  the location, impact, and why this issue needs attention.
                </p>
              </div>
              <ProblemSubmissionForm onProposalGenerated={handleProblemSubmit} />
            </Card>
          )}

          {step === 'generate' && problemData && (
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI-Powered Solution Generation</h2>
                    <p className="text-gray-600">
                      Our AI will analyze your problem and generate a comprehensive proposal
                    </p>
                  </div>
                </div>
              </div>
              <ProposalGenerator
                problemData={problemData}
                onProposalGenerated={handleProposalGenerated}
              />
            </Card>
          )}

          {step === 'review' && (
            <Card className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Created Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Your proposal has been submitted and is now available for community voting.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/proposals')}>
                    View All Proposals
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tips for Creating Effective Proposals</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Be specific about the problem location and affected population</li>
                  <li>• Include evidence or data supporting the need for action</li>
                  <li>• Consider potential costs and implementation challenges</li>
                  <li>• Think about how success would be measured</li>
                  <li>• Engage with community members to build support</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
