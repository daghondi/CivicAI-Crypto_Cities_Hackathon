import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Web3Provider from '@/components/providers/Web3Provider'

export const metadata: Metadata = {
  title: 'CivicAI - AI-Powered Civic Engagement',
  description: 'Empowering communities through AI-driven governance and civic participation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Web3Provider>
          <div id="root">
            <Header />
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  )
}