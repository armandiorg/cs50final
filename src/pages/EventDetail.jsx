import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { eventService } from '../services/eventService'
import { rsvpService } from '../services/rsvpService'
import EditEventForm from '../components/EditEventForm'
import EventChat from '../components/EventChat'
import EventVoting from '../components/EventVoting'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile } = useAuth()
  
  // Use data from navigation state if available (for instant rendering)
  const initialEvent = location.state?.event ?? null
  const initialRSVPStatus = location.state?.isRSVPed ?? false
  const initialRSVPCount = location.state?.rsvpCount ?? 0
  
  const [event, setEvent] = useState(initialEvent)
  const [loading, setLoading] = useState(!initialEvent) // Only show loading if no initial event
  const [error, setError] = useState('')
  const [isRSVPed, setIsRSVPed] = useState(initialRSVPStatus)
  const [rsvpCount, setRsvpCount] = useState(initialRSVPCount)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    fetchEventAndRSVP()
  }, [id, user])

  const fetchEventAndRSVP = async () => {
    try {
      // Only show loading if we don't already have event data
      if (!event) {
        setLoading(true)
      }
      
      // Fetch event
      const data = await eventService.getEventById(id)
      setEvent(data)
      
      // If user is logged in, fetch RSVP status and count in parallel
      if (user) {
        const [hasRSVP, count] = await Promise.all([
          rsvpService.hasRSVPed(user.id, id),
          rsvpService.getEventRSVPCount(id)
        ])
        // Only update if different from initial (avoids flash if we had correct initial state)
        setIsRSVPed(hasRSVP)
        setRsvpCount(count)
      } else {
        // Still fetch count even if not logged in
        const count = await rsvpService.getEventRSVPCount(id)
        setRsvpCount(count)
      }
    } catch (err) {
      setError('Event not found')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async () => {
    if (!user || !profile) {
      navigate('/login')
      return
    }

    setRsvpLoading(true)
    try {
      if (isRSVPed) {
        await rsvpService.cancelRSVP(user.id, id)
        setIsRSVPed(false)
        setRsvpCount(prev => prev - 1)
      } else {
        await rsvpService.createRSVP({
          event_id: id,
          user_id: user.id,
          user_email: profile.email,
          user_name: profile.full_name,
        })
        setIsRSVPed(true)
        setRsvpCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('RSVP error:', err)
    } finally {
      setRsvpLoading(false)
    }
  }

  const handleEventUpdate = (updatedEvent) => {
    setEvent(updatedEvent)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await eventService.deleteEvent(id)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete event')
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  // Format date: "Saturday, December 15, 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Format time: "9:00 PM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const displayHour = hour % 12 || 12
    const period = hour >= 12 ? 'PM' : 'AM'
    return `${displayHour}:${minutes} ${period}`
  }

  // Get event type emoji
  const getEventEmoji = (type) => {
    const emojis = {
      party: '🎉',
      contest: '🏆',
      tailgate: '🏈',
      mixer: '🍹',
      other: '⭐',
    }
    return emojis[type] || emojis.other
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading event...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-black-true)' }}>
        <header className="header">
          <div className="header-content">
            <button onClick={() => navigate('/')} className="btn-text">
              ← Back
            </button>
            <h1 className="header-title">Event</h1>
            <div style={{ width: '60px' }}></div>
          </div>
        </header>
        <main className="main-content">
          <div className="card text-center">
            <p className="text-secondary">Event not found</p>
            <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
              Go Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  const isHost = user && event.host_id === user.id

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-black-true)' }}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} className="btn-text">
            ← Back
          </button>
          <h1 className="header-title">Event Details</h1>
          {isHost ? (
            <button 
              onClick={() => setShowEditModal(true)} 
              className="btn-text"
              style={{ color: 'var(--color-crimson-bright)' }}
            >
              Edit
            </button>
          ) : (
            <div style={{ width: '60px' }}></div>
          )}
        </div>
      </header>

      {/* Cover Image */}
      {event.cover_image_url ? (
        <div style={{
          width: '100%',
          height: '200px',
          overflow: 'hidden',
        }}>
          <img 
            src={event.cover_image_url} 
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '150px',
          background: 'var(--color-bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
        }}>
          {getEventEmoji(event.type)}
        </div>
      )}

      {/* Main Content */}
      <main className="main-content" style={{ paddingTop: 'var(--space-4)' }}>
        {/* Event Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          {/* Type Badge */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-3)' }}>
            {event.type && (
              <span className="badge badge-crimson">
                {event.type.toUpperCase()}
              </span>
            )}
            {isHost && (
              <span className="badge" style={{ background: 'var(--color-gray-700)' }}>
                YOUR EVENT
              </span>
            )}
            {isRSVPed && (
              <span className="badge badge-success">RSVPed ✓</span>
            )}
          </div>

          {/* Title */}
          <h1 className="h1" style={{ marginBottom: 'var(--space-2)' }}>
            {event.title}
          </h1>

          {/* Host */}
          {event.host_name && (
            <p className="text-sm text-secondary">
              Hosted by {event.host_name}
            </p>
          )}
        </div>

        {/* Event Info Card */}
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">📅 Date</span>
              <span className="info-value">{formatDate(event.date)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">🕘 Time</span>
              <span className="info-value">{formatTime(event.time)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📍 Location</span>
              <span className="info-value">{event.location}</span>
            </div>
            <div className="info-row">
              <span className="info-label">👥 Attending</span>
              <span className="info-value">{rsvpCount} {rsvpCount === 1 ? 'person' : 'people'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 className="h3" style={{ marginBottom: 'var(--space-3)' }}>About</h3>
            <p className="text-secondary" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {event.description}
            </p>
          </div>
        )}

        {/* Live Voting (Contest events only) */}
        {event.has_voting && event.type === 'contest' && (
          <EventVoting eventId={id} isHost={isHost} votingOptions={event.voting_options} />
        )}

        {/* Playlist Link */}
        {event.playlist_url && (
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 className="h3" style={{ marginBottom: 'var(--space-3)' }}>🎵 Playlist</h3>
            <a 
              href={event.playlist_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary w-full"
            >
              Open Playlist
            </a>
          </div>
        )}

        {/* Event Chat Button */}
        {event.has_chat && (
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <button
              onClick={() => setShowChat(true)}
              className="btn btn-secondary w-full"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
              }}
            >
              <span style={{ fontSize: '20px' }}>💬</span>
              Open Event Chat
            </button>
          </div>
        )}

        {/* RSVP Button */}
        <div style={{ 
          position: 'sticky', 
          bottom: 'var(--space-4)', 
          paddingTop: 'var(--space-4)',
          background: 'linear-gradient(transparent, var(--color-black-true) 20%)',
        }}>
          {isHost ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setShowEditModal(true)}
                className="btn btn-primary w-full"
                style={{ padding: '16px' }}
              >
                Edit Event
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-secondary w-full"
                style={{ 
                  padding: '16px',
                  color: 'var(--color-crimson-bright)',
                  borderColor: 'var(--color-crimson-primary)',
                }}
              >
                Delete Event
              </button>
            </div>
          ) : (
            <button
              onClick={handleRSVP}
              disabled={rsvpLoading}
              className={`btn ${isRSVPed ? 'btn-secondary' : 'btn-primary'} w-full`}
              style={{ 
                padding: '16px',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {rsvpLoading ? (
                <span className="spinner spinner-sm"></span>
              ) : isRSVPed ? (
                'Cancel RSVP'
              ) : (
                'RSVP to this Event'
              )}
            </button>
          )}
        </div>
      </main>

      {/* Edit Event Modal */}
      <EditEventForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        event={event}
        onUpdate={handleEventUpdate}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <h2 className="h2" style={{ marginBottom: 'var(--space-3)' }}>Delete Event?</h2>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
                This action cannot be undone. All RSVPs will be cancelled.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-primary"
                  style={{ 
                    flex: 1,
                    background: 'var(--color-crimson-primary)',
                  }}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Chat Modal */}
      <EventChat 
        eventId={id}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  )
}
