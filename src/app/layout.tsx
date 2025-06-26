import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Web3Provider from '@/components/providers/Web3Provider'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
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