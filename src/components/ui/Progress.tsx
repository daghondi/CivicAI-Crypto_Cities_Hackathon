'use client'

import React from 'react'
import { clsx } from 'clsx'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  variant?: 'primary' | 'accent' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  variant = 'primary',
  size = 'md',
  showLabel = false
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-logo-primary to-logo-accent',
    accent: 'bg-gradient-to-r from-logo-accent to-logo-primary',
    secondary: 'bg-gradient-to-r from-logo-secondary to-accent-orange',
    success: 'bg-gradient-to-r from-logo-accent to-logo-accent',
    warning: 'bg-gradient-to-r from-accent-orange to-accent-gold',
    danger: 'bg-gradient-to-r from-red-400 to-red-500'
  }

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-text-secondary">{Math.round(percentage)}%</span>
          <span className="text-sm text-text-muted">{value}/{max}</span>
        </div>
      )}
      <div className={clsx(
        'w-full bg-dark-bg/50 rounded-full overflow-hidden backdrop-blur-sm',
        sizeClasses[size],
        className
      )}>
        <div
          className={clsx(
            'h-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
