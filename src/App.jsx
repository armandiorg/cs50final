import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { EventProvider } from './contexts/EventContext'
import MobileOnlyGuard from './components/MobileOnlyGuard'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

// Simple loading component
function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  )
}

// Protected Route component - only blocks if definitely not logged in
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // While loading, show spinner briefly
  if (loading) {
    return <LoadingScreen />
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()
  
  return (
    <Routes>
      {/* Login - redirect to home if already logged in */}
      <Route
        path="/login"
        element={
          loading ? <LoadingScreen /> : 
          user ? <Navigate to="/" replace /> : 
          <Login />
        }
      />
      
      {/* Signup - redirect to home if already logged in */}
      <Route
        path="/signup"
        element={
          loading ? <LoadingScreen /> : 
          user ? <Navigate to="/" replace /> : 
          <Signup />
        }
      />

      {/* Home - accessible to all, shows different content based on auth */}
      <Route path="/" element={<Home />} />
      
      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <MobileOnlyGuard>
            <AppRoutes />
          </MobileOnlyGuard>
        </EventProvider>
      </AuthProvider>
    </Router>
  )
}
