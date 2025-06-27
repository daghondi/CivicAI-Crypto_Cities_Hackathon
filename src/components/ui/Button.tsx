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
    primary: 'bg-gradient-to-r from-logo-primary to-logo-accent hover:from-logo-primary/80 hover:to-logo-accent/80 text-white focus:ring-logo-primary shadow-lg hover:shadow-xl',
    secondary: 'bg-dark-elevated hover:bg-dark-muted text-text-primary border border-logo-primary/30 hover:border-logo-primary focus:ring-logo-primary',
    outline: 'border border-logo-accent text-logo-accent hover:bg-logo-accent/10 hover:border-logo-accent focus:ring-logo-accent backdrop-blur-sm',
    ghost: 'text-text-secondary hover:text-logo-accent hover:bg-logo-accent/10 focus:ring-logo-accent',
    glow: 'bg-gradient-to-r from-logo-accent to-logo-secondary text-dark-bg hover:shadow-lg hover:shadow-logo-accent/30 focus:ring-logo-accent animate-glow'
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