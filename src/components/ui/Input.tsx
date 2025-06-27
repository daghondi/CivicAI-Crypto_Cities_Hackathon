import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  variant?: 'default' | 'outline' | 'filled'
  error?: boolean
}

export function Input({ 
  className = '', 
  variant = 'default',
  error = false,
  ...props 
}: InputProps) {
  const baseClasses = 'w-full px-3 py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg backdrop-blur-sm'
  
  const variantClasses = {
    default: 'bg-dark-elevated border border-logo-primary/30 text-text-primary placeholder-text-muted focus:ring-logo-primary focus:border-logo-primary',
    outline: 'bg-transparent border-2 border-logo-accent text-text-primary placeholder-text-muted focus:ring-logo-accent focus:border-logo-accent',
    filled: 'bg-dark-surface border border-transparent text-text-primary placeholder-text-muted focus:ring-logo-primary focus:border-logo-primary'
  }
  
  const errorClasses = error 
    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
    : ''
  
  const disabledClasses = 'disabled:bg-dark-muted disabled:text-text-muted disabled:cursor-not-allowed disabled:border-gray-600'

  return (
    <input
      className={clsx(
        baseClasses,
        variantClasses[variant],
        errorClasses,
        disabledClasses,
        className
      )}
      {...props}
    />
  )
}

export default Input
