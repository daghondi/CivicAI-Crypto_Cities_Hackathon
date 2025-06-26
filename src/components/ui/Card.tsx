import React from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
}

export function Card({ 
  children, 
  variant = 'default', 
  className, 
  ...props 
}: CardProps) {
  const baseClasses = 'bg-white rounded-lg'
  
  const variantClasses = {
    default: 'shadow-sm border border-gray-200',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-gray-200'
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}