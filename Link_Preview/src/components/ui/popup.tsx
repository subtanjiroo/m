import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'center' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg'
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'center',
  size = 'md',
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-20',
    bottom: 'items-end pb-20',
  }

  return (
    <div className={`fixed inset-0 z-50 flex justify-center ${positionClasses[position]} bg-black bg-opacity-50 transition-opacity`}>
      <div
        ref={popupRef}
        className={`${sizeClasses[size]} w-full bg-slate-800 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export default Popup 