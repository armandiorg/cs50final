import { useState, useEffect } from 'react'

/**
 * MobileOnlyGuard - Shows a message when viewport is too wide
 * Enforces mobile-first experience by detecting desktop viewports
 */
export default function MobileOnlyGuard({ children }) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkViewport = () => {
      // Consider desktop if width > 768px (tablet/desktop breakpoint)
      const isWideViewport = window.innerWidth > 768
      setIsDesktop(isWideViewport)
    }

    // Check on mount
    checkViewport()

    // Check on resize
    window.addEventListener('resize', checkViewport)

    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  if (isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg-primary)]">
        <div className="max-w-sm text-center">
          {/* Mobile Phone Icon - Fixed size to prevent scaling */}
          <div className="mb-6 flex justify-center">
            <svg
              className="text-[var(--color-crimson-primary)]"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              style={{ width: '48px', height: '48px' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="h1 text-gradient-crimson mb-3">
            Harvard Poops
          </h1>

          {/* Message */}
          <h2 className="h2 mb-4">
            Mobile Experience Only
          </h2>

          <p className="text-sm text-[var(--color-gray-300)] mb-4 leading-relaxed">
            Please access this site from your phone for the best experience.
          </p>

          {/* URL Instructions */}
          <div className="text-sm text-[var(--color-gray-400)]">
            <p className="mb-2">Open on your mobile device:</p>
            <div className="p-2 bg-[var(--color-black-elevated)] border border-[var(--color-gray-600)] rounded-lg">
              <code className="text-[var(--color-crimson-bright)] font-mono text-sm">
                harvardpoops.com
              </code>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return children
}
