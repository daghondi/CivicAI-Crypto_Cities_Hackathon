'use client'

import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/walletconnect'

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
