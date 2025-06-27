'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import VoteDelegation from '@/components/governance/VoteDelegation'

export default function GovernancePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏛️ Enhanced Governance
          </h1>
          <p className="text-gray-600">
            Advanced governance features including vote delegation, proposal amendments, and multi-stage voting.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-blue-200 bg-blue-50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
              <h3 className="font-semibold text-blue-900">Amendments</h3>
            </div>
            <p className="text-sm text-blue-700 mb-2">
              Propose improvements to existing proposals during their amendment period.
            </p>
            <p className="text-xs text-blue-600">
              Amendment period: First 3 days after proposal creation
            </p>
          </Card>

          <Card className="p-6 border-green-200 bg-green-50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">🤝</span>
              </div>
              <h3 className="font-semibold text-green-900">Delegation</h3>
            </div>
            <p className="text-sm text-green-700 mb-2">
              Delegate your voting power to trusted community members.
            </p>
            <p className="text-xs text-green-600">
              Revocable at any time
            </p>
          </Card>

          <Card className="p-6 border-purple-200 bg-purple-50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-purple-900">Enhanced Voting</h3>
            </div>
            <p className="text-sm text-purple-700 mb-2">
              Multi-stage voting with improved quorum mechanisms.
            </p>
            <p className="text-xs text-purple-600">
              5% quorum threshold
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How Enhanced Governance Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                Amendment Period
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                For the first 3 days after a proposal is created, community members can propose amendments. 
                Amendments require 50 I₵C tokens to propose and must receive majority support.
              </p>
              
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
                Vote Delegation
              </h3>
              <p className="text-gray-600 text-sm">
                Delegate your I₵C voting power to community experts or active participants. 
                Your tokens remain in your wallet, but the delegate can vote with your combined power.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
                Enhanced Voting
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Voting power is calculated as your I₵C balance plus any delegated power. 
                Proposals need 5% of total supply participation and simple majority to pass.
              </p>
              
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">4</span>
                Rewards & Incentives
              </h3>
              <p className="text-gray-600 text-sm">
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
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Governance Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">42</div>
              <div className="text-sm text-gray-600">Active Proposals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-gray-600">Amendments Proposed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-600">Active Delegations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">89%</div>
              <div className="text-sm text-gray-600">Avg Participation</div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
