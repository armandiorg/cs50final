import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { eventService } from '../services/eventService'
import { rsvpService } from '../services/rsvpService'
import { useAuth } from './AuthContext'

const EventContext = createContext({})

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
}

export const EventProvider = ({ children }) => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [userRSVPs, setUserRSVPs] = useState([])
  const [rsvpCount, setRSVPCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true)

  // Memoized handler for realtime updates - uses ref to avoid stale closures
  const handleRealtimeEventUpdate = useCallback((payload) => {
    if (!isMountedRef.current) return // Don't update if unmounted

    const { eventType, new: newEvent, old: oldEvent } = payload

    if (eventType === 'INSERT' && newEvent.status === 'published') {
      setEvents((prev) => [...prev, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date)))
    } else if (eventType === 'UPDATE') {
      setEvents((prev) => prev.map((e) => (e.id === newEvent.id ? newEvent : e)))
    } else if (eventType === 'DELETE') {
      setEvents((prev) => prev.filter((e) => e.id !== oldEvent.id))
    }
  }, [])

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await eventService.getPublishedEvents()
      if (isMountedRef.current) {
        setEvents(data)
      }
    } catch (err) {
      console.error('Failed to load events:', err)
      if (isMountedRef.current) {
        setError(err.message)
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const loadUserRSVPs = useCallback(async () => {
    if (!user) return

    try {
      const data = await rsvpService.getUserRSVPs(user.id)
      if (isMountedRef.current) {
        setUserRSVPs(data)
        setRSVPCount(data.length)
      }
    } catch (err) {
      console.error('Failed to load user RSVPs:', err)
      if (isMountedRef.current) {
        setUserRSVPs([])
        setRSVPCount(0)
      }
    }
  }, [user])

  // Load events on mount
  useEffect(() => {
    isMountedRef.current = true
    loadEvents()

    return () => {
      isMountedRef.current = false
    }
  }, [loadEvents])

  // Load user RSVPs when user changes
  useEffect(() => {
    if (user) {
      loadUserRSVPs()
    } else {
      // Clear RSVPs when user logs out
      setUserRSVPs([])
      setRSVPCount(0)
    }
  }, [user, loadUserRSVPs])

  // Subscribe to realtime event changes
  useEffect(() => {
    const unsubscribe = eventService.subscribeToEvents(handleRealtimeEventUpdate)
    return unsubscribe
  }, [handleRealtimeEventUpdate])

  const refreshEvents = async () => {
    await loadEvents()
  }

  const refreshUserRSVPs = async () => {
    await loadUserRSVPs()
  }

  const value = {
    events,
    userRSVPs,
    rsvpCount,
    loading,
    error,
    refreshEvents,
    refreshUserRSVPs,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}
