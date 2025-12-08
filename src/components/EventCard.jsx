import { useNavigate } from 'react-router-dom'
import { useRSVP } from '../hooks/useRSVP'
import { imageService } from '../services/imageService'

/**
 * EventCard Component
 * Displays an individual event with RSVP functionality
 * Supports both unlocked (full details) and locked (teaser) states
 */
export default function EventCard({ event, isLocked = false, onClick }) {
  const { isRSVPed, rsvpCount, toggleRSVP, loading } = useRSVP(event.id)
  const navigate = useNavigate()

  // Format date: "Dec 15"
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

  // Render locked (blurred) card
  if (isLocked) {
    return (
      <div className="event-card event-card-locked">
        <div className="event-card-blur">
          <div className="event-card-image">
            {event.cover_image_url ? (
              <img src={event.cover_image_url} alt="Locked event" />
            ) : (
              <div className="event-card-placeholder">{getEventEmoji(event.type)}</div>
            )}
          </div>
          <div className="event-card-content">
            <h3 className="h3">{event.title}</h3>
            <p className="text-sm text-gray-400">
              {formatDate(event.date)} • {formatTime(event.time)}
            </p>
          </div>
        </div>
        <div className="event-card-lock-overlay">
          <div className="lock-icon">🔒</div>
          <p className="lock-text">RSVP to unlock</p>
        </div>
      </div>
    )
  }

  // Render unlocked card
  return (
    <div className="event-card" onClick={() => navigate(`/event/${event.id}`, { state: { event, isRSVPed, rsvpCount } })}>
      <div className="event-card-image">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={event.title} loading="lazy" />
        ) : (
          <div className="event-card-placeholder">{getEventEmoji(event.type)}</div>
        )}
      </div>

      <div className="event-card-content">
        {/* Event type badge */}
        {event.type && (
          <div className="flex gap-2 mb-3">
            <span className="badge badge-crimson">{event.type.toUpperCase()}</span>
            {isRSVPed && <span className="badge badge-success">RSVPed ✓</span>}
          </div>
        )}

        {/* Event title */}
        <h3 className="h3 mb-2">{event.title}</h3>

        {/* Event metadata */}
        <div className="metadata mb-4">
          {formatDate(event.date)} • {formatTime(event.time)}
          {event.location && (
            <>
              {' '}
              • <span className="location">{event.location}</span>
            </>
          )}
        </div>

        {/* Event description */}
        {event.description && (
          <p className="description mb-4 line-clamp-3">{event.description}</p>
        )}

        {/* RSVP button */}
        <button
          className={`btn ${isRSVPed ? 'btn-secondary' : 'btn-primary'} w-full`}
          onClick={(e) => {
            e.stopPropagation()
            toggleRSVP()
          }}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner spinner-sm"></span>
          ) : isRSVPed ? (
            'Cancel RSVP'
          ) : (
            'RSVP Now'
          )}
        </button>
      </div>
    </div>
  )
}
