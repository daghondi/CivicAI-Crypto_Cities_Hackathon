'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import WalletConnect from '@/components/wallet/WalletConnect'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CivicAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/proposals" className="text-gray-600 hover:text-primary-600 transition-colors">
              Proposals
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
              Dashboard
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletConnect />
            <Button size="sm">
              Submit Proposal
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/proposals" className="text-gray-600 hover:text-primary-600 transition-colors">
                Proposals
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <WalletConnect />
                <Button size="sm">
                  Submit Proposal
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}