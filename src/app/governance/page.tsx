'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import VoteDelegation from '@/components/governance/VoteDelegation'

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-logo-primary opacity-5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-logo-accent opacity-5 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-logo-secondary opacity-5 rounded-full blur-3xl animate-float delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent mb-2">
              🏛️ Enhanced Governance
            </h1>
            <p className="text-text-secondary">
              Advanced governance features including vote delegation, proposal amendments, and multi-stage voting.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-logo-primary/20 to-logo-primary/20 border border-logo-primary/30 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-logo-primary text-xl">📝</span>
                </div>
                <h3 className="font-semibold text-text-primary">Amendments</h3>
              </div>
              <p className="text-sm text-text-secondary mb-2">
                Propose improvements to existing proposals during their amendment period.
              </p>
              <p className="text-xs text-logo-primary">
                Amendment period: First 3 days after proposal creation
              </p>
            </Card>

            <Card className="p-6 bg-dark-elevated border border-logo-accent/20 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-logo-accent/20 to-logo-accent/20 border border-logo-accent/30 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-logo-accent text-xl">🤝</span>
                </div>
                <h3 className="font-semibold text-text-primary">Delegation</h3>
              </div>
              <p className="text-sm text-text-secondary mb-2">
                Delegate your voting power to trusted community members.
              </p>
              <p className="text-xs text-logo-accent">
                Revocable at any time
              </p>
            </Card>

            <Card className="p-6 bg-dark-elevated border border-logo-secondary/20 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-logo-secondary/20 to-logo-secondary/20 border border-logo-secondary/30 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-logo-secondary text-xl">⚡</span>
                </div>
                <h3 className="font-semibold text-text-primary">Enhanced Voting</h3>
              </div>
              <p className="text-sm text-text-secondary mb-2">
                Multi-stage voting with improved quorum mechanisms.
              </p>
              <p className="text-xs text-logo-secondary">
                5% quorum threshold
              </p>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="p-6 mb-8 bg-dark-elevated border border-logo-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              How Enhanced Governance Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-text-primary mb-3 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-logo-primary/20 to-logo-primary/20 border border-logo-primary/30 text-logo-primary rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                  Amendment Period
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  For the first 3 days after a proposal is created, community members can propose amendments. 
                  Amendments require 50 I₵C tokens to propose and must receive majority support.
                </p>
                
                <h3 className="font-semibold text-text-primary mb-3 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-logo-accent/20 to-logo-accent/20 border border-logo-accent/30 text-logo-accent rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
                  Vote Delegation
                </h3>
                <p className="text-text-secondary text-sm">
                  Delegate your I₵C voting power to community experts or active participants. 
                  Your tokens remain in your wallet, but the delegate can vote with your combined power.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-3 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-logo-secondary/20 to-logo-secondary/20 border border-logo-secondary/30 text-logo-secondary rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
                  Enhanced Voting
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Voting power is calculated as your I₵C balance plus any delegated power. 
                  Proposals need 5% of total supply participation and simple majority to pass.
                </p>
                
                <h3 className="font-semibold text-text-primary mb-3 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-accent-orange/20 to-accent-orange/20 border border-accent-orange/30 text-accent-orange rounded-full flex items-center justify-center text-sm font-bold mr-2">4</span>
                  Rewards & Incentives
                </h3>
                <p className="text-text-secondary text-sm">
                  Earn I₵C tokens for participating: proposing amendments, voting on amendments, 
                  and maintaining active governance participation.
                </p>
              </div>
            </div>
          </Card>

          {/* Vote Delegation Section */}
          <VoteDelegation 
            onDelegationUpdate={() => {
              // Handle delegation updates
              console.log('Delegation updated')
            }}
          />

          {/* Governance Statistics */}
          <Card className="p-6 mt-8 bg-dark-elevated border border-logo-accent/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Governance Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-logo-primary">42</div>
                <div className="text-sm text-text-secondary">Active Proposals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-logo-accent">18</div>
                <div className="text-sm text-text-secondary">Amendments Proposed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-logo-secondary">156</div>
                <div className="text-sm text-text-secondary">Active Delegations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-orange">89%</div>
                <div className="text-sm text-text-secondary">Avg Participation</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
