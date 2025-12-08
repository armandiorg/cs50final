import { useState, useCallback, useMemo, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEvents } from '../contexts/EventContext'
import { rsvpService } from '../services/rsvpService'

/**
 * Custom hook for RSVP functionality with optimistic updates
 * @param {string} eventId - UUID of the event
 */
export const useRSVP = (eventId) => {
  const { user, profile } = useAuth()
  const { userRSVPs, rsvpLoading, refreshUserRSVPs } = useEvents()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rsvpCount, setRsvpCount] = useState(0)

  // Fetch RSVP count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await rsvpService.getEventRSVPCount(eventId)
        setRsvpCount(count)
      } catch (err) {
        console.error('Error fetching RSVP count:', err)
      }
    }
    fetchCount()
  }, [eventId])

  // Check if user has RSVPed to this event
  // Returns null while loading to indicate "unknown" state
  const isRSVPed = useMemo(() => {
    if (rsvpLoading) return null // Unknown while loading
    return userRSVPs.some((rsvp) => rsvp.event_id === eventId)
  }, [userRSVPs, eventId, rsvpLoading])

  // Create RSVP
  const createRSVP = useCallback(async () => {
    if (!user || !profile) {
      throw new Error('Must be logged in to RSVP')
    }

    try {
      setLoading(true)
      setError(null)

      await rsvpService.createRSVP({
        event_id: eventId,
        user_id: user.id,
        user_email: profile.email,
        user_name: profile.full_name,
      })

      // Optimistic update for count
      setRsvpCount(prev => prev + 1)

      // Refresh user RSVPs to update UI
      await refreshUserRSVPs()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user, profile, eventId, refreshUserRSVPs])

  // Cancel RSVP
  const cancelRSVP = useCallback(async () => {
    if (!user) {
      throw new Error('Must be logged in to cancel RSVP')
    }

    try {
      setLoading(true)
      setError(null)

      await rsvpService.cancelRSVP(user.id, eventId)

      // Optimistic update for count
      setRsvpCount(prev => Math.max(0, prev - 1))

      // Refresh user RSVPs to update UI
      await refreshUserRSVPs()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user, eventId, refreshUserRSVPs])

  // Toggle RSVP (create if not RSVPed, cancel if RSVPed)
  const toggleRSVP = useCallback(async () => {
    if (isRSVPed) {
      await cancelRSVP()
    } else {
      await createRSVP()
    }
  }, [isRSVPed, createRSVP, cancelRSVP])

  return {
    isRSVPed,
    rsvpCount,
    loading,
    error,
    createRSVP,
    cancelRSVP,
    toggleRSVP,
  }
}
