import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import EventFeed from '../components/EventFeed'
import CreateEventButton from '../components/CreateEventButton'

export default function Home() {
  const { user, profile, loading } = useAuth()

  // Show loading state only during initial auth check
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    )
  }

  // Not logged in - show landing page
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <h1 className="h1 text-gradient-crimson">Harvard Poops</h1>
          <p className="text-sm text-secondary mb-8">
            The go-to social app for Harvard events
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Logged in but profile still loading - show the main UI anyway
  // Profile will appear when it loads
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-black-true)' }}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Harvard Poops</h1>
          <Link to="/profile" className="header-link">
            Profile
          </Link>
        </div>
      </header>

      {/* Main Content - Event Feed */}
      <main className="main-content">
        <EventFeed />
      </main>

      {/* Floating Create Button */}
      <CreateEventButton />
    </div>
  )
}
