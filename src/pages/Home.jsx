import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

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

      {/* Main Content */}
      <main className="main-content">
        <div className="card">
          <h2 className="h2 mb-4">
            Welcome, {profile.full_name}!
          </h2>
          <p className="description mb-4">
            Events feed coming soon...
          </p>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Year</span>
              <span className="info-value">{profile.year}</span>
            </div>
            <div className="info-row">
              <span className="info-label">House</span>
              <span className="info-value">{profile.house}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{profile.email}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
