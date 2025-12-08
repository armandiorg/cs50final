import { supabase } from '../lib/supabase'

/**
 * Chat Service
 * Handles all chat-related database operations
 */
export const chatService = {
  /**
   * Get chat messages for an event
   * @param {string} eventId - UUID of the event
   * @param {number} limit - Max messages to fetch
   * @returns {Promise<Array>} Messages ordered by time
   */
  async getMessages(eventId, limit = 100) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) throw new Error(`Failed to fetch messages: ${error.message}`)
    return data || []
  },

  /**
   * Send a chat message
   * @param {Object} messageData - Message details
   * @returns {Promise<Object>} Created message
   */
  async sendMessage({ event_id, user_id, user_name, message }) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        event_id,
        user_id,
        user_name,
        message: message.trim(),
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to send message: ${error.message}`)
    return data
  },

  /**
   * Subscribe to new messages for an event (real-time)
   * @param {string} eventId - UUID of the event
   * @param {function} callback - Function to call with new messages
   * @returns {Object} Subscription object (call .unsubscribe() to stop)
   */
  subscribeToMessages(eventId, callback) {
    const subscription = supabase
      .channel(`chat:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          callback(payload.new)
        }
      )
      .subscribe()

    return subscription
  },

  /**
   * Unsubscribe from chat messages
   * @param {Object} subscription - Subscription to remove
   */
  async unsubscribe(subscription) {
    if (subscription) {
      await supabase.removeChannel(subscription)
    }
  },
}
