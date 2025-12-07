import { useEventFeed } from '../hooks/useEventFeed'
import EventCard from './EventCard'

/**
 * EventFeed Component
 * Displays a vertical scroll feed of events with exclusivity logic
 * Mobile-first Instagram-style layout
 */
export default function EventFeed() {
  const {
    visibleEvents,
    lockedEvents,
    lockedCount,
    hasLockedEvents,
    rsvpCount,
    unlockMessage,
    loading,
    error,
  } = useEventFeed()

  // Loading state
  if (loading) {
    return (
      <div className="feed-loading">
        <div className="spinner spinner-lg"></div>
        <p className="loading-text">Loading events...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="feed-error card p-8 text-center">
        <h3 className="h3 mb-3">Failed to load events</h3>
        <p className="description mb-6">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  // Empty state (no events at all)
  if (visibleEvents.length === 0 && !hasLockedEvents) {
    return (
      <div className="feed-empty card p-12 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="h3 mb-3">No events yet</h3>
        <p className="description">Be the first to create an event!</p>
      </div>
    )
  }

  return (
    <div className="event-feed">
      {/* Unlock progress banner */}
      {hasLockedEvents && unlockMessage && (
        <div className="unlock-banner card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="h4 mb-2">🔓 Unlock More Events</h4>
              <p className="description">{unlockMessage}</p>
            </div>
            <div className="unlock-progress">
              <div className="unlock-count">
                {rsvpCount}
                <span className="unlock-count-label">RSVPs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event grid */}
      <div className="event-grid">
        {/* Visible (unlocked) events */}
        {visibleEvents.map((event) => (
          <EventCard key={event.id} event={event} isLocked={false} onClick={() => {}} />
        ))}

        {/* Locked event teasers */}
        {lockedEvents.slice(0, 3).map((event) => (
          <EventCard key={`locked-${event.id}`} event={event} isLocked={true} />
        ))}

        {/* Additional locked count */}
        {lockedCount > 3 && (
          <div className="locked-count-card card p-8 text-center">
            <div className="lock-icon-large mb-4">🔒</div>
            <h4 className="h4 mb-2">+{lockedCount - 3} More Events</h4>
            <p className="description">Keep RSVPing to unlock more exclusive events</p>
          </div>
        )}
      </div>
    </div>
  )
}
