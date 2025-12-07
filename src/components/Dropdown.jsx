import { useState, useRef, useEffect } from 'react'

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
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  const selectedLabel = options.find(opt => opt === value) || placeholder

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className={`label ${required ? 'label-required' : ''}`}>
          {label}
        </label>
      )}

      {/* Dropdown Button - Matches text input height */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          input w-full text-left flex items-center justify-between gap-2
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-crimson-primary)]'}
          ${!value ? 'text-[var(--color-gray-400)]' : ''}
          ${isOpen ? 'border-[var(--color-crimson-primary)] shadow-[0_0_0_1px_var(--color-crimson-primary)]' : ''}
        `}
      >
        <span className="text-base">{selectedLabel}</span>
        <svg
          className={`
            w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2
            ${isOpen ? 'rotate-180' : ''}
            ${disabled ? 'text-[var(--color-gray-500)]' : 'text-[var(--color-gray-400)]'}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu - Refined premium styling */}
      {isOpen && !disabled && (
        <div
          className="
            absolute z-50 w-full mt-2
            bg-[var(--color-black-soft)]
            border border-[var(--color-gray-700)]
            rounded-lg
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            max-h-60 overflow-y-auto
            animate-fade-in
          "
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[var(--color-gray-400)]">
              No options available
            </div>
          ) : (
            options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-3 py-2 text-left text-sm
                  transition-all duration-150
                  flex items-center min-h-[44px]
                  border-b border-[var(--color-gray-700)] last:border-b-0
                  ${option === value
                    ? 'bg-[var(--color-crimson-glow)] text-[var(--color-gray-100)] font-medium'
                    : 'text-[var(--color-gray-200)] hover:bg-[var(--color-black-elevated)] hover:text-[var(--color-gray-100)]'
                  }
                `}
                style={{
                  animationDelay: `${index * 20}ms`
                }}
              >
                {option}
                {option === value && (
                  <svg
                    className="w-4 h-4 ml-auto text-[var(--color-crimson-bright)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
