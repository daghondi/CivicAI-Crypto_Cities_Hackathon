import React from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ 
  children, 
  variant = 'default',
  size = 'md', 
  className, 
  ...props 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full backdrop-blur-sm border'
  
  const variantClasses = {
    default: 'bg-dark-elevated/80 text-text-primary border-logo-primary/30',
    primary: 'bg-gradient-to-r from-logo-primary/20 to-logo-primary/20 text-logo-primary border-logo-primary/40',
    secondary: 'bg-gradient-to-r from-logo-accent/20 to-logo-accent/20 text-logo-accent border-logo-accent/40',
    success: 'bg-gradient-to-r from-logo-accent/20 to-logo-accent/20 text-logo-accent border-logo-accent/40',
    warning: 'bg-gradient-to-r from-accent-orange/20 to-accent-gold/20 text-accent-orange border-accent-orange/40',
    danger: 'bg-gradient-to-r from-red-400/20 to-red-400/20 text-red-400 border-red-400/40'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }

  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}