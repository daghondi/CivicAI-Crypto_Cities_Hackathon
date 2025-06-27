import React from 'react'
import { cn } from '@/lib/utils'
import { Check, X, Info, AlertTriangle } from 'lucide-react'

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  isVisible: boolean
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export function Toast({ 
  type, 
  title, 
  message, 
  isVisible, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: ToastProps) {
  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, isVisible, duration, onClose])

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />
  }

  const styles = {
    success: 'bg-dark-elevated border border-logo-accent/30 text-text-primary backdrop-blur-sm',
    error: 'bg-dark-elevated border border-red-400/30 text-text-primary backdrop-blur-sm',
    info: 'bg-dark-elevated border border-logo-primary/30 text-text-primary backdrop-blur-sm',
    warning: 'bg-dark-elevated border border-accent-orange/30 text-text-primary backdrop-blur-sm'
  }

  const iconStyles = {
    success: 'text-logo-accent bg-logo-accent/20 border border-logo-accent/30',
    error: 'text-red-400 bg-red-400/20 border border-red-400/30',
    info: 'text-logo-primary bg-logo-primary/20 border border-logo-primary/30',
    warning: 'text-accent-orange bg-accent-orange/20 border border-accent-orange/30'
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 w-96 max-w-sm rounded-lg shadow-lg transition-transform duration-300',
      isVisible ? 'translate-x-0' : 'translate-x-full',
      styles[type]
    )}>
      <div className="flex items-start gap-3 p-4">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          iconStyles[type]
        )}>
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
          {message && (
            <p className="text-sm text-text-secondary mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  className?: string
  children?: React.ReactNode
}

export function Alert({ type, title, message, className, children }: AlertProps) {
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />
  }

  const styles = {
    success: 'bg-dark-elevated border border-logo-accent/30 text-text-primary backdrop-blur-sm',
    error: 'bg-dark-elevated border border-red-400/30 text-text-primary backdrop-blur-sm',
    info: 'bg-dark-elevated border border-logo-primary/30 text-text-primary backdrop-blur-sm',
    warning: 'bg-dark-elevated border border-accent-orange/30 text-text-primary backdrop-blur-sm'
  }

  const iconStyles = {
    success: 'text-logo-accent',
    error: 'text-red-400',
    info: 'text-logo-primary',
    warning: 'text-accent-orange'
  }

  return (
    <div className={cn(
      'rounded-lg p-4',
      styles[type],
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0', iconStyles[type])}>
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1 text-text-primary">{title}</h4>
          {message && (
            <p className="text-sm text-text-secondary">{message}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

// Toast Context for global toast management
interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'isVisible' | 'onClose'>) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const showToast = React.useCallback((toast: Omit<ToastProps, 'isVisible' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = {
      ...toast,
      id,
      isVisible: true,
      onClose: () => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContext.Provider>
  )
}
