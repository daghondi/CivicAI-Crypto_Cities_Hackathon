'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWeb3 } from '@/components/providers/Web3Provider'
import ProblemSubmissionForm from '@/components/forms/ProblemSubmissionForm'
import ProposalGenerator from '@/components/proposals/ProposalGenerator'
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
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-10 rounded-full blur-3xl animate-float delay-2000"></div>
        </div>
        
        <Card className="p-8 text-center max-w-md bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm relative z-10">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-logo-primary/20 to-logo-accent/20 border border-logo-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-logo-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Wallet Required</h2>
            <p className="text-text-secondary mb-6">
              Please connect your wallet to create proposals and participate in governance.
            </p>
            <Button onClick={() => router.push('/')} className="bg-gradient-to-r from-logo-primary to-logo-accent hover:from-logo-primary/80 hover:to-logo-accent/80">
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
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-5 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-logo-secondary opacity-5 rounded-full blur-3xl animate-float delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={() => step === 'problem' ? router.back() : setStep('problem')}
            className="mb-4 bg-dark-elevated border-logo-primary/30 text-text-primary hover:bg-logo-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 'problem' ? 'Back' : 'Previous Step'}
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-logo-primary to-logo-accent rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent">Create New Proposal</h1>
              <p className="text-text-secondary">
                Help improve your community by proposing solutions to civic issues
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step === 'problem' ? 'text-logo-primary' : step === 'generate' || step === 'review' ? 'text-logo-accent' : 'text-text-muted'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'problem' ? 'bg-logo-primary/20 text-logo-primary border border-logo-primary/30' : 
                  step === 'generate' || step === 'review' ? 'bg-logo-accent/20 text-logo-accent border border-logo-accent/30' : 
                  'bg-dark-elevated text-text-muted border border-gray-600'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium">Define Problem</span>
              </div>
              
              <div className={`w-8 h-1 ${step === 'generate' || step === 'review' ? 'bg-logo-accent/30' : 'bg-gray-600'}`} />
              
              <div className={`flex items-center ${step === 'generate' ? 'text-logo-primary' : step === 'review' ? 'text-logo-accent' : 'text-text-muted'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'generate' ? 'bg-logo-primary/20 text-logo-primary border border-logo-primary/30' : 
                  step === 'review' ? 'bg-logo-accent/20 text-logo-accent border border-logo-accent/30' : 
                  'bg-dark-elevated text-text-muted border border-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Generate Solution</span>
              </div>
              
              <div className={`w-8 h-1 ${step === 'review' ? 'bg-logo-accent/30' : 'bg-gray-600'}`} />
              
              <div className={`flex items-center ${step === 'review' ? 'text-logo-primary' : 'text-text-muted'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'review' ? 'bg-logo-primary/20 text-logo-primary border border-logo-primary/30' : 'bg-dark-elevated text-text-muted border border-gray-600'
                }`}>
                  3
                </div>
                <span className="ml-2 font-medium">Review & Submit</span>
              </div>
            </div>
          </div>
        </div>
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
            <Card className="p-8 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  What civic issue would you like to address?
                </h2>
                <p className="text-text-secondary">
                  Describe the problem you've identified in your community. Be specific about 
                  the location, impact, and why this issue needs attention.
                </p>
              </div>
              <ProblemSubmissionForm onProposalGenerated={handleProblemSubmit} />
            </Card>
          )}

          {step === 'generate' && problemData && (
            <Card className="p-8 bg-dark-elevated border border-logo-accent/20 backdrop-blur-sm">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-logo-secondary to-accent-orange rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">AI-Powered Solution Generation</h2>
                    <p className="text-text-secondary">
                      Our AI will analyze your problem and generate a comprehensive proposal
                    </p>
                  </div>
                </div>
              </div>
              <ProposalGenerator
                problemData={problemData}
                userAddress={address || undefined}
                onProposalGenerated={handleProposalGenerated}
                onProposalSaved={handleProposalCreated}
              />
            </Card>
          )}

          {step === 'review' && (
            <Card className="p-8 bg-dark-elevated border border-logo-accent/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-logo-accent/20 to-logo-primary/20 border border-logo-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-logo-accent" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Proposal Created Successfully!</h2>
                <p className="text-text-secondary mb-6">
                  Your proposal has been submitted and is now available for community voting.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/proposals')} className="bg-gradient-to-r from-logo-primary to-logo-accent hover:from-logo-primary/80 hover:to-logo-accent/80">
                    View All Proposals
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard')} className="border-logo-secondary text-logo-secondary hover:bg-logo-secondary/10">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="p-6 bg-gradient-to-r from-logo-primary/10 to-logo-accent/10 border border-logo-primary/20 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-logo-primary to-logo-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Tips for Creating Effective Proposals</h3>
                <ul className="text-sm text-text-secondary space-y-1">
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
