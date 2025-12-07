import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import EventFeed from '../components/EventFeed'
import CreateEventButton from '../components/CreateEventButton'

export default function Home() {
  const { user, profile } = useAuth()

  if (!user || !profile) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <h1 className="h1 text-gradient-crimson">Harvard Poops</h1>
          <p className="text-sm text-secondary mb-8">
            The go-to social app for Harvard events
          </p>
          <div className="flex gap-4 justify-center">
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
