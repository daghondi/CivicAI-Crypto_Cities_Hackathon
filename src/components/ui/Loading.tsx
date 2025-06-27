import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn(
      'animate-spin rounded-full border-2 border-logo-dark/20 border-t-logo-electric',
      sizeClasses[size],
      className
    )} />
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
}

export function LoadingOverlay({ isLoading, children, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-dark-surface/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-text-secondary font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-logo-dark/20 rounded h-4 mb-2 last:mb-0',
            className
          )}
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-dark-surface/50 border border-logo-dark/20 backdrop-blur-sm rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-logo-dark/20 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-logo-dark/20 rounded w-3/4 mb-2" />
          <div className="h-3 bg-logo-dark/20 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-logo-dark/20 rounded" />
        <div className="h-4 bg-logo-dark/20 rounded w-5/6" />
        <div className="h-4 bg-logo-dark/20 rounded w-4/6" />
      </div>
    </div>
  )
}

export function ProposalCardSkeleton() {
  return (
    <div className="bg-dark-surface/50 border border-logo-dark/20 backdrop-blur-sm rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-logo-dark/20 rounded w-20" />
        <div className="h-5 bg-logo-dark/20 rounded w-16" />
      </div>
      <div className="h-6 bg-logo-dark/20 rounded w-3/4 mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-logo-dark/20 rounded" />
        <div className="h-4 bg-logo-dark/20 rounded w-5/6" />
        <div className="h-4 bg-logo-dark/20 rounded w-4/6" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-logo-dark/20 rounded-full" />
          <div className="h-4 bg-logo-dark/20 rounded w-24" />
        </div>
        <div className="h-8 bg-logo-dark/20 rounded w-20" />
      </div>
    </div>
  )
}
