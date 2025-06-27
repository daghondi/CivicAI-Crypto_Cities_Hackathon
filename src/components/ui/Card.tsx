import React from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'glow' | 'gradient'
  hover?: boolean
}

export function Card({ 
  children, 
  variant = 'default', 
  hover = false,
  className, 
  ...props 
}: CardProps) {
  const baseClasses = 'rounded-lg transition-all duration-300 backdrop-blur-sm'
  
  const variantClasses = {
    default: 'bg-dark-elevated border border-logo-primary/20 shadow-xl',
    elevated: 'bg-dark-elevated border border-logo-accent/30 shadow-2xl',
    outlined: 'bg-dark-surface border-2 border-logo-accent shadow-lg shadow-logo-accent/20',
    glow: 'bg-dark-elevated border border-logo-accent shadow-lg shadow-logo-accent/30 animate-glow',
    gradient: 'bg-gradient-to-br from-logo-primary/20 to-logo-accent/20 border border-logo-primary/30 text-text-primary shadow-xl'
  }

  const hoverClasses = hover 
    ? 'hover:scale-105 hover:shadow-2xl hover:border-logo-accent cursor-pointer' 
    : ''

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}