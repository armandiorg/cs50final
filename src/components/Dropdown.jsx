import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  required = false,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // Calculate menu position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const menuHeight = Math.min(options.length * 44 + 16, 200) // Estimate menu height
      
      // Position menu above or below based on available space
      const shouldShowAbove = spaceBelow < menuHeight && rect.top > spaceBelow
      
      setMenuPosition({
        top: shouldShowAbove ? rect.top - menuHeight - 8 : rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        showAbove: shouldShowAbove
      })
    }
  }, [isOpen, options.length])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the dropdown button AND the menu
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target)
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(event.target)
      
      if (isOutsideDropdown && (isOutsideMenu || !menuRef.current)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // Close on scroll (only for page scroll, not menu scroll)
  useEffect(() => {
    if (isOpen) {
      const handleScroll = (e) => {
        // Don't close if scrolling inside the dropdown menu
        if (menuRef.current && menuRef.current.contains(e.target)) {
          return
        }
        setIsOpen(false)
      }
      window.addEventListener('scroll', handleScroll, true)
      return () => window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  const selectedLabel = options.find(opt => opt === value) || placeholder

  const dropdownMenu = isOpen && !disabled && createPortal(
    <div
      ref={menuRef}
      className="dropdown-menu-portal"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: menuPosition.top,
        left: menuPosition.left,
        width: menuPosition.width,
        zIndex: 9999,
        background: 'var(--color-black-soft)',
        border: '1px solid var(--color-gray-700)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        maxHeight: '200px',
        overflowY: 'auto',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      {options.length === 0 ? (
        <div style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--color-gray-400)' }}>
          No options available
        </div>
      ) : (
        options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            style={{
              width: '100%',
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              minHeight: '44px',
              borderBottom: '1px solid var(--color-gray-700)',
              background: option === value ? 'var(--color-crimson-glow)' : 'transparent',
              color: option === value ? 'var(--color-gray-100)' : 'var(--color-gray-200)',
              fontWeight: option === value ? '500' : '400',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
              border: 'none',
              outline: 'none',
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.background = option === value 
                ? 'var(--color-crimson-glow)' 
                : 'var(--color-black-elevated)'
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.background = option === value 
                ? 'var(--color-crimson-glow)' 
                : 'transparent'
            }}
          >
            <span style={{ flex: 1 }}>{option}</span>
            {option === value && (
              <svg
                style={{ width: '16px', height: '16px', color: 'var(--color-crimson-bright)' }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))
      )}
    </div>,
    document.body
  )

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className={`label ${required ? 'label-required' : ''}`}>
          {label}
        </label>
      )}

      {/* Dropdown Button - Compact for mobile */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          input w-full text-left flex items-center justify-between gap-1
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-crimson-primary)]'}
          ${!value ? 'text-[var(--color-gray-400)]' : ''}
          ${isOpen ? 'border-[var(--color-crimson-primary)] shadow-[0_0_0_1px_var(--color-crimson-primary)]' : ''}
        `}
        style={{
          padding: '10px 12px',
          fontSize: '14px',
        }}
      >
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          flex: 1,
          fontSize: '14px',
        }}>
          {selectedLabel}
        </span>
        <svg
          className={`
            transition-transform duration-200 flex-shrink-0
            ${isOpen ? 'rotate-180' : ''}
            ${disabled ? 'text-[var(--color-gray-500)]' : 'text-[var(--color-gray-400)]'}
          `}
          style={{ width: '14px', height: '14px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownMenu}
    </div>
  )
}
