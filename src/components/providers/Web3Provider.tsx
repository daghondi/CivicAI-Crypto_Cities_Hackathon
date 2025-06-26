'use client'

import { ThirdwebProvider } from '@thirdweb-dev/react'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { OPTIMISM_SEPOLIA, resolveENS, formatAddress } from '@/lib/thirdweb'

// Define Optimism Sepolia chain config for ThirdwebProvider
const optimismSepoliaChain = {
  chainId: 11155420,
  name: 'Optimism Sepolia',
  currency: 'ETH',
  rpcUrl: 'https://sepolia.optimism.io',
  explorerUrl: 'https://sepolia-optimism.etherscan.io'
}

// Web3 Context Type
interface Web3ContextType {
  address: string | null
  ensName: string | null
  isConnected: boolean
  isConnecting: boolean
  signer: ethers.Signer | null
  connect: () => Promise<void>
  disconnect: () => void
  switchToOptimismSepolia: () => Promise<void>
}

// Create Web3 Context
const Web3Context = createContext<Web3ContextType | null>(null)

// Hook to use Web3 Context
export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

// Web3 Provider Component
export default function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [ensName, setEnsName] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const walletSigner = provider.getSigner()
          const walletAddress = accounts[0]
          
          setAddress(walletAddress)
          setSigner(walletSigner)
          setIsConnected(true)
          
          // Resolve ENS name
          const ens = await resolveENS(walletAddress)
          setEnsName(ens)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet')
      return
    }

    try {
      setIsConnecting(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      const walletSigner = provider.getSigner()
      const walletAddress = await walletSigner.getAddress()
      
      setAddress(walletAddress)
      setSigner(walletSigner)
      setIsConnected(true)
      
      // Resolve ENS name
      const ens = await resolveENS(walletAddress)
      setEnsName(ens)
      
      // Switch to Optimism Sepolia if needed
      await switchToOptimismSepolia()
      
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setEnsName(null)
    setSigner(null)
    setIsConnected(false)
  }

  const switchToOptimismSepolia = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return

    try {
      // Try to switch to Optimism Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${OPTIMISM_SEPOLIA.chainId.toString(16)}` }]
      })
    } catch (switchError: any) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${OPTIMISM_SEPOLIA.chainId.toString(16)}`,
              chainName: OPTIMISM_SEPOLIA.name,
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: [OPTIMISM_SEPOLIA.rpcUrl],
              blockExplorerUrls: [OPTIMISM_SEPOLIA.explorerUrl]
            }]
          })
        } catch (addError) {
          console.error('Error adding Optimism Sepolia network:', addError)
        }
      } else {
        console.error('Error switching to Optimism Sepolia:', switchError)
      }
    }
  }

  const contextValue: Web3ContextType = {
    address,
    ensName,
    isConnected,
    isConnecting,
    signer,
    connect,
    disconnect,
    switchToOptimismSepolia
  }

  return (
    <ThirdwebProvider 
      activeChain={11155420}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <Web3Context.Provider value={contextValue}>
        {children}
      </Web3Context.Provider>
    </ThirdwebProvider>
  )
}
