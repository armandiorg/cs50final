import { supabase } from '../lib/supabase'

/**
 * RSVP Service
 * Handles all RSVP-related database operations
 */
export const rsvpService = {
  /**
   * Get user's total RSVP count
   * @param {string} userId - UUID of the user
   * @returns {Promise<number>} Number of RSVPs
   */
  async getUserRSVPCount(userId) {
    const { count, error } = await supabase
      .from('rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) throw new Error(`Failed to get RSVP count: ${error.message}`)
    return count || 0
  },

  /**
   * Check if user has RSVPed to a specific event
   * @param {string} userId - UUID of the user
   * @param {string} eventId - UUID of the event
   * @returns {Promise<boolean>} True if RSVPed
   */
  async hasRSVPed(userId, eventId) {
    const { data, error } = await supabase
      .from('rsvps')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle()

    if (error) throw new Error(`Failed to check RSVP status: ${error.message}`)
    return !!data
  },

  /**
   * Get all RSVPs for a user
   * @param {string} userId - UUID of the user
   * @returns {Promise<Array>} Array of RSVP objects
   */
  async getUserRSVPs(userId) {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to get user RSVPs: ${error.message}`)
    return data || []
  },

  /**
   * Get all RSVPs for a user with full event details
   * @param {string} userId - UUID of the user
   * @returns {Promise<Array>} Array of RSVP objects with event data
   */
  async getUserRSVPsWithEvents(userId) {
    const { data, error } = await supabase
      .from('rsvps')
      .select(`
        *,
        events (
          id,
          title,
          date,
          time,
          location,
          type,
          cover_image_url,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to get user RSVPs: ${error.message}`)
    
    // Filter out RSVPs where the event no longer exists or is not published
    return (data || []).filter(rsvp => rsvp.events && rsvp.events.status === 'published')
  },

  /**
   * Get RSVP count for an event
   * @param {string} eventId - UUID of the event
   * @returns {Promise<number>} Number of RSVPs for the event
   */
  async getEventRSVPCount(eventId) {
    const { count, error } = await supabase
      .from('rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    if (error) throw new Error(`Failed to get event RSVP count: ${error.message}`)
    return count || 0
  },

  /**
   * Create an RSVP
   * @param {Object} rsvpData - RSVP details {event_id, user_id, user_email, user_name}
   * @returns {Promise<Object>} Created RSVP
   */
  async createRSVP(rsvpData) {
    const { data, error} = await supabase
      .from('rsvps')
      .insert(rsvpData)
      .select()
      .single()

    if (error) {
      // Check if it's a duplicate RSVP error
      if (error.code === '23505') {
        throw new Error('You have already RSVPed to this event')
      }
      throw new Error(`Failed to create RSVP: ${error.message}`)
    }
    return data
  },

  /**
   * Cancel an RSVP
   * @param {string} userId - UUID of the user
   * @param {string} eventId - UUID of the event
   */
  async cancelRSVP(userId, eventId) {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId)

    if (error) throw new Error(`Failed to cancel RSVP: ${error.message}`)
  },

  /**
   * Subscribe to realtime RSVP changes for an event
   * @param {string} eventId - UUID of the event
   * @param {Function} callback - Called when RSVPs change
   * @returns {Function} Unsubscribe function
   */
  subscribeToEventRSVPs(eventId, callback) {
    const subscription = supabase
      .channel(`rsvps-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rsvps',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  },
}
