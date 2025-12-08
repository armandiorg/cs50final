import { supabase } from '../lib/supabase'

/**
 * Voting Service
 * Handles all voting-related database operations
 */
export const votingService = {
  /**
   * Get all votes for an event
   * @param {string} eventId - UUID of the event
   * @returns {Promise<Array>} All votes for the event
   */
  async getVotes(eventId) {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('event_id', eventId)

    if (error) throw new Error(`Failed to fetch votes: ${error.message}`)
    return data || []
  },

  /**
   * Get vote counts grouped by option
   * @param {string} eventId - UUID of the event
   * @returns {Promise<Object>} Object with option_id as key and count as value
   */
  async getVoteCounts(eventId) {
    const { data, error } = await supabase
      .from('votes')
      .select('option_id, option_label')
      .eq('event_id', eventId)

    if (error) throw new Error(`Failed to fetch vote counts: ${error.message}`)
    
    // Group by option_id and count
    const counts = {}
    const labels = {}
    ;(data || []).forEach(vote => {
      counts[vote.option_id] = (counts[vote.option_id] || 0) + 1
      labels[vote.option_id] = vote.option_label
    })
    
    return { counts, labels }
  },

  /**
   * Check if user has voted
   * @param {string} eventId - UUID of the event
   * @param {string} userId - UUID of the user
   * @returns {Promise<Object|null>} User's vote or null
   */
  async getUserVote(eventId, userId) {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('event_id', eventId)
      .eq('voter_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check vote: ${error.message}`)
    }
    return data
  },

  /**
   * Cast a vote (one vote per user, no changes allowed)
   * @param {Object} voteData - Vote details
   * @returns {Promise<Object>} Created vote
   */
  async castVote({ event_id, option_id, option_label, voter_id }) {
    // First check if user already voted
    const existingVote = await this.getUserVote(event_id, voter_id)
    
    if (existingVote) {
      throw new Error('You already voted')
    }

    // Create new vote
    const { data, error } = await supabase
      .from('votes')
      .insert({ event_id, option_id, option_label, voter_id })
      .select()
      .single()

    if (error) throw new Error(`Failed to cast vote: ${error.message}`)
    return data
  },

  /**
   * Subscribe to vote changes (real-time)
   * @param {string} eventId - UUID of the event
   * @param {function} callback - Function to call with updates
   * @returns {Object} Subscription object
   */
  subscribeToVotes(eventId, callback) {
    const subscription = supabase
      .channel(`votes:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'votes',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          // Refetch counts on any change
          callback()
        }
      )
      .subscribe()

    return subscription
  },

  /**
   * Unsubscribe from votes
   * @param {Object} subscription - Subscription to remove
   */
  async unsubscribe(subscription) {
    if (subscription) {
      await supabase.removeChannel(subscription)
    }
  },
}
