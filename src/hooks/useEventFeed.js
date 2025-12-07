import { useMemo } from 'react'
import { useEvents } from '../contexts/EventContext'

/**
 * Custom hook for event feed with exclusivity logic
 * Applies RSVP-based unlocking: 0 RSVPs → 3 events, 1 RSVP → 6 events, 2+ RSVPs → all events
 */
export const useEventFeed = () => {
  const { events, rsvpCount, loading, error } = useEvents()

  // Calculate how many events should be visible based on RSVP count
  const unlockedCount = useMemo(() => {
    if (rsvpCount === 0) return 3
    if (rsvpCount === 1) return 6
    return 999 // Effectively all events
  }, [rsvpCount])

  // Split events into visible and locked
  const visibleEvents = useMemo(() => {
    return events.slice(0, unlockedCount)
  }, [events, unlockedCount])

  const lockedEvents = useMemo(() => {
    return events.slice(unlockedCount)
  }, [events, unlockedCount])

  const lockedCount = lockedEvents.length
  const hasLockedEvents = lockedCount > 0

  // Calculate unlock progress message
  const unlockMessage = useMemo(() => {
    if (rsvpCount === 0 && hasLockedEvents) {
      return 'RSVP to 1 event to see 6 events total'
    }
    if (rsvpCount === 1 && hasLockedEvents) {
      return 'RSVP to 1 more event to unlock all events'
    }
    if (rsvpCount >= 2) {
      return 'All events unlocked!'
    }
    return null
  }, [rsvpCount, hasLockedEvents])

  return {
    visibleEvents,
    lockedEvents,
    lockedCount,
    hasLockedEvents,
    rsvpCount,
    unlockedCount,
    unlockMessage,
    loading,
    error,
  }
}
