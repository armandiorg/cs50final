import { supabase } from '../lib/supabase'

/**
 * Event Service
 * Handles all event-related database operations
 */
export const eventService = {
  /**
   * Fetch all published events
   * @returns {Promise<Array>} Published events ordered by date
   */
  async getPublishedEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .gte('date', new Date().toISOString().split('T')[0]) // Only future events
      .order('date', { ascending: true })

    if (error) throw new Error(`Failed to fetch events: ${error.message}`)
    return data || []
  },

  /**
   * Fetch event by ID
   * @param {string} eventId - UUID of the event
   * @returns {Promise<Object>} Event object
   */
  async getEventById(eventId) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (error) throw new Error(`Failed to fetch event: ${error.message}`)
    return data
  },

  /**
   * Create a new event
   * @param {Object} eventData - Event details
   * @returns {Promise<Object>} Created event
   */
  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        status: 'published', // Auto-publish for MVP
        has_rsvp: true, // Always enable RSVPs
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create event: ${error.message}`)
    return data
  },

  /**
   * Update an existing event
   * @param {string} eventId - UUID of the event
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated event
   */
  async updateEvent(eventId, updates) {
    const { data, error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update event: ${error.message}`)
    return data
  },

  /**
   * Delete an event
   * @param {string} eventId - UUID of the event
   */
  async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) throw new Error(`Failed to delete event: ${error.message}`)
  },

  /**
   * Subscribe to realtime event changes
   * @param {Function} callback - Called when events change
   * @returns {Function} Unsubscribe function
   */
  subscribeToEvents(callback) {
    const subscription = supabase
      .channel('events-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
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
