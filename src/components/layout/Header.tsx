'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import WalletConnect from '@/components/wallet/WalletConnect'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-dark-bg via-dark-surface to-dark-bg border-b border-logo-electric/20 backdrop-blur-md shadow-lg shadow-logo-electric/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-logo-electric/20 via-logo-orange/5 to-logo-primary/20 border border-logo-electric/30 backdrop-blur-sm hover:border-logo-orange/40 transition-all duration-300 group-hover:shadow-glow">
              <img 
                src="/images/1002271631-removebg-preview.png" 
                alt="CivicAI Logo" 
                className="w-10 h-10 transition-all duration-300 group-hover:scale-110 object-contain group-hover:drop-shadow-[0_0_8px_rgba(255,107,26,0.8)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent text-glow">
                CivicAI
              </span>
            </div>
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
            <Link href="/proposals/create">
              <Button size="sm" className="bg-gradient-to-r from-logo-primary to-logo-accent hover:shadow-lg hover:shadow-logo-electric/30 transition-all duration-300 text-white font-semibold">
                Submit Proposal
              </Button>
            </Link>
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
                <Link href="/proposals/create">
                  <Button size="sm" className="bg-gradient-to-r from-logo-primary to-logo-accent hover:shadow-lg hover:shadow-logo-electric/30 transition-all duration-300 text-white font-semibold">
                    Submit Proposal
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}