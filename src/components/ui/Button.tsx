import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg transform hover:scale-105 active:scale-95'
  
  const variantClasses = {
    primary: 'bg-gradient-primary hover:bg-gradient-accent text-white focus:ring-infinita-electric shadow-lg hover:shadow-xl',
    secondary: 'bg-dark-elevated hover:bg-dark-muted text-text-primary border border-dark-border hover:border-infinita-electric focus:ring-infinita-electric',
    outline: 'border border-infinita-electric text-infinita-electric hover:bg-infinita-electric hover:text-dark-bg focus:ring-infinita-electric',
    ghost: 'text-text-secondary hover:text-infinita-electric hover:bg-dark-elevated focus:ring-infinita-electric',
    glow: 'bg-gradient-accent text-dark-bg hover:shadow-lg hover:shadow-infinita-electric/30 focus:ring-infinita-electric animate-glow'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}