import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEvents } from '../contexts/EventContext'
import { rsvpService } from '../services/rsvpService'

/**
 * Custom hook for RSVP functionality with optimistic updates
 * @param {string} eventId - UUID of the event
 */
export const useRSVP = (eventId) => {
  const { user, profile } = useAuth()
  const { userRSVPs, refreshUserRSVPs } = useEvents()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if user has RSVPed to this event
  const isRSVPed = useMemo(() => {
    return userRSVPs.some((rsvp) => rsvp.event_id === eventId)
  }, [userRSVPs, eventId])

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
    loading,
    error,
    createRSVP,
    cancelRSVP,
    toggleRSVP,
  }
}
