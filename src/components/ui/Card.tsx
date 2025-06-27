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
    default: 'bg-gradient-card border border-dark-border shadow-xl',
    elevated: 'bg-gradient-card border border-dark-border shadow-2xl',
    outlined: 'bg-dark-surface border-2 border-infinita-electric shadow-lg shadow-infinita-electric/20',
    glow: 'bg-gradient-card border border-infinita-electric shadow-lg shadow-infinita-electric/30 animate-glow',
    gradient: 'bg-gradient-primary border border-primary-500 text-white shadow-xl'
  }

  const hoverClasses = hover 
    ? 'hover:scale-105 hover:shadow-2xl hover:border-infinita-electric cursor-pointer' 
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