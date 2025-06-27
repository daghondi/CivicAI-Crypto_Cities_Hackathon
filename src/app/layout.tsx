import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Web3Provider from '@/components/providers/Web3Provider'

export const metadata: Metadata = {
  title: 'CivicAI - AI-Powered Civic Engagement',
  description: 'Empowering communities through AI-driven governance and civic participation in the digital age',
  icons: {
    icon: [
      {
        url: '/images/logo.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-dark-bg text-text-primary min-h-screen">
        <Web3Provider>
          <div id="root" className="min-h-screen bg-gradient-dark">
            <Header />
            <main className="relative">
              {children}
            </main>
          </div>
        </Web3Provider>
      </body>
    </html>
  )
}