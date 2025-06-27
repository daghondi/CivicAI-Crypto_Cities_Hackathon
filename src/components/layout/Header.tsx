'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import WalletConnect from '@/components/wallet/WalletConnect'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-dark-bg border-b border-dark-border backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative logo-container p-1 rounded-lg">
              <img 
                src="/images/logo.svg" 
                alt="CivicAI Logo" 
                className="w-12 h-12 transition-all duration-300 group-hover:scale-110 logo-glow"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent">
              CivicAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-text-secondary hover:text-logo-accent transition-colors duration-300 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-logo-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/proposals" className="text-text-secondary hover:text-logo-accent transition-colors duration-300 relative group">
              Proposals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-logo-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/dashboard" className="text-text-secondary hover:text-logo-accent transition-colors duration-300 relative group">
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-logo-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletConnect />
            <Button size="sm" className="bg-gradient-logo hover:shadow-lg hover:shadow-logo-accent/30 transition-all duration-300">
              Submit Proposal
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-elevated transition-colors duration-300 text-text-secondary hover:text-logo-accent"
            aria-label="Toggle mobile menu"
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
          <div className="md:hidden py-4 border-t border-dark-border animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-text-secondary hover:text-logo-accent transition-colors duration-300">
                Home
              </Link>
              <Link href="/proposals" className="text-text-secondary hover:text-logo-accent transition-colors duration-300">
                Proposals
              </Link>
              <Link href="/dashboard" className="text-text-secondary hover:text-logo-accent transition-colors duration-300">
                Dashboard
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-dark-border">
                <WalletConnect />
                <Button size="sm" className="bg-gradient-logo hover:shadow-lg hover:shadow-logo-accent/30 transition-all duration-300">
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