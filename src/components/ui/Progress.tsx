'use client'

import React from 'react'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  color = 'blue' 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-300 ease-in-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
