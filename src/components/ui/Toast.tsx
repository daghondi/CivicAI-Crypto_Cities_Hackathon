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
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  }

  const iconStyles = {
    success: 'text-green-500 bg-green-100',
    error: 'text-red-500 bg-red-100',
    info: 'text-blue-500 bg-blue-100',
    warning: 'text-yellow-500 bg-yellow-100'
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 w-96 max-w-sm bg-white border rounded-lg shadow-lg transition-transform duration-300',
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
          <h4 className="text-sm font-semibold">{title}</h4>
          {message && (
            <p className="text-sm opacity-90 mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
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
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  }

  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500'
  }

  return (
    <div className={cn(
      'border rounded-lg p-4',
      styles[type],
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0', iconStyles[type])}>
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
          {message && (
            <p className="text-sm opacity-90">{message}</p>
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
